const { homedir } = require('os');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

module.exports.readDir = (req, res) => {
  const { dir } = req.query;
  const currDir = dir === '' ? homedir() : dir;

  fs.readdirAsync(currDir)
    .then((items) => {
      const content = [];

      items.forEach((fileName) => {
        if (fileName.indexOf('.') === 0) { // system files, skip
          return;
        }
  
        const path = currDir + '/' + fileName;
        const stat = fs.statSync(path);
        const isDirectory = stat.isDirectory();
        content.push({ fileName, path, isDirectory });
      });

      return res.json({ currDir, content });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(404);
    });
};
