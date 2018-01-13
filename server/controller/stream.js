const chalk = require('chalk');
const os = require('os');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const rimraf = require('rimraf');
const path = require('path');
const util = require('../utilities');
const chokidar = require('chokidar');
const jschardet = require('jschardet');
const iconv = require('iconv-lite');
const log = console.log.bind(console);
const { randomBytes } = require('crypto');
const { sep } = path;

const streams = {};
const subtitles = {};

class Stream {
  constructor() {
    this.id = randomBytes(8).toString('hex');
    this.input = null;
    this.output = null;
    this.metadata = {};
    this.fileCount = 0;
    this.isProcessing = true;
    this.command = null;
    this.watcher = null;
    this.finishedQueue = [];
    this.uniqueFilePath = new Set();

    this.clean = this.clean.bind(this);
    this.finish = this.finish.bind(this);
  }

  getId() {
    return this.id;
  }

  getDuration() {
    if (this.metadata.format) return this.metadata.format.duration;
    else return null;
  }

  getFilePath(file) {
    return path.join(this.output, file);
  }

  make(folder) {
    return new Promise((resolve, reject) => {
      fs.mkdir(folder, (err) => {
        if (err && err.code !== 'EEXIST') reject(err);
        resolve(folder);
      });
    });
  }

  async create(input, seek, storage) {
    const directory = await this.make(path.join(os.tmpdir(), 'onecast'));
    const [output, metadata] = await Promise.all(
      [ fs.mkdtempAsync(directory + path.sep), util.ffmpeg.getMetadata(input) ]);
    log(`output is ${output}`);
    this.input = input;
    this.output = output;
    this.metadata = metadata;
    this.command = util.ffmpeg.processMedia(input, seek, metadata, output, this.clean, this.finish);
    storage[this.id] = this;
    return output;
  }

  watch(folder, onAddCallback, onUnlinkCallback) {
    this.watcher = chokidar.watch(folder, { ignored: /\.tmp$/ });
    this.watcher.on('add', onAddCallback);
    this.watcher.on('unlink', onUnlinkCallback);
    this.watcher.on('error', log);
  }

  enqueue(file) {
    if (!this.uniqueFilePath.has(file)) {
      this.uniqueFilePath.add(file);
      this.finishedQueue.push(file);
    }
  }

  dequeue() {
    let file = this.finishedQueue.shift();
    this.uniqueFilePath.delete(file);
    return file;
  }

  remove(location) {
    console.log(chalk.green(`Removing ${location}`));
    return rimraf(location, { maxBusyTries: 10 }, err => {
      if (err) log(chalk.red(`${err} occured when trying to remove ${location}`));
    });
  } 

  clean() {
    return this.remove(this.output);
  }

  finish() {
    this.isProcessing = false;
    return this.isProcessing;
  }

  terminate() {
    this.watcher.close();
    this.command.kill();
    if (!this.isProcessing) this.remove(this.output);
    delete streams[this.id];
  }
}

const serve = (req, res) => {
  let { id, file } = req.params;
  let stream = streams[id];
  if (!stream) return res.end();
  let filePath = stream.getFilePath(file);
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
          if (stream.finishedQueue.length > 2) stream.remove(stream.dequeue());
          stream.enqueue(filePath);
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

module.exports = { streams, Stream, serve, addSubtitle, loadSubtitle };