const { homedir } = require('os');
const _ = require('lodash');
const path = require('path');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

module.exports.readDir = (req, res) => {
  const { dir } = req.query;
  const currDir = path.resolve(dir === '' ? homedir() : dir);

  fs.readdirAsync(currDir)
    .then((items) => {
      const content = [];

      _.forEach(items, (fileName) => {
        if (fileName.indexOf('.') === 0) { // system files, skip
          return;
        }
  
        const filePath = path.resolve(currDir, fileName);
        const isDirectory = fs.statSync(filePath).isDirectory();
        content.push({ fileName, filePath, isDirectory });
      });

      return res.json({ currDir, content });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(404);
    });
};
