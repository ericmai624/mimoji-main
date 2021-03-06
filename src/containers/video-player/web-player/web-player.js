import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Hls from 'hls.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Loader from 'src/components/loader/loader';
import VideoControls from 'src/containers/video-player/video-controls/video-controls';
import TextTrack from 'src/containers/video-player/text-track/text-track';

import { toggleLoading, togglePlayer } from 'src/stores/app';
import { updateStreamInfo, updateStreamTime, rejectStream, resetStream } from 'src/stores/stream';
import { resetTextTrack } from 'src/stores/text-track';

import { Flex } from 'src/shared/components';

/* Styled Components */
const VideoContainer = Flex.extend`
  width: 100%;
  height: 100%;
  position: absolute;
  background: #000;
  z-index: 100;
  transition: transform 0.5s ease-in-out;
`;

class WebPlayer extends Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    stream: PropTypes.object.isRequired,
    isFileBrowserEnabled: PropTypes.bool.isRequired,
    updateStreamInfo: PropTypes.func.isRequired,
    toggleLoading: PropTypes.func.isRequired,
    togglePlayer: PropTypes.func.isRequired,
    updateStreamTime: PropTypes.func.isRequired,
    rejectStream: PropTypes.func.isRequired,
    resetStream: PropTypes.func.isRequired,
    resetTextTrack: PropTypes.func.isRequired
  }

  state = {
    isSeeking: false,
    isPaused: false,
    isMuted: false,
    isControlsVisible: true,
    volume: 1,
    currTimeOffset: 0
  };

  componentDidMount() {
    const { io } = window;
    const { rejectStream } = this.props;
    io.on('playlist ready', this.initHls);
    io.on('stream rejected', rejectStream);
  }

  componentWillUnmount() {
    const { io } = window;
    const { rejectStream } = this.props;
    if (this.hls) this.hls.destroy();
    if (this.timerId !== undefined) this.stopTimer();
    io.off('playlist ready', this.initHls);
    io.off('stream rejected', rejectStream);
  }
  
  initHls = () => {
    const { video } = this;
    const { app, stream, toggleLoading } = this.props;
    const source = `/api/stream/video/${stream.id}/playlist.m3u8`;

    this.hls = new Hls({ 
      maxBufferLength: 10, /* in seconds */
      maxBufferSize: 100 * 1000 * 1000, /* Chrome max buffer size 150MB */
      manifestLoadingMaxRetry: 3,
      manifestLoadingTimeOut: 20000 /* 20 seconds before timeout callback is fired */
    });
    this.hls.attachMedia(video);
    // load source when hls is attached to video element
    this.hls.on(Hls.Events.MEDIA_ATTACHED, this.hls.loadSource.bind(this.hls, source));

    this.hls.on(Hls.Events.MANIFEST_PARSED, (evt, data) => {
      if (app.isInitializing && !this.state.isSeeking) toggleLoading();
      this.setState({ isSeeking: false }, video.play.bind(video));
    });
    // hls error handling
    this.hls.on(Hls.Events.ERROR, (evt, data) => { 
      if (data.fatal) {
        switch (data.type) {
        case Hls.ErrorTypes.NETWORK_ERROR:
          console.log('Trying to recover from fatal network error');
          return this.hls.startLoad();
        case Hls.ErrorTypes.MEDIA_ERROR:
          console.log('Trying to recover from fatal media error');
          return this.hls.recoverMediaError();
        default:
          console.log('Unable to recover from fatal error');
          return this.hls.destroy();
        }
      }
    });
  }

  playOrPause = (e) => {
    e.preventDefault();
    const { video } = this;

    if (video.paused) this.setState({ isPaused: false }, video.play.bind(video));
    else this.setState({ isPaused: true }, video.pause.bind(video));
  }

  showControls = () => {
    const { isControlsVisible } = this.state;
    if (!isControlsVisible) this.setState({ isControlsVisible: true });
  }

  hideControls = () => {
    const { isControlsVisible } = this.state;
    if (isControlsVisible) this.setState({ isControlsVisible: false });
  }

  onVideoMouseMove = (e) => {
    e.stopPropagation();
    const { app } = this.props;
    this.stopControlsTimer();
    if (app.isPlayerEnabled) this.showControls(); // show controls

    this.controlsTimer = setTimeout(this.hideControls, 4000);
  }

  onControlsMouseMove = (e) => {
    e.stopPropagation();
    const { isControlsVisible } = this.state;
    this.stopControlsTimer();

    if (!isControlsVisible) this.setState({ isControlsVisible: true });
  }

  seek = (seekTime) => {
    const { io } = window;
    const { stream, updateStreamInfo, updateStreamTime } = this.props;

    if (this.hls) this.hls.destroy(); // destroy current hls stream
    if (this.seekTimer) {
      clearTimeout(this.seekTimer);
      this.seekTimer = null;
    }
    
    updateStreamTime(seekTime);

    this.setState({ isSeeking: true, currTimeOffset: seekTime }, () => {
      this.seekTimer = setTimeout(() => {
        io.emit('new stream', { video: stream.video, seek: seekTime });
        io.once('stream created', updateStreamInfo);
      }, 1000);
    });
  }

  onVideoPlaying = () => {
    const { isPaused } = this.state;
    if (isPaused) this.setState({ isPaused: false });
  }

  onVideoPaused = () => {
    const { isPaused } = this.state;
    if (!isPaused) this.setState({ isPaused: true });
  }

  onVideoTimeUpdate = () => {
    const { updateStreamTime } = this.props;
    const { isControlsVisible, currTimeOffset } = this.state;
    const { video } = this;

    if (isControlsVisible) updateStreamTime(video.currentTime + currTimeOffset);
  }

  stop = () => {
    console.log('the video has ended');
    return this.cleanup();
  }

  setVolume = (e) => {
    const { video } = this;
    const volume = parseFloat(e.target.value);

    this.setState({ volume }, () => video.volume = volume);
  }

  muteOrUnmute = () => {
    const { isMuted } = this.state;
    const { video } = this;

    this.setState({ isMuted: !isMuted }, () => video.muted = !isMuted);
  }

  toggleFullscreen = (e) => {
    const { app } = this.props;
    const rootNode = document.getElementById('app');

    const requestFullscreen = rootNode.requestFullscreen ||
                              rootNode.mozRequestFullScreen ||
                              rootNode.webkitRequestFullScreen ||
                              rootNode.msRequestFullscreen;

    const exitFullscreen = document.exitFullscreen ||
                           document.mozCancelFullScreen ||
                           document.webkitCancelFullScreen ||
                           document.msExitFullscreen;

    /*
    use call to bind to the video container when invoked
    bind to the #root node instead of the video itself
    to enable custom controls in fullscreen mode
    */
    if (!app.isFullscreenEnabled) requestFullscreen.call(rootNode);
    else exitFullscreen.call(document);
  }

  stopControlsTimer = () => {
    if (this.controlsTimer) {
      clearTimeout(this.controlsTimer);
      this.controlsTimer = null;
    }
  }

  cleanup = () => {
    const { io } = window;
    const { app, stream, togglePlayer, resetStream, resetTextTrack } = this.props;
    if (this.hls) this.hls.destroy();

    io.emit('close stream', { id: stream.id });

    if (app.isFullscreenEnabled) this.toggleFullscreen();
    this.stopControlsTimer();
    resetStream();
    resetTextTrack();
    if (app.isPlayerEnabled) togglePlayer();
  }
  
  render() {
    const { app, stream, isFileBrowserEnabled } = this.props;
    const { isSeeking, isPaused, isMuted, isControlsVisible, volume, currTimeOffset } = this.state;

    if (stream.hasError) {
      return (
        <VideoContainer align='center' justify='center'>
          <span style={{color: 'rgb(255,255,255)'}}>Something went wrong...</span>
        </VideoContainer>
      );
    }

    return (
      <VideoContainer
        id='video-player'
        align='center'
        justify='center'
        onMouseMove={this.onVideoMouseMove}
        style={{ transform: isFileBrowserEnabled ? 'translateX(-100%)' : 'none' }}
      >
        <Loader
          isVisible={isSeeking}
          size={42}
          style={{ position: 'absolute', left: 'calc(50% - 21px)', top: 'calc(50% - 21px)' }}
        />
        <video
          autoPlay={true}
          playsInline={true}
          width='100%'
          height='100%'
          crossOrigin='anonymous'
          onPlaying={this.onVideoPlaying}
          onPause={this.onVideoPaused}
          onTimeUpdate={this.onVideoTimeUpdate}
          onEnded={this.stop}
          ref={(el) => this.video = el}
        >
          <TextTrack currTimeOffset={currTimeOffset} isLoading={isSeeking || app.isInitializing}/>
        </video>
        <VideoControls
          seek={this.seek}
          onControlsMouseMove={this.onControlsMouseMove}
          playOrPause={this.playOrPause}
          muteOrUnmute={this.muteOrUnmute}
          toggleFullscreen={this.toggleFullscreen}
          setVolume={this.setVolume}
          stop={this.stop}
          isControlsVisible={isControlsVisible}
          isPaused={isPaused}
          isMuted={isMuted}
          isFullscreenEnabled={app.isFullscreenEnabled}
          volume={volume}
          currentTime={stream.currentTime}
          duration={stream.duration}
        />
      </VideoContainer>
    );
  }
}

const mapStateToProps = (state) => ({ 
  app: state.app,
  stream: state.stream,
  isFileBrowserEnabled: state.fileBrowser.isVisible
});

const mapDispatchToProps = (dispatch) => ({ 
  updateStreamInfo: bindActionCreators(updateStreamInfo, dispatch),
  toggleLoading: bindActionCreators(toggleLoading, dispatch),
  togglePlayer: bindActionCreators(togglePlayer, dispatch),
  updateStreamTime: bindActionCreators(updateStreamTime, dispatch),
  rejectStream: bindActionCreators(rejectStream, dispatch),
  resetStream: bindActionCreators(resetStream, dispatch),
  resetTextTrack: bindActionCreators(resetTextTrack, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(WebPlayer);
