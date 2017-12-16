const fs = require('fs');
const chalk = require('chalk');
const mime = require('mime-types');
const ffmpeg = require('fluent-ffmpeg');

module.exports.stream = (req, res) => {
  const { video, seek } = req.query;
  const time = seek ? parseFloat(seek) : 0;
  const { range } = req.headers;
  const fileSize = fs.statSync(video).size;
  const command = ffmpeg();
  // console.log('seek time: ', startTime)

  res.set({ 
    'Content-Length': fileSize,
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'video/mp4'
  });

  command.kill(); // kill any running instances. This will emit an error

  command
    .input(video)
    .seekInput(time)
    .videoCodec('libx264')
    .outputFormat('mp4')
    .outputOptions(['-movflags frag_keyframe+empty_moov', '-preset ultrafast', '-crf 17'])
    .on('start', (command) => {
      console.log(chalk.blue('ffmpeg command: ', command));
    })
    .on('error', (err) => {
      console.log('error processing video: ', err);
    })
    .on('end', () => {
      console.log('process finished');
    })
    .pipe(res, { end: true });

  /*
  if (contentType !== 'video/mp4') {
    console.log(chalk.bgWhite('converting video'));

    return ffmpeg(fs.createReadStream(file))
      .videoCodec('libx264')
      .outputFormat('mp4')
      .outputOptions(['-movflags frag_keyframe+empty_moov', '-preset ultrafast', '-crf 17'])
      .on('start', (command) => {
        console.log(chalk.blue('ffmpeg command: ', command));
      })
      .on('error', (err) => {
        console.log('error processing video: ', err);
      })
      .on('end', () => {
        console.log('process finished');
      })
      .pipe(res, { end: true });
  }

  if (!range) {
    res.status(200).set({
      'Content-Length': fileSize,
      'Access-Control-Allow-Origin': '*',
      'Content-Type': contentType
    });

    fs.createReadStream(file).pipe(res);
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
    
    fs.createReadStream(file, { start, end }).pipe(res);
  }
  */
};

