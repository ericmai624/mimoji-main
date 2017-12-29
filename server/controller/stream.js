const chalk = require('chalk');
const mime = require('mime-types');
const os = require('os');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const _ = require('lodash');
const util = require('../utilities');
const { createHash } = require('crypto');
const { sep } = path;

const mediaProcesses = {};
const finishedQueue = [];
const uniqueFilePath = new Set();

const openFileRecurr = (path, cb, retry = 0) => {
  fs.open(path, 'r', (err, fd) => {
    if (!err) return cb(null, fd);
    if (err && err.code === 'ENOENT' && retry < 10) {
      retry++;
      console.log(chalk.red('file not found, retrying ', retry, 'times'));
      return setTimeout(() => {
        openFileRecurr(path, cb, retry);
      }, 2000);
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
  console.log('removing ', filePath);
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
    return fs.readFileAsync(filePath, 'utf-8')
      .then((data) => {
        res.set({ 'Content-Type': 'application/vnd.apple.mpegurl' });
        return res.send(data);
      })
      .catch((err) => {
        console.log(chalk.red(err));
        res.sendStatus(500);
      });
  case '.ts':
    console.log(chalk.greenBright('start reading ', filePath));

    res.set({ 'Content-Type': 'video/MP2T'  });

    let stream = fs.createReadStream(filePath);

    stream.on('end', () => {
      console.log('stream finished: ', filePath);
      if (!uniqueFilePath.has(filePath)) {
        uniqueFilePath.add(filePath);
        finishedQueue.push(filePath);
      }
      if (finishedQueue.length > 5) {
        let trash = finishedQueue.shift();
        remove(trash);
        uniqueFilePath.delete(trash);
      }
    });

    return stream.pipe(res);
  default:
    console.log(chalk.red('unspported file'));
    res.sendStatus(500);
  }
};

const isSupported = (file) => {
  return mime.lookup(file) === 'video/mp4';
};

const transcodeMedia = (video, seek, output) => {
  let inputOptions = ['-loglevel panic'];

  if (seek) inputOptions.push(`-ss ${seek}`);

  console.log(chalk.cyan('seeking: ', seek ? seek : 0));

  const command = ffmpeg(video);

  command
    .inputOptions(inputOptions)
    .outputOptions([
      '-y',
      '-map 0:0',
      '-c:v libx264',
      `-threads ${os.cpus().length}`,
      '-map 0:1',
      '-c:a aac',
      '-movflags faststart',
      '-preset ultrafast',
      '-crf 17',
      '-tune zerolatency',
      '-f ssegment', // ssegment short for stream_segment
      '-segment_time 10',
      '-segment_format mpegts',
      `-segment_list ${path.join(output, 'index.m3u8')}`,
      '-segment_list_type m3u8',
      '-segment_start_number 0',
      '-segment_list_flags +live'
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
    .save(path.join(output, 'seq%010d.ts'));
    
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
      let command = transcodeMedia(v, s, folder);
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
  let filePath = path.join(os.tmpdir(), 'onecast', dir, file);
  console.log(chalk.green(filePath));

  openFileRecurr(filePath, (err, fd) => {
    if (!err) {
      console.log(chalk.magenta('start streaming...'));
      return streamFile(filePath, res);
    }
    console.log(chalk.red(err));
  });
};

module.exports.loadSubtitle = (req, res) => {
  let { sub, offset } = req.query;
  if (!sub || sub === '') return res.end();
  offset = parseFloat(offset);

  console.log(chalk.white('loading subtitle'));
  res.set({ 'Content-Type': 'text/vtt' });
  fs.readFileAsync(path.join(__dirname, '../../public/assets/blue.planet.vtt'), 'utf-8')
    .then(data => {
      if (offset === 0) return res.send(data);
      return res.send(util.webVTTParser(data, offset));
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

