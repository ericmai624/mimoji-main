const chalk = require('chalk');
const log = console.log.bind(console);
const { extname } = require('path');
const { each } = require('lodash');
const { Stream, streams } = require('../controller').stream;

module.exports = server => {
  const io = require('socket.io')(server);

  io.on('connection', socket => {
    log(chalk.white(`Socket ${socket.id} is connected`));

    // new stream
    socket.on('new stream', async ({ video, seek }) => {
      log('Request to create new stream');
      const start = Date.now();
      console.log(`Input video is ${video}`);
      
      try {
        each(streams, s => s.terminate()); // stop all processes and remove all files first
        
        let stream = new Stream();
    
        let onPlayListReady = file => {
          if (extname(file) === '.m3u8') {
            log(`Playlist is ready. Process took ${Date.now() - start}ms`);
            return socket.emit('playlist ready');
          }
          stream.fileCount++;
        };
        let onFileRemoved = file => {
          stream.fileCount--;
        };
        let output = await stream.create(video, seek, streams);
        log(`output is ${output}`);
        stream.watch(output, onPlayListReady, onFileRemoved);
        socket.emit('stream created', { id: stream.getId(), duration: stream.getDuration() });
        log(`Created new stream with id: ${stream.id}, process took ${Date.now() - start}ms`);
      } catch (err) {
        log(`Failed to create stream with ${err}`);
      }
    });

    // close stream
    socket.on('close stream', ({ id }) => {
      const stream = streams[id];
      log(`Terminating stream ${id}`);
      if (!stream) return;
      stream.terminate();
    });
  });


};