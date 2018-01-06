const chalk = require('chalk');
const mime = require('mime-types');
const os = require('os');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const _ = require('lodash');
const util = require('../utilities');
const jschardet = require('jschardet');
const iconv = require('iconv-lite');
const { createHash } = require('crypto');
const { sep } = path;

const mediaProcesses = {};
const finishedQueue = [];
const uniqueFilePath = new Set();

const openFileRecurr = (path, cb, retry = 0) => {
  return fs.open(path, 'r', (err, fd) => {
    if (!err) return cb(null, fd);
    if (err && err.code === 'ENOENT' && retry < 20) {
      retry++;
      console.log(chalk.red('file not found, retrying ', retry, 'times'));
      return setTimeout(_.partial(openFileRecurr, path, cb, retry), 1000);
    }
    return cb(err);
  });
};

const createFolder = (dir) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(dir, (err) => {
      if (err && err.code !== 'EEXIST') reject(err);
      resolve();
    });
  });
};

const remove = (filePath) => {
  let isFulfilled = false;
  return fs.statAsync(filePath)
    .then((stats) => {
      if (stats.isFile()) return fs.unlinkAsync(filePath);
      else if (stats.isDirectory()) return fs.readdirAsync(filePath);
    })
    .then((files) => {
      if (!files) {
        isFulfilled = true;
        throw files;
      }

      let tasks = [];
      _.each(files, (file) => tasks.push(remove(path.join(filePath, file))));
      return Promise.all(tasks);
    })
    .then(() => {
      return fs.rmdirAsync(filePath);
    })
    .catch((err) => {
      if (isFulfilled) return console.log(chalk.green('removed ', filePath));

      console.log(chalk.red(err));
    });
};

const streamFile = (filePath, res) => {
  switch (path.extname(filePath)) {
  case '.m3u8':
    res.set({ 'Content-Type': 'application/x-mpegURL' });
    return fs.createReadStream(filePath, { highWaterMark: 128 * 1024 }).pipe(res);
  case '.ts':
    let stream = fs.createReadStream(filePath, { highWaterMark: 128 * 1024 });

    stream.on('end', () => {
      if (!uniqueFilePath.has(filePath)) {
        uniqueFilePath.add(filePath);
        finishedQueue.push(filePath);
      }
      if (finishedQueue.length > 2) {
        let trash = finishedQueue.shift();
        remove(trash);
        uniqueFilePath.delete(trash);
      }
    });

    return fs.stat(filePath, (err, stat) => {
      let headers = { 'Content-Type': 'video/MP2T' };
      if (stat) headers['Content-Length'] = stat.size;
      res.set(headers);
      return stream.pipe(res);
    });
  default:
    console.log(chalk.red('unspported file'));
    res.sendStatus(500);
  }
};

// const isSupported = (file) => {
//   return mime.lookup(file) === 'video/mp4';
// };

const getFramerate = (metadata) => {
  let framerate = metadata.streams.filter(stream => 
    stream['codec_type'] === 'video' && stream['codec_name'] !== 'mjpeg')[0]['r_frame_rate'].split('/');
  
  if (framerate.length === 1) return parseFloat(framerate[0]);
  if (framerate.length === 2) return parseFloat(framerate[0]) / parseFloat(framerate[1]);
  return 24; // fallback framerate
};

