const chalk = require('chalk');
const os = require('os');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');
const _ = require('lodash');
const util = require('../utilities');
const chokidar = require('chokidar');
const jschardet = require('jschardet');
const iconv = require('iconv-lite');
const { createHash } = require('crypto');
const { sep } = path;

const mediaProcesses = {};
const subtitles = {};
const finishedQueue = [];
const uniqueFilePath = new Set();

const open = (path, cb, retry = 0) => {
  return fs.open(path, 'r', (err, fd) => {
    if (!err) return cb(null, fd);
    if (err && err.code === 'ENOENT' && retry < 20) {
      console.log(chalk.white(`waiting for ${path}`));
      return setTimeout(_.partial(open, path, cb, retry + 1), 1000);
    }
    return cb(err);
  });
};

const make = (dir) => {
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
      else throw new Error('Unknow file.');
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

const isSupported = (metadata) => {
  let { streams } = metadata;
  return streams.filter(s => s['codec_type'] === 'video' && s['codec_name'] === 'h264').length > 0;
};

const terminate = (id) => {
  if (!mediaProcesses[id]) return;
  let { location, command, watcher } = mediaProcesses[id];
  command.kill();
  watcher.close();
  remove(location);
  delete mediaProcesses[id];
  finishedQueue.length = 0;
  uniqueFilePath.clear();
};

const create = (req, res) => {
  let { video, seek } = req.body;
  if (!video || video === '') return res.end();
  let id = createHash('sha256').update(video).digest('hex');
  let directory = path.join(os.tmpdir(), 'onecast');

  terminate(id);

  make(directory) // create directory, ignore if already exists
    .then(() => {
      return Promise.all([ fs.mkdtempAsync(directory + sep), util.ffmpeg.getMetadata(video) ]);
    })
    .then(([location, metadata]) => {
      console.log(metadata);
      mediaProcesses[id] = { id, video, seek, location, metadata, isRemuxing: isSupported(metadata) };
      mediaProcesses[id].command = util.ffmpeg.processMedia(mediaProcesses[id]);
      mediaProcesses[id].fileCount = 0;
      mediaProcesses[id].watcher = chokidar.watch(location, { ignored: /\.tmp$/ })
        .on('add', file => {
          if (path.extname(file) === '.m3u8') return res.json({ id, duration: metadata.format.duration });
          mediaProcesses[id].fileCount++;
          if (mediaProcesses[id].fileCount > 10) mediaProcesses[id].command.kill('SIGSTOP');
        })
        .on('unlink', file => {
          mediaProcesses[id].fileCount--;
          if (mediaProcesses[id].fileCount <= 6) mediaProcesses[id].command.kill('SIGCONT');
        });
    })
    .catch(err => console.log(chalk.red(err)));
};

const serve = (req, res) => {
  let { id, file } = req.params;
  let { location } = mediaProcesses[id];
  let filePath = path.join(location, file);
  let ext = path.extname(filePath);

  try {
    switch (ext) {
    case '.m3u8':
      res.set({ 'Content-Type': 'application/x-mpegURL' });
      return fs.createReadStream(filePath, { highWaterMark: 128 * 1024}).pipe(res);
    case '.ts':
      let stream = fs.createReadStream(filePath);

      stream.on('end', () => {
        if (finishedQueue.length > 2) {
          let trash = finishedQueue.shift();
          remove(trash);
          uniqueFilePath.delete(filePath);
        }
        if (!uniqueFilePath.has(filePath)) {
          uniqueFilePath.add(filePath);
          finishedQueue.push(filePath);
        }
      });
  
      return fs.stat(filePath, (err, stat) => {
        let headers = { 'Content-Type': 'video/MP2T' };
        if (stat) headers['Content-Length'] = stat.size;
        res.set(headers);
        return stream.pipe(res);
      });
    default:
      throw new Error('Unsupported format');
      break;
    }
  } catch (err) {
    console.log(chalk.red(err));
    return res.sendStatus(500);
  }
};

const addSubtitle = (req, res) => {
  let { location, offset, encoding } = req.body;
  if (!location || location === '') return res.end();
  offset = offset ? parseFloat(offset) : 0;
  let id = createHash('sha256').update(location).digest('hex');
  subtitles[id] = { id, location, offset, encoding };

  return res.json(id);
};

const loadSubtitle = (req, res) => {
  let { id } = req.params;
  let { location, offset, encoding } = subtitles[id];
  let ext = path.extname(location);
  
  console.log(chalk.white('loading subtitle: ', location));

  fs.readFileAsync(location)
    .then(buffer => {
      let charset = jschardet.detect(buffer);
      let str = iconv.decode(buffer, charset.encoding);
      res.set({ 'Content-Type': 'text/vtt' }); // set response header
      
      if (!offset && ext === '.vtt') return res.send(str);
      let sub = util.subParser(str, offset, ext);
      return res.send(sub);
    }) 
    .catch((err) => {
      console.log(chalk.red(err));
      res.sendStatus(500);
    });
};

const cleanup = (req, res) => {
  // remove tmp folder
  console.log(chalk.blueBright('terminate request id: ', req.body.id));
  terminate(req.body.id);
  res.sendStatus(200);
};

module.exports.create = create;
module.exports.serve = serve;
module.exports.addSubtitle = addSubtitle;
module.exports.loadSubtitle = loadSubtitle;
module.exports.cleanup = cleanup;