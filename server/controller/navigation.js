const { homedir } = require('os');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

const home = homedir();

module.exports.readDir = (req, res) => {
  const { dir } = req.query;
  const curr = dir === '' ? home : dir;

  fs.readdirAsync(curr)
    .then((items) => {
      const list = [];

      items.forEach((fileName) => {
        if (fileName.indexOf('.') === 0) { // system files, skip
          return;
        }
  
        const path = curr + '/' + fileName;
        const stat = fs.statSync(path);
        const isDirectory = stat.isDirectory();
        list.push({ fileName, path, isDirectory });
      });

      return res.json({ curr, list });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(404);
    });
};
