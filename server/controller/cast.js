const chalk = require('chalk');
const mime = require('mime-types');
const os = require('os');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const { sep } = path;

module.exports.stream = (req, res) => {
  const { video, seek } = req.query;

  if (video === '') {
    return res.end();
  }

  res.status(206).set({
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  const directory = path.join(os.tmpdir() + `${sep}onecast`);

  // new Promise((resolve, reject) => {
  //   fs.mkdir(directory, (err) => {
  //     if (err.code !== 'EEXIST') reject(err);
  //     resolve();
  //   });
  // })
  // .then(() => {
  //   return new Promise((resolve, reject) => {
  //     fs.mkdtemp(directory + sep, (err, folder) => {
  //       if (err) reject(err);
  //       resolve(folder);
  //     });
  //   });
  // })
  // .then((folder) => {
  //   console.log(chalk.blue(folder));
  //   const time = seek ? parseInt(seek) : 0;
  //   const mimeType = mime.lookup(video);
  
  //   let codec = 'libx264';
  //   if (mimeType === 'video/mp4') {
  //     codec = 'copy';
  //   }
  //   console.log(chalk.cyan('seeking: ', time));

  //   const command = ffmpeg(video);

  //   command
  //     .inputOptions(['-loglevel panic'])
  //     .seekInput(time)
  //     .outputOptions([
  //       '-y',
  //       '-map 0:0',
  //       '-map 0:1',
  //       `-c:v ${codec}`,
  //       `-threads ${os.cpus().length}`,
  //       '-c:a copy',
  //       // '-movflags frag_keyframe+empty_moov',
  //       '-movflags faststart',
  //       '-preset ultrafast',
  //       '-crf 17',
  //       '-tune zerolatency',
  //       '-f segment',
  //       '-segment_time 8',
  //       '-segment_format mpegts',
  //       `-segment_list ${folder}${sep}index.m3u8`,
  //       '-segment_list_type m3u8',
  //       '-segment_list_flags live'
  //     ])
  //     .save(`${folder}${sep}file%010d.ts`)
  //     .on('start', (command) => {
  //       console.log(chalk.blue('ffmpeg command: ', command));
  //     })
  //     .on('progress', (progress) => {
  //       console.log('Processing: ' + progress.percent + '% done');
  //     })
  //     .on('stderr', (stderrLine) => {
  //       console.log('Stderr output: ' + stderrLine);
  //     })
  //     .on('error', (err) => {
  //       console.log(err);
  //     })
  //     .on('end', () => {
  //       console.log('process finished');
  //     })
  // })
  // .catch((err) => {
  //   console.log(chalk.red(err));
  // });

  fs.createReadStream(path.join(directory + sep + 'eyfwD9' + sep + 'index.m3u8'))
    .on('pipe', () => console.log(chalk.green('piping...')))
    .pipe(res);

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

