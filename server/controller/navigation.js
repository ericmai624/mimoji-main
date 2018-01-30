const _ = require('lodash');
const path = require('path');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const log = console.log.bind(console);
const { homedir } = require('os');
const { exec } = require('child_process');

const videoExts = [
  '.webm', '.mkv', '.flv', '.vob', '.ogv', '.ogg', '.avi', 
  '.mov', '.qt', '.wmv', '.yuv', '.rm', '.rmvb', 
  '.mp4', '.m4p', '.m4v', '.mpg', '.mp2', '.mpeg', '.mpe',
  '.mpv', '.m2v', '.m4v', '.3gp', '.3g2', '.f4v', '.ts',
  '.asf', '.swf'
];

const subExtSet = new Set(['.srt', '.vtt']);

const videoExtSet = new Set(videoExts);

const sortByType = arr => {
  arr.sort((a, b) => {
    if (a.type === 'directory' && b.type !== 'directory') {
      return -1;
    } else if (a.type !== 'directory' && b.type === 'directory') {
      return 1;
    } else if (a.type === 'directory' && b.type === 'directory') {
      return a.name.localeCompare(b.name, { numeric: true });
    } else {
      let extA = path.extname(a.filePath);
      let extB = path.extname(b.filePath);
      if (extA === extB) {
        return a.name.localeCompare(b.name, { numeric: true });
      }
      return extA.localeCompare(extB);
    }
  });

  return arr;
};

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

  return sortByType(content);
};

const splitDirectory = directory => {
  let folders = directory.split(path.sep);
  return { folders, sep: path.sep };
};

const getHomedirWin32 = (cb) => {
  exec('wmic logicaldisk get name', (err, stdout, stderr) => {
    if (err) return cb(err, null);
    let content = stdout.split('\n').slice(1).map(partition => {
      let letter = partition.trim();
      if (letter === '') return null;
      return { name: letter, filePath: letter, type: 'directory' };
    }).filter(p => p !== null);

    cb(null, { directory: '', content });
  });
};

const readdirWin32 = (location) => {
  if (location === '') {
    return new Promise((resolve, reject) => {
      getHomedirWin32((err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }

  return new Promise((resolve, reject) => {
    fs.readdir(location, (err, files) => {
      if (err) reject(err);
      let content = arrangeContent(files, location);
      resolve({ directory: splitDirectory(location), content });
    });
  });
};

const readdir = async (location) => {
  try {
    if (process.platform === 'win32') {
      if (!location) {
        return new Promise((resolve, reject) => {
          getHomedirWin32((err, result) => {
            if (!err) return resolve(result);
            log('failed to get home directory: ', err);
            return reject(err);
          });
        });
      }
      return await readdirWin32(location);
    }

    // MacOSX or Linux
    let directory = location !== '' ? location : homedir();  
    let files = await fs.readdirAsync(directory);
    let content = arrangeContent(files, directory);
    return { directory: splitDirectory(directory), content };
  } catch (err) {
    log(`Request to get content for ${dir} failed with ${err}`);
  }
};

module.exports = { readdir };
