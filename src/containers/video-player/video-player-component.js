import React, { Component } from 'react';
import _ from 'lodash';
import Hls from 'hls.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import VideoControls from '../../components/video-controls/video-controls-component';

import { 
  getStreamInfo,
  updateStreamTime,
  updateStreamSub,
  updateStreamVolume,
  toggleStreamProps
} from '../../actions/stream';

import { togglePlayerProps } from '../../actions/player';

import { VideoContainer } from './video-player-styles';

class VideoPlayer extends Component {
  constructor(props) {
    super(props);

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
    if (stream.source !== '') this.initHls();
  }
  

  componentDidUpdate(prevProps, prevState) {
    let prevStream = prevProps.stream;
    let currStream = this.props.stream;

    if (prevStream.source !== currStream.source || prevStream.seek !== currStream.seek) {
      return this.initHls();
    }
  }

  componentWillUnmount() {
    if (this.hls) this.hls.destroy();
  }
  
  initHls() {
    const { videoEl } = this;
    const { stream } = this.props;

    this.hls = new Hls({ 
      maxBufferLength: 10,
      maxBufferSize: 150 * 1000 * 1000,
      manifestLoadingMaxRetry: 3
    });
    this.hls.attachMedia(videoEl);
    // load source when hls is attached to video element
    this.hls.on(Hls.Events.MEDIA_ATTACHED, () => {
      return this.hls.loadSource(`/api/stream/video/${stream.source}/index.m3u8`);
    });
    this.hls.on(Hls.Events.MANIFEST_PARSED, (evt, data) => videoEl.play());
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
    const { videoEl } = this;
    videoEl.paused ? videoEl.play() : videoEl.pause();
  }

  toggleControls(e) {
    const { togglePlayerProps, player } = this.props;
    if (!player.showControls) togglePlayerProps('controls');
  } 

  seek(seekTime) {
    const { stream, updateStreamTime, getStreamInfo } = this.props;
    const { path } = stream;

    if (this.hls) this.hls.destroy(); // destroy current hls stream

    return getStreamInfo(path, seekTime)
      .then((data) => {
        updateStreamTime(seekTime);
        // this.initHls();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onVideoPlaying() {
    const { stream, toggleStreamProps } = this.props;
    if (stream.paused) toggleStreamProps('pause');
  }

  onVideoPaused() {
    const { stream, toggleStreamProps } = this.props;
    if (!stream.paused) toggleStreamProps('pause');
  }

  onVideoTimeUpdate() {
    const { stream, player, updateStreamTime } = this.props;
    const { videoEl } = this;
    if (player.showControls) updateStreamTime(stream.seek + videoEl.currentTime);
  }

  onVideoEnded() {
    console.log('the video has ended');
    return this.killSwitch();
  }

  changeVolume(e) {
    const { updateStreamVolume } = this.props;
    const { videoEl } = this;
    const volume = parseFloat(e.target.value);
    updateStreamVolume(volume);
    videoEl.volume = volume;
  }

  toggleMute() {
    const { toggleStreamProps, stream } = this.props;
    const { videoEl } = this;
    videoEl.muted = !stream.muted;
    toggleStreamProps('muted');
  }

  toggleFullscreen(e) {
    const { player } = this.props;
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
    if (!player.isFullscreenEnabled) requestFullscreen.call(rootNode);
    else exitFullscreen.call(document);
  }

  killSwitch() {
    const { togglePlayerProps, stream } = this.props;
    if (this.hls) this.hls.destroy();

    const method = 'post';
    const headers = new Headers();
    const body = JSON.stringify({ id: stream.id });
    headers.append('Content-Type', 'application/json');

    fetch('/api/stream/terminate', { method, headers, body });

    return togglePlayerProps('main');
  }
  
  render() {
    const { stream, player, togglePlayerProps } = this.props;

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
          ref={(el) => this.videoEl = el}
        >
          {stream.subtitle.enabled ? 
            <track
              kind='subtitles'
              src={`/api/stream/subtitle?sub=${stream.subtitle.path}&`
                  + `offset=${stream.subtitle.offset - stream.seek}&`
                  + `encoding=${stream.subtitle.encoding}`}
              default={true}
            /> : null}
        </video>
        <VideoControls
          togglePlayerProps={togglePlayerProps}
          togglePlay={this.togglePlay}
          toggleMute={this.toggleMute}
          changeVolume={this.changeVolume}
          killSwitch={this.killSwitch}
          seek={this.seek}
          stream={stream}
          player={player}
          toggleFullscreen={this.toggleFullscreen}
        />
      </VideoContainer>
    );
  }
}

const mapStateToProps = (state) => ({ stream: state.stream, player: state.player, fileBrowser: state.fileBrowser });

const mapDispatchToProps = (dispatch) => ({ 
  getStreamInfo: bindActionCreators(getStreamInfo, dispatch),
  togglePlayerProps: bindActionCreators(togglePlayerProps, dispatch),
  toggleStreamProps: bindActionCreators(toggleStreamProps, dispatch),
  updateStreamSub: bindActionCreators(updateStreamSub, dispatch),
  updateStreamVolume: bindActionCreators(updateStreamVolume, dispatch),
  updateStreamTime: bindActionCreators(updateStreamTime, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoPlayer);
