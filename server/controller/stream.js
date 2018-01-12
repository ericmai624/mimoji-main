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
const log = console.log.bind(console);
const { randomBytes } = require('crypto');
const { sep } = path;

const streams = {};
const subtitles = {};
const finishedQueue = [];
const uniqueFilePath = new Set();

const open = (path, cb, retry = 0) => {
  return fs.open(path, 'r', (err, fd) => {
    if (!err) return cb(null, fd);
    if (err && err.code === 'ENOENT' && retry < 20) {
      log(chalk.white(`waiting for ${path}`));
      return setTimeout(_.partial(open, path, cb, retry + 1), 1000);
    }
    return cb(err);
  });
};

const make = (dir) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(dir, (err) => {
      if (err && err.code !== 'EEXIST') reject(err);
      resolve(dir);
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
      if (isFulfilled) return log(chalk.green('removed ', filePath));

      log(chalk.red(err));
    });
};

const terminate = (stream, id) => {
  if (!stream) return;
  let { command, watcher } = stream;
  watcher.close();
  command.kill();
  delete streams[id];
  finishedQueue.length = 0;
  uniqueFilePath.clear();
};

const create = async (req, res) => {
  let { video, seek } = req.body;
  if (!video || video === '') return res.end();
  // let id = createHash('sha256').update(video).digest('hex');
  let id = randomBytes(8).toString('hex');

  _.each(streams, terminate);

  try {
    let directory = await make(path.join(os.tmpdir(), 'onecast'));
    let [output, metadata] = await Promise.all(
      [ fs.mkdtempAsync(directory + sep), util.ffmpeg.getMetadata(video) ]);

    const newStream = { input: video, output };
    newStream.command = util.ffmpeg.processMedia(video, seek, metadata, output, err => {
      if (err) {
        log(chalk.red('ffmpeg error: ', err));
        setTimeout(remove.bind(null, output), 5000);
      }
    });
    newStream.fileCount = 0;
    newStream.watcher = chokidar.watch(output, { ignored: /\.tmp$/ })
      .on('add', file => {
        if (path.extname(file) === '.m3u8') return res.json({ id, duration: metadata.format.duration });
        newStream.fileCount++;
        // if (newStream.fileCount > 10) newStream.command.kill('SIGSTOP');
      })
      .on('unlink', file => {
        newStream.fileCount--;
        // if (newStream.fileCount <= 6) newStream.command.kill('SIGCONT');
      })
      .on('error', log);
    streams[id] = newStream;
  } catch (err) {
    log('An error has occured when creating new stream process: ', err);
    terminate(id);
    res.sendStatus(500);
  }
};

const serve = (req, res) => {
  let { id, file } = req.params;
  if (!streams[id]) return res.end();
  let { output } = streams[id];
  let filePath = path.join(output, file);
  let ext = path.extname(filePath);

  try {
    switch (ext) {
    case '.m3u8':
      res.set({ 'Content-Type': 'application/x-mpegURL' });

      fs.createReadStream(filePath, { highWaterMark: 128 * 1024})
        .on('error', err => {
          throw err;
        })
        .pipe(res);
      break;
    case '.ts':
      res.set({ 'Content-Type': 'video/MP2T' });

      fs.createReadStream(filePath)
        .on('end', () => {
          if (finishedQueue.length > 2) {
            let trash = finishedQueue.shift();
            remove(trash);
            uniqueFilePath.delete(filePath);
          }
          if (!uniqueFilePath.has(filePath)) {
            uniqueFilePath.add(filePath);
            finishedQueue.push(filePath);
          }
        })
        .on('error', err => {
          throw err;
        })
        .pipe(res);
      break;
    default:
      throw new Error('Unsupported format');
      break;
    }
  } catch (err) {
    log(chalk.red(err));
    res.sendStatus(500);
  }
};

const addSubtitle = (req, res) => {
  let { location } = req.body;
  if (!location || location === '') return res.end();
  // let id = createHash('sha256').update(location).digest('hex');
  let id = randomBytes(8).toString('hex');
  subtitles[id] = location;

  return res.json(id);
};

const loadSubtitle = async (req, res) => {
  let { id } = req.params;
  if (!id || !subtitles[id]) return res.end();
  let location = subtitles[id];
  let { offset, encoding } = req.query;
  offset = parseFloat(offset);
  let ext = path.extname(location);

  try {
    let buffer = await fs.readFileAsync(location);
    if (encoding === 'auto') encoding = jschardet.detect(buffer).encoding;
    let str = iconv.decode(buffer, encoding);
    log(chalk.white('loading subtitle: ', location, encoding));
    res.set({ 'Content-Type': 'text/vtt' }); // set response header
    
    if (!offset && ext === '.vtt') return res.send(str);
    let sub = util.subtitleParser(str, offset, ext);
    return res.send(sub);
  } catch (err) {
    log(chalk.red(err));
    res.sendStatus(500);
  }
};

const cleanup = (req, res) => {
  log(chalk.blueBright('terminate request id: ', req.body.id));
  try {
    const { id } = req.body;
    const stream = streams[id];
    terminate(stream, id);
    res.sendStatus(200);
  } catch (err) {
    log(err);
    res.sendStatus(500);
  }
};

module.exports = { create, serve, addSubtitle, loadSubtitle, cleanup };