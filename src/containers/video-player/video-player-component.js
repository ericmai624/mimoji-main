import React, { Component } from 'react';
import _ from 'lodash';
import Hls from 'hls.js';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import VideoControls from '../../containers/video-controls/video-controls-component';

import { 
  getVideoStreamInfo,
  updateVideoCurrTime,
  togglePauseVideo,
  toggleVideoFullscreen,
  updateVideoCC,
  updateVideoVolumn 
} from '../../actions/video';

import { toggleVideoPlayer, toggleVideoControls } from '../../actions/player';

import { Wrapper } from './video-player-styles';

class VideoPlayer extends Component {
  constructor(props) {
    super(props);

    this.hls = new Hls();
    this.loadMedia = this.loadMedia.bind(this);
    this.togglePlay = this.togglePlay.bind(this);
    this._toggleControls = _.throttle(this.toggleControls.bind(this), 4000);
    this.seek = this.seek.bind(this);
    this.onVideoPlaying = this.onVideoPlaying.bind(this);
    this.onVideoTimeUpdate = this.onVideoTimeUpdate.bind(this);
    this.onVideoEnded = this.onVideoEnded.bind(this);
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
    this.killSwitch = this.killSwitch.bind(this);
  }

  componentDidMount() {
    console.log('component did mount');
    const { video } = this.props;
  
    if (video.path !== '') {
      this.loadMedia(video.source);
    }
  }

  loadMedia(src) {
    const { hls, videoEl } = this;
    hls.loadSource(`/api/stream/video/${src}/index.m3u8`);
    hls.attachMedia(videoEl);
    hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => videoEl.play());
  }

  togglePlay(e) {
    e.preventDefault();
    const { video, togglePauseVideo } = this.props;
    const { videoEl } = this;
    video.paused ? videoEl.play() : videoEl.pause();
    return togglePauseVideo();
  }

  toggleControls() {
    const { toggleVideoControls, player } = this.props;
    if (!player.showControls) {
      toggleVideoControls();
    }
    // if (this.hideControls) {
    //   this.hideControls.stop();
    // }
    // if (player.showControls) {
    //   this.hideControls = d3.timeout(toggleVideoControls, 5000);
    // } else {
    //   toggleVideoControls();
    // }
  } 

  seek(seekTime) {
    this.hls.destroy();
    const { video, updateVideoCurrTime, getVideoStreamInfo } = this.props;
    const { path } = video;
    return getVideoStreamInfo(path, seekTime)
      .then((data) => {
        console.log(data);
        // this.loadMedia(data.source);
        updateVideoCurrTime(seekTime);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onVideoPlaying() {
    const { video, togglePauseVideo } = this.props;
    if (video.paused) {
      togglePauseVideo();
    }
  }

  onVideoTimeUpdate(time, cb) {
    cb(time);
  }

  onVideoEnded(e) {
    console.log('the video has ended');
    return this.killSwitch();
  }

  toggleFullscreen(e) {
    const { videoEl } = this;
    const { video, toggleVideoFullscreen } = this.props;

    if (!video.fullscreen) {
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

    toggleVideoFullscreen();
  }

  killSwitch() {
    const { toggleVideoPlayer, video } = this.props;
    this.hls.destroy();
    axios.post('/api/stream/terminate', { id: video.id });
    return toggleVideoPlayer();
  }
  
  render() {
    const { video, player, updateVideoCurrTime } = this.props;

    return (
      <Wrapper id='video-player' className='center' onMouseMove={this._toggleControls}>
        <video
          id={video.source}
          autoPlay 
          playsInline 
          width='100%'
          onTimeUpdate={() => this.onVideoTimeUpdate(this.videoEl.currentTime, updateVideoCurrTime)}
          // onPlaying={this.onVideoPlaying}
          // onEnded={this.onVideoEnded}
          // onStalled={this.clearTimer}
          // onPause={this.clearTimer}
          ref={(el) => this.videoEl = el}
          // src={`http://localhost:2222/api/cast/stream?video=${video.path}&seek=${video.seekTime}`}
        >
        </video>
        <VideoControls
          show={player.showControls}
          togglePlay={this.togglePlay}
          killSwitch={this.killSwitch}
          seek={this.seek}
          paused={video.paused}
          currTime={video.currentTime}
          duration={video.duration}
          fullscreen={video.fullscreen}
          toggleFullscreen={this.toggleFullscreen}
        />
      </Wrapper>
    );
  }
}

const mapStateToProps = (state) => ({ video: state.video, player: state.player });

const mapDispatchToProps = (dispatch) => ({ 
  getVideoStreamInfo: bindActionCreators(getVideoStreamInfo, dispatch),
  toggleVideoPlayer: bindActionCreators(toggleVideoPlayer, dispatch),
  toggleVideoControls: bindActionCreators(toggleVideoControls, dispatch),
  togglePauseVideo: bindActionCreators(togglePauseVideo, dispatch),
  toggleVideoFullscreen: bindActionCreators(toggleVideoFullscreen, dispatch),
  updateVideoCC: bindActionCreators(updateVideoCC, dispatch),
  updateVideoVolumn: bindActionCreators(updateVideoVolumn, dispatch),
  updateVideoCurrTime: bindActionCreators(updateVideoCurrTime, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoPlayer);
