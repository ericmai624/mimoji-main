const fs = require('fs');
const chalk = require('chalk');
const ffmpeg = require('fluent-ffmpeg');
const crypto = require('crypto');
const mime = require('mime-types');

let files = {};

module.exports.stream = (req, res) => {
  const { filePath, contentType } = files[req.params.hash];
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const { range } = req.headers;

  // if (contentType !== 'video/mp4') {
  //   console.log(chalk.green('converting video'));

  //   return ffmpeg()
  //     .input(fs.createReadStream(filePath))
  //     .videoCodec('libx264')
  //     .inputOptions('-preset ultrafast')
  //     .outputFormat('mp4')
  //     .outputOptions(['-movflags frag_keyframe+empty_moov'])
  //     .on('start', (command) => {
  //       console.log(chalk.blue('ffmpeg command: ', command));
  //     })
  //     .on('error', (err) => {
  //       console.log('error processing video: ', err);
  //     })
  //     .on('end', () => {
  //       console.log('process finished');
  //     })
  //     .pipe(res, { end: true });
  // }

  if (!range) {
    res.status(200).set({
      'Content-Length': fileSize,
      'Access-Control-Allow-Origin': '*',
      'Content-Type': contentType
    });

    fs.createReadStream(filePath).pipe(res);
  } else {
    const [partialStart, partialEnd] = range.replace(/bytes=/, '').split('-');
    const start = parseInt(partialStart, 10);
    const end = partialEnd ? parseInt(partialEnd, 10) : fileSize - 1;
    const chunkSize = end - start + 1;
  
    console.log(chalk.blue('range: ', range));
    console.log(chalk.green(start, '-', end));
    
    res.status(206).set({ 
      'Content-Length': chunkSize,
      'Content-Type': contentType,
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Access-Control-Allow-Origin': '*',
      'Accept-Encoding': '*',
      'Accept-Ranges': 'bytes'
    });
    
    fs.createReadStream(filePath, { start, end }).pipe(res);
  }
};

module.exports.updateFilePath = (req, res) => {
  const { filePath } = req.body;
  const contentType = mime.lookup(filePath);
  const hash = crypto.createHash('md5').update(filePath).digest('hex');
  files[hash] = { filePath, contentType };
  res.json({ hash, contentType });
};
