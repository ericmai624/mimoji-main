const { homedir } = require('os');
const _ = require('lodash');
const path = require('path');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const { spawn, exec } = require('child_process');

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
    if (name.match(/^(\.|\$)/)) return; // system files, skip
    try {
      let type;
      let filePath = path.resolve(dir, name);
      let isDirectory = fs.statSync(filePath).isDirectory();
      let ext = path.extname(filePath);
  
      if (isDirectory) type = 'directory';
      else if (videoExtSet.has(ext)) type = 'video';
      else if (subExtSet.has(ext)) type = 'subtitle';
      else type = 'file';
  
      content.push({ name, filePath, type });
    } catch (err) {
      console.log('skipped ', path.join(dir, name));
    }

  });

  return content;
};

const getHomedirWin32 = (cb) => {
  exec('wmic logicaldisk get name', (err, stdout, stderr) => {
    if (err) return cb(err, null) ;
    let content = stdout.split('\n').slice(1).map(partition => {
      let letter = partition.trim();
      if (letter === '') return null;
      return { name: letter, filePath: letter, type: 'directory' };
    }).filter(p => p !== null);

    cb(null, { directory: '', content });
  });
};

const readdirWin32 = (location, nav) => {
  if (location.match(/^\w\:\\$/) && nav === '..') {
    return new Promise((resolve, reject) => {
      getHomedirWin32((err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }

  let directory = path.resolve(location, nav);

  return new Promise((resolve, reject) => {
    fs.readdir(directory, (err, files) => {
      if (err) reject(err);
      let content = arrangeContent(files, directory);
      resolve({ directory, content });
    });
  });
};

const readDir = (req, res) => {
  let { dir, nav } = req.query;

  if (process.platform === 'win32') {
    if (dir === '') {
      return getHomedirWin32((err, result) => {
        if (!err) return res.json(result);
        console.log('failed to get home directory: ', err);
        return res.sendStatus(500);
      });
    }
    return readdirWin32(dir, nav)
      .then(result => res.json(result))
      .catch(err => res.sendStatus(500));
  }


  // MacOSX or Linux
  let directory = dir === '' ? homedir() : dir;
  if (nav === '..') directory = path.join(directory, nav);

  return fs.readdirAsync(directory)
    .then((items) => {
      console.log(items);
      let content = arrangeContent(items, directory);
      return res.json({ directory, content });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(404);
    });
};

module.exports = { readDir };
