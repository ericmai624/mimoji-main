const chalk = require('chalk');
const mime = require('mime-types');
const os = require('os');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const { createHash } = require('crypto');
const { sep } = path;

const mediaProcesses = {};

const openFileRecurr = (path, cb, retry=0) => {
  fs.open(path, 'r', (err, fd) => {
    if (!err) return cb(null, fd);
    if (err && err.code === 'ENOENT' && retry < 10) {
      console.log(chalk.red('file not found, retrying ', retry, 'times'));
      return setTimeout(() => {
        openFileRecurr(path, cb, retry + 1);
      }, 1000);
    }
    return cb(err);
  })
  return new Promise((resolve, reject) => {
    fs.open(path, 'r', (err, fd) => {
    });
  });
};

const createDirIfNotExist = (dir) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(dir, (err) => {
      if (err.code !== 'EEXIST') reject(err);
      resolve();
    });
  });
};

const streamFile = (filePath, res) => {
  switch (path.extname(filePath)) {
    case '.m3u8':
      console.log(chalk.bgYellow('start reading index.m3u8'));
      return fs.readFileAsync(filePath, 'utf-8')
        .then((data) => {
          res.set({ 'Content-Type': 'application/vnd.apple.mpegurl' });
          console.log(chalk.white('playlist: ', data));
          return res.send(data);
        })
        .catch((err) => {
          console.log(chalk.red(err));
          res.sendStatus(500);
        });
    case '.ts':
      console.log(chalk.bgYellow('start reading ', filePath));

      res.set({ 'Content-Type': 'video/MP2T'  });

      let stream = fs.createReadStream(filePath);

      stream.on('end', () => {
        console.log('stream finished: ', filePath);
        fs.unlink(filePath, (err) => console.log(chalk.red(err)));
      });

      return stream.pipe(res);
    default:
      console.log('unspported file');
      res.sendStatus(500);
  }
};

const isSupported = (file) => {
  return mime.lookup(file) === 'video/mp4';
}

const transcodeMedia = (video, seek, output) => {
  let inputOptions = ['-loglevel panic'];

  if (seek) {
    inputOptions.push(`-ss ${seek}`);
  }

  console.log(chalk.cyan('seeking: ', seek ? seek : 0));

  const command = ffmpeg(video);

  command
    .inputOptions(inputOptions)
    .outputOptions([
      '-y',
      '-map 0:0',
      '-map 0:1',
      `-c:v ${isSupported(video) ? 'copy' : 'libx264'}`,
      `-threads ${os.cpus().length}`,
      '-c:a copy',
      '-movflags faststart',
      '-preset ultrafast',
      '-crf 17',
      '-tune zerolatency',
      '-f segment',
      '-segment_time 8',
      '-segment_format mpegts',
      `-segment_list ${output}${sep}index.m3u8`,
      '-segment_list_type m3u8',
      '-segment_start_number 0',
      '-segment_list_flags live'
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
    .save(`${output}${sep}file%d.ts`);
    
  return command;
};

module.exports.stream = (req, res) => {
  let { dir, file } = req.params;
  let filePath = [os.tmpdir(), 'onecast', dir, file].join(sep);
  console.log(chalk.green(filePath));

  openFileRecurr(filePath, (err, fd) => {
    if (!err) {
      console.log(chalk.magenta('start streaming...'));
      return streamFile(filePath, res);
    }
    console.log(chalk.red(err));
  });
};

module.exports.createStreamProcess = (req, res) => {
  let { v, s } = req.query;
  let id = createHash('md5').update(v).digest('hex');
  let directory = path.join(os.tmpdir() + `${sep}onecast`);
  let response = { v, id };
  let getMetadata = new Promise((resolve, reject) => {
    ffmpeg.ffprobe(v, (err, metadata) => {
      if (err) reject(err);
      resolve(metadata);
    });
  });

  createDirIfNotExist(directory)
    .then(() => {
      return Promise.all([ fs.mkdtempAsync(directory + sep), getMetadata ]);
    })
    .then(([folder, metadata]) => {
      if (mediaProcesses[id]) mediaProcesses[id].process.kill();
      response.folder = folder.slice(-6);
      response.metadata = metadata;
      response.process = transcodeMedia(v, s, folder);
      mediaProcesses[id] = response;
      return res.json(response);
    })
    .catch((err) => {
      console.log(chalk.red(err));
      res.sendStatus(500);
    });
};

module.exports.cleanup = (req, res) => {
  // remove tmp folder
};

