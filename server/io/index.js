const chalk = require('chalk');
const path = require('path');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const os = require('os');
const { each } = require('lodash');
const util = require('../utilities');
const log = console.log.bind(console);
const { Stream, streams, make } = require('../controller').stream;

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
        let directory = await make(path.join(os.tmpdir(), 'onecast'));
        let [output, metadata] = await Promise.all(
          [ fs.mkdtempAsync(directory + path.sep), util.ffmpeg.getMetadata(video) ]);
        
        let stream = new Stream();
    
        let onPlayListReady = file => {
          if (path.extname(file) === '.m3u8') {
            log(`Playlist is ready. Process took ${Date.now() - start}ms`);
            return socket.emit('playlist ready');
          }
          stream.fileCount++;
        };
        let onFileRemoved = file => {
          stream.fileCount--;
        };
        stream.create(video, seek, metadata, output, streams);
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