const transcodeMedia = (video, seek, output, metadata) => {
  let command = ffmpeg(video);
  let inputOptions = ['-loglevel panic', '-hide_banner', '-y'];
  let bitrate = 15; // output bitrate
  let framerate = getFramerate(metadata);
  if (typeof framerate !== 'number' || framerate < 0) framerate = 24; // fallback framerate
  console.log(chalk.white('framerate: ', framerate));
  if (seek) inputOptions.push(`-ss ${seek}`);
  console.log(chalk.cyan('seeking: ', seek ? seek : 0));

  command
    .inputOptions(inputOptions)
    .outputOptions([
      '-map 0:0',
      '-c:v libx264',
      '-pix_fmt yuv420p',
      // '-bsf:v h264_mp4toannexb', // convert bitstream
      // '-sc_threshold 0',
      `-g ${framerate * 2}`, // Keyframe interval
      // `-keyint_min ${framerate * 2}`,
      `-threads ${os.cpus().length}`,
      '-preset veryfast',
      `-b:v ${bitrate}m`,
      `-maxrate ${bitrate}m`,
      `-minrate ${bitrate}m`,
      `-bufsize ${bitrate * 1.5}m`,
      // '-profile:v high -level 4.1',
      '-map 0:1',
      '-c:a aac',
      '-ac 2',
      '-ar 48000',
      '-b:a 384k',
      // '-tune film',
      // '-f ssegment', // ssegment is short for stream_segment
      '-hls_time 4',
      '-hls_playlist_type vod',
      `-hls_segment_filename ${path.join(output, 'seq_%010d.ts')}`,
      // `-segment_list ${path.join(output, 'index.m3u8')}`,
      // '-segment_list_type m3u8',
      // '-segment_start_number 0',
      // '-segment_list_flags +live'
    ])
    .on('start', (command) => {
      console.log(chalk.blue('ffmpeg command: ', command));
    })
    .on('progress', (progress) => {
      console.log('Processing: ' + progress.percent + '% done');
    })
    .on('stderr', (stderrLine) => {
      console.log('Stderr output: ' + stderrLine);
    })
    .on('error', (err) => {
      console.log(chalk.red(err));
    })
    .on('end', () => {
      console.log(chalk.cyan('process finished'));
    })
    // .save(path.join(output, 'seq_%010d.ts'));
    .save(path.join(output, 'index.m3u8'));

    
  return command;
};

const terminateProcess = (id) => {
  if (mediaProcesses[id]) {
    mediaProcesses[id].command.kill();
    remove(path.join(os.tmpdir(), 'onecast', mediaProcesses[id].source));
    delete mediaProcesses[id];
    finishedQueue.length = 0;
    uniqueFilePath.clear();
  }
};

module.exports.createStreamProcess = (req, res) => {
  let { v, s } = req.query;
  if (!v || v === '') return res.end();
  let id = createHash('md5').update(v).digest('hex');
  let directory = path.join(os.tmpdir(), 'onecast');
  let getMetadata = new Promise((resolve, reject) => {
    ffmpeg.ffprobe(v, (err, metadata) => {
      if (err) reject(err);
      resolve(metadata);
    });
  });

  terminateProcess(id); // Kill any existing ffmpeg process and remove tmp files

  createFolder(directory)
    .then(() => {
      return Promise.all([ fs.mkdtempAsync(directory + sep), getMetadata ]);
    })
    .then(([folder, metadata]) => {
      let source = folder.slice(-6);
      let duration = metadata.format.duration;
      console.log(metadata);
      let command = transcodeMedia(v, s, folder, metadata);
      mediaProcesses[id] = { v, s, id, source, command };
      return res.json({ id, source, duration });
    })
    .catch((err) => {
      console.log(chalk.red(err));
      res.sendStatus(500);
    });
};

module.exports.serveFiles = (req, res) => {
  let { dir, file } = req.params;
  let { range } = req.headers;
  let filePath = path.join(os.tmpdir(), 'onecast', dir, file);
  if (range) console.log(chalk.cyan('range: ', range));

  openFileRecurr(filePath, (err, fd) => {
    if (!err) return streamFile(filePath, res);
    console.log(chalk.red(err));
  });
};

module.exports.loadSubtitle = (req, res) => {
  let { sub, offset, encoding } = req.query;
  if (!sub || sub === '') return res.end();
  offset = parseFloat(offset);
  let ext = path.extname(sub);
  
  console.log(chalk.white('loading subtitle...'));
  console.log(encoding);

  fs.readFileAsync(sub)
    .then(buffer => {
      let charset = jschardet.detect(buffer);
      let str = iconv.decode(buffer, charset.encoding);
      res.set({ 'Content-Type': `text/vtt; charset=${charset.encoding}` }); // set response header
      
      if (offset === 0 && ext === '.vtt') return res.send(str);
      return res.send(util.subParser(str, offset, ext));
    }) 
    .catch((err) => {
      console.log(chalk.red(err));
      res.sendStatus(500);
    });
};

module.exports.terminate = (req, res) => {
  // remove tmp folder
  console.log(chalk.blueBright('terminate request id: ', req.body.id));
  terminateProcess(req.body.id);
  res.sendStatus(200);
};

