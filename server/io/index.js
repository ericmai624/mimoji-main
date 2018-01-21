const chalk = require('chalk');
const log = console.log.bind(console);
const { extname } = require('path');
const { each } = require('lodash');
const { Stream, streams } = require('../controller').stream;
const { readdir } = require('../controller').navigation;

module.exports = server => {
  const io = require('socket.io')(server, { transports: ['websocket'] });

  io.on('connection', socket => {
    log(chalk.white(`Socket ${socket.id} is connected`));

    /* Read files */
    socket.on('request content', async ({ dir, nav }) => {
      try {
        const content = await readdir(dir, nav);
        socket.emit('request content fulfilled', content);
      } catch (err) {
        log(`Failed to get content in ${dir} with ${err}`);
        socket.emit('request content rejected');
      }
    });

    /* new stream */
    socket.on('new stream', async ({ video, seek }) => {
      log('Request to create new stream');
      const start = Date.now();
      console.log(`Input video is ${video}`);
      
      try {
        each(streams, s => s.terminate()); // stop all processes and remove all files first
        
        const stream = new Stream();
        const output = await stream.create(video, seek);

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
  });
};
