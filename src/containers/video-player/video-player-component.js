import React, { Component } from 'react';
import _ from 'lodash';
import Hls from 'hls.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import VideoControls from './video-controls/video-controls-component';

import { fetchStreamInfo, updateStreamTime } from 'stores/stream';
import { togglePlayer } from 'stores/app';
import { toggleFileBrowserDialog } from 'stores/file-browser';

import { VideoContainer } from './video-player-styles';

class VideoPlayer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showControls: true,
      volume: 1,
      currTimeOffset: 0,
      isPaused: false,
      isMuted: false,
    };
  
    this.initHls = this.initHls.bind(this);
    this.togglePlay = this.togglePlay.bind(this);
    this._toggleControls = _.throttle(this.toggleControls.bind(this), 4000);
    this.seek = this.seek.bind(this);
    this.onVideoPlaying = this.onVideoPlaying.bind(this);
    this.onVideoPaused = this.onVideoPaused.bind(this);
    this.onVideoTimeUpdate = this.onVideoTimeUpdate.bind(this);
    this.onVideoEnded = this.onVideoEnded.bind(this);
    this.changeVolume = this.changeVolume.bind(this);
    this.toggleMute = this.toggleMute.bind(this);
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
    this.killSwitch = this.killSwitch.bind(this);
  }

  componentDidMount() {
    const { stream } = this.props;
    if (stream.source !== '' && !stream.hasError) this.initHls();
  }

  componentWillUnmount() {
    if (this.hls) this.hls.destroy();
  }
  
  initHls() {
    const { video } = this;
    const { stream } = this.props;

    this.hls = new Hls({ 
      maxBufferLength: 10,
      maxBufferSize: 150 * 1000 * 1000,
      manifestLoadingMaxRetry: 3
    });
    this.hls.attachMedia(video);
    // load source when hls is attached to video element
    this.hls.on(Hls.Events.MEDIA_ATTACHED, () => {
      return this.hls.loadSource(`/api/stream/video/${stream.source}/index.m3u8`);
    });
    this.hls.on(Hls.Events.MANIFEST_PARSED, (evt, data) => video.play());
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

  togglePlay(e) {
    e.preventDefault();
    const { video } = this;
    if (video.paused) {
      this.setState({ isPaused: false }, () => video.play());
    } else {
      this.setState({ isPaused: true }, () => video.pause());
    }
  }

  toggleControls(e) {
    let { showControls } = this.state;
    if (!showControls) this.setState({ showControls: true });
  } 

  seek(seekTime) {
    const { stream, fetchStreamInfo } = this.props;

    if (this.hls) this.hls.destroy(); // destroy current hls stream

    this.setState({ currTimeOffset: seekTime }, () => {
      fetchStreamInfo(stream.path, seekTime).then(() => {
        if (!stream.hasError) this.initHls();
      });
    });
  }

  onVideoPlaying() {
    const { isPaused } = this.state;
    if (isPaused) this.setState({ isPaused: false });
  }

  onVideoPaused() {
    const { isPaused } = this.state;
    if (!isPaused) this.setState({ isPaused: true });
  }

  onVideoTimeUpdate() {
    const { updateStreamTime } = this.props;
    const { showControls, currTimeOffset } = this.state;
    const { video } = this;

    if (showControls) updateStreamTime(video.currentTime + currTimeOffset);
  }

  onVideoEnded() {
    console.log('the video has ended');
    return this.killSwitch();
  }

  changeVolume(e) {
    const { video } = this;
    const volume = parseFloat(e.target.value);

    this.setState({ volume }, () => video.volume = volume);
  }

  toggleMute() {
    const { isMuted } = this.state;
    const { video } = this;

    this.setState({ isMuted: !isMuted }, () => video.muted = !isMuted);
  }

  toggleFullscreen(e) {
    const { app } = this.props;
    const rootNode = document.querySelector('#root');

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

  killSwitch() {
    const { togglePlayer, stream } = this.props;
    if (this.hls) this.hls.destroy();

    const method = 'post';
    const headers = new Headers();
    const body = JSON.stringify({ id: stream.id });
    headers.append('Content-Type', 'application/json');

    fetch('/api/stream/terminate', { method, headers, body });

    this.toggleFullscreen();
    return togglePlayer();
  }
  
  render() {
    const { app, stream, toggleFileBrowserDialog } = this.props;
    const { showControls, isPaused, isMuted, volume } = this.state;

    if (stream.hasError) {
      return (
        <VideoContainer className='flex flex-center absolute'>
          <span style={{color: 'white'}}>Something went wrong...</span>
        </VideoContainer>
      );
    }

    return (
      <VideoContainer
        id='video-player'
        className='flex flex-center absolute'
      >
        <video
          autoPlay={true}
          playsInline={true}
          width='100%'
          height='100%'
          crossOrigin='anonymous'
          onPlaying={this.onVideoPlaying}
          onPause={this.onVideoPaused}
          onTimeUpdate={this.onVideoTimeUpdate}
          onEnded={this.onVideoEnded}
          onMouseMove={this._toggleControls}
          ref={(el) => this.video = el}
        >
          {/* <track
            kind='subtitles'
            src={`/api/stream/subtitle?sub=${stream.subtitle.path}&`
                + `offset=${stream.subtitle.offset - stream.seek}&`
                + `encoding=${stream.subtitle.encoding}`}
            label={stream.subtitle.title}
            default={true}
          /> */}
        </video>
        <VideoControls
          seek={this.seek}
          toggleFileBrowserDialog={toggleFileBrowserDialog}
          togglePlay={this.togglePlay}
          toggleMute={this.toggleMute}
          toggleFullscreen={this.toggleFullscreen}
          changeVolume={this.changeVolume}
          killSwitch={this.killSwitch}
          showControls={showControls}
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
  subtitle: state.subtitle
});

const mapDispatchToProps = (dispatch) => ({ 
  fetchStreamInfo: bindActionCreators(fetchStreamInfo, dispatch),
  togglePlayer: bindActionCreators(togglePlayer, dispatch),
  toggleFileBrowserDialog: bindActionCreators(toggleFileBrowserDialog, dispatch),
  updateStreamTime: bindActionCreators(updateStreamTime, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoPlayer);
