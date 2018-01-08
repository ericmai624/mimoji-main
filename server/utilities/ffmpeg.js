const path = require('path');
const { sep } = path;
const os = require('os');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const chalk = require('chalk');
const Promise = require('bluebird');
const platform = os.platform();
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;

const common = path.join(__dirname, '..', '..', 'node_modules', 'ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);
/*
if (platform === 'darwin') {
  ffmpeg.setFfmpegPath(`${common}${sep}darwin${sep}ffmpeg`);
  ffmpeg.setFfprobePath(`${common}${sep}darwin${sep}ffprobe`);  
} else if (platform === 'win32') {
  ffmpeg.setFfmpegPath(`${common}${sep}win32${sep}bin${sep}ffmpeg.exe`);
  ffmpeg.setFfprobePath(`${common}${sep}win32${sep}bin${sep}ffprobe.exe`);  
}
*/

module.exports.processMedia = ({ video, seek, id, location, metadata, isRemuxing }) => {
  let command = ffmpeg(video);
  let bitrate = 10; // output bitrate
  let inputOptions = ['-hide_banner', '-y', '-copyts', '-loglevel panic'];
  let outputOptions = [
    '-map 0:0',
    // '-c:v libx264',
    `-c:v ${isRemuxing ? 'copy' : 'libx264'}`,
    `-threads ${os.cpus().length}`,
    '-preset superfast',
    `-b:v ${bitrate}M`,
    `-maxrate ${bitrate}M`,
    `-minrate ${bitrate}M`,
    `-bufsize ${bitrate * 1.5}M`,
    // `-g ${framerate * 2}`, // Keyframe interval
    // '-sc_threshold 0',
    // `-keyint_min ${framerate * 2}`,
    // '-pix_fmt yuv420p',
    // '-bsf:v h264_mp4toannexb', // convert bitstream
    // '-profile:v high -level 4.1',
    '-map 0:1',
    '-c:a aac',
    '-ac 2',
    '-ar 48000',
    '-b:a 384k',
    '-hls_time 4',
    '-start_number 0',
    '-hls_list_size 0',
    // `-hls_base_url http://172.16.1.19:3000/api/stream/video/${id}/`,
    '-hls_segment_type mpegts',
    `-hls_segment_filename ${path.join(location, 'file_%03d.ts')}`,
    '-hls_flags program_date_time+temp_file+split_by_time+round_durations',
  ];
  if (isRemuxing) outputOptions.splice(2, 6);

  if (seek) inputOptions.push(`-ss ${seek}`);
  console.log(chalk.cyan('seeking: ', seek ? seek : 0));

  command
    .inputOptions(inputOptions)
    .outputOptions(outputOptions)
    .on('start', (command) => {
      console.log(chalk.blue('ffmpeg command: ', command));
    })
    .on('progress', (progress) => {
      // console.log('Processing: ' + progress.percent + '% done');
    })
    .on('stderr', (stderrLine) => {
      console.log('Stderr output: ' + stderrLine);
    })
    .on('error', (err) => {
      console.log(chalk.red(err));
    })
    .on('end', () => {
      console.log(chalk.cyan('process finished'));
    })
    .save(path.join(location, 'playlist.m3u8'));

    
  return command;
};

module.exports.getMetadata = (file) => {
  console.log(file);
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(file, (err, metadata) => {
      if (err) reject(err);
      resolve(metadata);
    });
  });
};