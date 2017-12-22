const fs = require('fs');
const chalk = require('chalk');
const mime = require('mime-types');
const ffmpeg = require('fluent-ffmpeg');

module.exports.stream = (req, res) => {
  const { video, seek } = req.query;

  if (video === '') {
    return res.end();
  }

  const time = seek ? parseInt(seek) : 0;
  const mimeType = mime.lookup(video);

  let codec = 'libx264';
  if (mimeType === 'video/mp4') {
    codec = 'copy';
  }
  console.log(chalk.cyan('seeking: ', time));

  const command = ffmpeg(video);

  command
    .inputOptions(['-loglevel panic'])
    .seekInput(time)
    .outputOptions([`-c:v ${codec}`, '-c:a copy', '-movflags frag_keyframe+empty_moov', '-preset ultrafast', '-crf 17', '-tune zerolatency'])
    .outputFormat('mp4')
    .on('start', (command) => {
      console.log(chalk.blue('ffmpeg command: ', command));
    })
    .on('progress', (progress) => {
      console.log('Processing: ' + progress.percent + '% done');
    })
    .on('stderr', (stderrLine) => {
      console.log('Stderr output: ' + stderrLine);
    })
    .on('error', (err) => {
      console.log(err);
    })
    .on('end', () => {
      console.log('process finished');
    })
    .pipe(res, { end: true });
};

module.exports.getDuration = (req, res) => {
  const { video } = req.query;
  if (video === '') {
    res.end();
  }
  ffmpeg.ffprobe(video, (err, metadata) => {
    console.log(metadata);
    res.set({ 
      'Access-Control-Allow-Origin': '*'
    });
    res.json(metadata.format.duration);
  });
};

