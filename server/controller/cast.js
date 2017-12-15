const fs = require('fs');

module.exports.castToTv = (req, res) => {
  fs.createReadStream(req.params.path).pipe(res);
};
