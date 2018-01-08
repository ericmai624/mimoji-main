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
  let bitrate = 10000; // output bitrate
  let tracks = metadata.streams.filter(s => s['codec_type'] === 'video' && s['codec_name'] !== 'mjpeg');
  let framerate = 24;
  if (tracks.length > 0) {
    let [a, b] = tracks[0]['r_frame_rate'].split('/');
    if (a !== '0' && b !== '0') framerate = parseFloat(a) / parseFloat(b);
  }
  let inputOptions = ['-hide_banner', '-y', '-copyts', '-loglevel panic'];
  let outputOptions = [
    '-map 0:0',
    '-c:v libx264',
    // `-c:v ${isRemuxing ? 'copy' : 'libx264'}`,
    `-threads ${os.cpus().length}`,
    '-preset veryfast',
    `-b:v ${bitrate}k`,
    `-maxrate ${bitrate}k`,
    `-minrate ${bitrate}k`,
    `-bufsize ${bitrate * 1.5}k`,
    `-g ${framerate * 2}`, // Keyframe interval
    '-sc_threshold 0',
    `-keyint_min ${framerate * 2}`,
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
    `-hls_segment_filename ${path.join(location, 'file_%05d.ts')}`,
    // '-hls_flags program_date_time+split_by_time'
    '-hls_flags program_date_time'
  ];
  // if (isRemuxing) outputOptions.splice(2, 6);

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