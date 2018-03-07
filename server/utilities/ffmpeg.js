const path = require('path');
const os = require('os');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const chalk = require('chalk');
const Promise = require('bluebird');
const platform = os.platform();
const log = console.log.bind(console);
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;

const common = path.join(__dirname, '..', '..', 'node_modules', 'ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

const isNumber = num => typeof num === 'number';

const getFramerate = metadata => {
  let result = 24;

  let tracks = metadata.streams.filter(s => s['codec_type'] === 'video' && s['codec_name'] !== 'mjpeg');

  if (tracks.length < 1) return result;

  let [a, b] = tracks[0]['r_frame_rate'].split('/').map(Number);
  if (isNumber(a) && isNumber(b) && a !== 0 && b !== 0) result = a / b;
  
  return result;
};

const processMedia = (input, seek, metadata, output, onError, onFinished) => {
  let command = ffmpeg(input);
  let bitrate = 10 * 1024 * 1024; // output bitrate
  let framerate = getFramerate(metadata);
  let inputOptions = ['-hide_banner', '-y', '-nostats', '-copyts', '-loglevel panic'];
  let outputOptions = [
    '-map 0:0',
    '-c:v libx264',
    `-threads ${os.cpus().length}`,
    '-preset veryfast',
    `-b:v ${bitrate}`,
    `-maxrate ${bitrate}`,
    `-minrate ${bitrate}`,
    `-bufsize ${bitrate * 2}`,
    `-g ${framerate * 2}`, // Keyframe interval
    `-keyint_min ${framerate * 2}`,
    '-sc_threshold 0',
    '-vprofile high',
    '-vlevel 4.2',
    '-map 0:1',
    '-c:a aac',
    '-ac 2',
    '-ar 48000',
    '-b:a 384k',
    '-hls_time 8',
    '-start_number 0',
    '-hls_list_size 0', // Set to 0 to keep all segments on the list
    '-hls_segment_type mpegts',
    `-hls_segment_filename ${path.join(output, 'seg_%05d.ts')}`,
    '-hls_flags program_date_time+append_list'
  ];

  if (seek && isNumber(seek)) inputOptions.push(`-ss ${seek}`);
  log(chalk.cyan('seeking: ', seek ? seek : 0));

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
      log(chalk.red('ffmpeg error: ', err));
      onError(err);
    })
    .on('end', () => {
      console.log(chalk.cyan('process finished'));
      onFinished();
    })
    .save(path.join(output, 'playlist.m3u8'));
    
  return command;
};

const getMetadata = (file) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(file, (err, metadata) => {
      if (err) reject(err);
      resolve(metadata);
    });
  });
};

module.exports = { processMedia, getMetadata };