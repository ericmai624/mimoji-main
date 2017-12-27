import React, { Component } from 'react';
import _ from 'lodash';
import axios from 'axios';
import Hls from 'hls.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import VideoControls from '../../containers/video-controls/video-controls-component';

import { 
  getStreamInfo,
  updateVideoCurrTime,
  updateVideoCC,
  updateVideoVolume,
  toggleStreamProps
} from '../../actions/stream';

import { toggleVideoPlayer, toggleVideoControls } from '../../actions/player';

import { Wrapper } from './video-player-styles';

class VideoPlayer extends Component {
  constructor(props) {
    super(props);

    this.initHls = this.initHls.bind(this);
    this.togglePlay = this.togglePlay.bind(this);
    this._toggleControls = _.throttle(this.toggleControls.bind(this), 4000);
    this.seek = this.seek.bind(this);
    this.onVideoPlaying = this.onVideoPlaying.bind(this);
    this.onVideoTimeUpdate = this.onVideoTimeUpdate.bind(this);
    this.onVideoEnded = this.onVideoEnded.bind(this);
    this.changeVolume = this.changeVolume.bind(this);
    this.toggleMute = this.toggleMute.bind(this);
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
    this.killSwitch = this.killSwitch.bind(this);
  }

  componentDidMount() {
    this.initHls();
  }

  initHls() {
    const { videoEl } = this;
    const { source } = this.props.stream;
    this.hls = new Hls();
    this.hls.attachMedia(videoEl);
    this.hls.loadSource(`/api/stream/video/${source}/index.m3u8`);
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
    const { stream, toggleStreamProps } = this.props;
    const { videoEl } = this;
    stream.paused ? videoEl.play() : videoEl.pause();
    return toggleStreamProps('pause');
  }

  toggleControls() {
    const { toggleVideoControls, player } = this.props;
    if (!player.showControls) {
      toggleVideoControls();
    }
  } 

  seek(seekTime) {
    const { stream, updateVideoCurrTime, getStreamInfo } = this.props;
    const { path } = stream;
    this.hls.destroy();
    return getStreamInfo(path, seekTime)
      .then((data) => {
        this.initHls();
        updateVideoCurrTime(seekTime);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onVideoPlaying() {
    const { stream, toggleStreamProps } = this.props;
    if (stream.paused) {
      toggleStreamProps('pause');
    }
  }

  onVideoTimeUpdate() {
    const { stream, player, updateVideoCurrTime } = this.props;
    const { videoEl } = this;
    if (player.showControls) updateVideoCurrTime(stream.seek + videoEl.currentTime);
  }

  onVideoEnded() {
    console.log('the video has ended');
    return this.killSwitch();
  }

  changeVolume(e) {
    const { updateVideoVolume } = this.props;
    const { videoEl } = this;
    const volume = parseFloat(e.target.value);
    updateVideoVolume(volume);
    videoEl.volume = volume;
  }

  toggleMute() {
    const { toggleStreamProps, stream } = this.props;
    const { videoEl } = this;
    videoEl.muted = !stream.muted;
    toggleStreamProps('muted');
  }

  toggleFullscreen(e) {
    const { videoEl } = this;
    const { stream, toggleStreamProps } = this.props;

    if (!stream.fullscreen) {
      if (videoEl.requestFullscreen) {
        videoEl.requestFullscreen();
      } else if (videoEl.mozRequestFullScreen) {
        videoEl.mozRequestFullScreen();
      } else if (videoEl.webkitRequestFullScreen) {
        videoEl.webkitRequestFullScreen();
      } else if (videoEl.msRequestFullscreen) {
        videoEl.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }

    toggleStreamProps('fullscreen');
  }

  killSwitch() {
    const { toggleVideoPlayer, stream } = this.props;
    this.hls.destroy();
    axios.post('/api/stream/terminate', { id: stream.id });
    return toggleVideoPlayer();
  }
  
  render() {
    const { stream, player } = this.props;

    return (
      <Wrapper id='video-player' className='center' onMouseMove={this._toggleControls}>
        <video
          autoPlay
          playsInline
          width='100%'
          onPlaying={this.onVideoPlaying}
          onTimeUpdate={this.onVideoTimeUpdate}
          onEnded={this.onVideoEnded}
          ref={(el) => this.videoEl = el}
        >
        </video>
        <VideoControls
          showControls={player.showControls}
          togglePlay={this.togglePlay}
          toggleMute={this.toggleMute}
          changeVolume={this.changeVolume}
          killSwitch={this.killSwitch}
          seek={this.seek}
          stream={stream}
          toggleFullscreen={this.toggleFullscreen}
        />
      </Wrapper>
    );
  }
}

const mapStateToProps = (state) => ({ stream: state.stream, player: state.player });

const mapDispatchToProps = (dispatch) => ({ 
  getStreamInfo: bindActionCreators(getStreamInfo, dispatch),
  toggleVideoPlayer: bindActionCreators(toggleVideoPlayer, dispatch),
  toggleVideoControls: bindActionCreators(toggleVideoControls, dispatch),
  toggleStreamProps: bindActionCreators(toggleStreamProps, dispatch),
  updateVideoCC: bindActionCreators(updateVideoCC, dispatch),
  updateVideoVolume: bindActionCreators(updateVideoVolume, dispatch),
  updateVideoCurrTime: bindActionCreators(updateVideoCurrTime, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoPlayer);
