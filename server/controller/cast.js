const fs = require('fs');
const chalk = require('chalk');
const mime = require('mime-types');
const ffmpeg = require('fluent-ffmpeg');

module.exports.stream = (req, res) => {
  const { video, seek } = req.query;
  const time = seek ? parseFloat(seek) : 0;
  const fileSize = fs.statSync(video).size;
  const command = ffmpeg();
  console.log(chalk.cyan('seek: ', time));
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
      console.log(err);
    })
    .on('end', () => {
      console.log('process finished');
    })
    .pipe(res, { end: true });
};

module.exports.getMetadata = (req, res) => {
  ffmpeg.ffprobe(req.query.video, (err, metadata) => {
    // console.log(metadata);
    res.set({ 
      'Access-Control-Allow-Origin': '*'
    });
    res.json(metadata);
  });
};

