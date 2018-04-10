const chalk = require('chalk');
const log = console.log.bind(console);
const { extname } = require('path');
const { each } = require('lodash');
const { VideoStream, streams } = require('../controller').stream;
const { Subtitle, subtitles } = require('../controller').subtitle;
const { readdir } = require('../controller').navigation;

const io = require('socket.io')();

io.on('connection', socket => {
  log(chalk.white(`Socket ${socket.id} is connected`));

  /* Read files */
  socket.on('request content', async location => {
    try {
      const content = await readdir(location);
      socket.emit('request content fulfilled', content);
    } catch (err) {
      log(`Failed to get content, ${err}`);
      socket.emit('request content rejected');
    }
  });

  /* new stream */
  socket.on('new stream', async ({ video, seek, bitrate = 8 * 1024 * 1024 }) => {
    log('Request to create new stream');
    const start = Date.now();
    console.log(`Input video is ${video}`);
    
    try {
      each(streams, s => s.terminate()); // stop all processes and remove all files first
      
      const stream = new VideoStream();
      const output = await stream.create({ input: video, seek, bitrate });

      stream.watch(output, socket);
      socket.emit('stream created', { id: stream.getId(), duration: stream.getDuration() });
      log(`Created new stream with id: ${stream.id} +${Date.now() - start}ms`);
    } catch (err) {
      log(`Failed to create stream with ${err}`);
      socket.emit('stream rejected');
    }
  });

  /* close stream */
  socket.on('close stream', ({ id }) => {
    const stream = streams[id];
    if (!stream) return;
    log(`Terminating stream ${id}`);
    stream.terminate();
  });

  /* Create new subtitle */
  socket.on('new subtitle', ({ location, offset, encoding }) => {
    const subtitle = new Subtitle(location, offset, encoding);
    const id = subtitle.getId();
    subtitles[id] = subtitle;
    log(`new subtitle with id ${id} created`);
    socket.emit('subtitle created', id);
  });
});

module.exports = io;
