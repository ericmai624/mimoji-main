const chalk = require('chalk');
const os = require('os');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const rimraf = require('rimraf');
const path = require('path');
const util = require('../utilities');
const chokidar = require('chokidar');
const log = console.log.bind(console);
const { randomBytes } = require('crypto');
const { sep } = path;

const streams = {};
const subtitles = {};

class VideoStream {
  constructor() {
    this.id = randomBytes(8).toString('hex');
    this.input = null;
    this.output = null;
    this.metadata = {};
    this.isProcessing = true;
    this.command = null;
    this.watcher = null;
    this.finishedQueue = [];
    this.uniqueFilePath = new Set();
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

  async create({ input, seek, bitrate }) {
    /* Create the onecast directory first */
    const directory = await this.make(path.join(os.tmpdir(), 'mimoji'));
    const [output, metadata] = await Promise.all(
      [ fs.mkdtempAsync(directory + path.sep), util.ffmpeg.getMetadata(input) ]);

    this.input = input;
    this.output = output;
    this.metadata = metadata;
    this.command = util.ffmpeg.processMedia({
      input,
      seek,
      metadata,
      output,
      bitrate,
      errorCallback: this.clean,
      finishCallback: this.finish
    });

    streams[this.id] = this;

    return output;
  }

  watch(folder, socket) {
    this.watcher = chokidar.watch(folder, { ignored: /\.(tmp|ts)$/ });
    this.watcher.on('add', file => {
      if (path.extname(file) === '.m3u8') {
        socket.emit('playlist ready');
        this.watcher.close();
      }
    });
    this.watcher.on('error', err => {
      log(chalk.red(`Error in stream.watch: ${err}`));
    });
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
    this.command.kill();
    if (!this.isProcessing) this.remove(this.output);
    delete streams[this.id];
  }
}

const serve = async (req, res) => {
  try {
    let { id, file } = req.params;
    let stream = streams[id];
    if (!stream) return res.end();
    let filePath = stream.getFilePath(file);
    let ext = path.extname(filePath);

    if (ext === '.m3u8') {
      fs.createReadStream(filePath, { highWaterMark: 128 * 1024})
        .on('error', err => {
          throw err;
        })
        .pipe(res.set({ 'Content-Type': 'application/x-mpegURL' }));
    } else if (ext === '.ts') {
      fs.createReadStream(filePath)
        .on('end', () => {
          if (stream.finishedQueue.length > 2) stream.remove(stream.dequeue());
          stream.enqueue(filePath);
        })
        .on('error', err => {
          throw err;
        })
        .pipe(res.set({ 'Content-Type': 'video/MP2T' }));
    } else {
      throw new Error('Unsupported format');
    }
  } catch (e) {
    log(chalk.red(err));
    res.sendStatus(500);
  }
};

module.exports = { streams, VideoStream, serve };
