const { homedir } = require('os');
const _ = require('lodash');
const path = require('path');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

const videoExts = [
  '.webm', '.mkv', '.flv', '.vob', '.ogv', '.ogg', '.avi', 
  '.mov', '.qt', '.wmv', '.yuv', '.rm', '.rmvb', 
  '.mp4', '.m4p', '.m4v', '.mpg', '.mp2', '.mpeg', '.mpe',
  '.mpv', '.m2v', '.m4v', '.3gp', '.3g2', '.f4v', '.ts',
  '.asf', '.swf'
];

const subExtSet = new Set(['.srt', '.vtt']);

const videoExtSet = new Set(videoExts);

const arrangeContent = (input, dir) => {
  let content = [];
  if (!input || !input.length) return content;

  _.each(input, (name, i) => {
    if (name.indexOf('.') === 0) return; // system files, skip
    let type;
    let filePath = path.resolve(dir, name);
    let isDirectory = fs.statSync(filePath).isDirectory();
    let ext = path.extname(filePath);

    if (isDirectory) type = 'directory';
    else if (videoExtSet.has(ext)) type = 'video';
    else if (subExtSet.has(ext)) type = 'subtitle';
    else type = 'file';

    content.push({ name, filePath, type });
  });

  return content;
};

module.exports.readDir = (req, res) => {
  let { dir, nav } = req.query;
  let directory = dir === '' ? homedir() : dir;
  if (nav === '..') directory = path.join(directory, nav);

  fs.readdirAsync(directory)
    .then((items) => {
      let content = arrangeContent(items, directory);
      return res.json({ directory, content });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(404);
    });
};
