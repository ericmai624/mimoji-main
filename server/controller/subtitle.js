const { randomBytes } = require('crypto');
const jschardet = require('jschardet');
const iconv = require('iconv-lite');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');
const chalk = require('chalk');
const util = require('../utilities');
const log = console.log.bind(console);

const subtitles = {};

class Subtitle {
  constructor(input, offset = 0, encoding = 'auto-detect') {
    this.id = randomBytes(8).toString('hex');
    this.location = input;
    this.offset = offset;
    this.encoding = encoding;
  }

  getId() {
    return this.id;
  }

  getLocation() {
    return this.location;
  }

  getEncoding(buffer) {
    if ((/auto-detect/i).test(this.encoding)) {
      let chardet = jschardet.detect(buffer);
      log('auto detect encoding: ', chardet);
      return chardet.encoding;
    }
    return this.encoding;
  }

  getOffset() {
    if (isNaN(this.offset)) return 0;
    if (this.offset < 0) return 0;
    return this.offset;
  }
}

const serve = async (req, res) => {
  let { id } = req.params;
  log(`Recieved request to serve subtitle id: ${id}`);
  if (!id || !subtitles[id]) return res.end();
  let start = parseFloat(req.query.start);
  let subtitle = subtitles[id];

  try {
    res.set({ 'Content-Type': 'text/vtt' }); // set response header
    let location = subtitle.getLocation();
    log(`Serving subtitle: ${location}`);
    let buffer = await fs.readFileAsync(location);
    let str = iconv.decode(buffer, subtitle.getEncoding(buffer));
    let offset = subtitle.getOffset() - start;
    let ext = path.extname(location);

    if (!offset && ext === '.vtt') return res.send(str);

    let parsed = util.subtitleParser(str, offset, ext);

    return res.send(parsed);
  } catch (err) {
    log(chalk.red(err));
    res.sendStatus(500);
  }
};

module.exports = { Subtitle, subtitles, serve };