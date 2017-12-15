const { homedir } = require('os');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

const home = homedir();

module.exports.getHomeDir = (req, res) => {
  fs.readdirAsync(home)
    .then((list) => {
      const response = {
        folders: [],
        files: []
      };

      list.forEach((item) => {
        if (item.indexOf('.') === 0) { // system files, skip
          return;
        }
  
        let stat = fs.statSync(home + `/${item}`);
        let { folders, files } = response;
  
        if (stat.isFile()) {
          files.push(item);
        } else if (stat.isDirectory()) {
          folders.push(item);
        }
      });

      return res.json(response);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(404);
    });
};

module.exports.subDir = (req, res) => {

};