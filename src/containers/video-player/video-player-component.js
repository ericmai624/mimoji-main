import React, { PureComponent } from 'react';
import _ from 'lodash';
import Hls from 'hls.js';
import * as d3 from 'd3-timer';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import VideoControls from '../../containers/video-controls/video-controls-component';

import { 
  updateVideoUrl,
  updateVideoCurrTime,
  togglePauseVideo,
  toggleVideoFullscreen,
  updateVideoCC,
  updateVideoVolumn 
} from '../../actions/video';

import { toggleVideoPlayer, toggleVideoControls } from '../../actions/player';

import { Wrapper } from './video-player-styles';

class VideoPlayer extends PureComponent {
  constructor(props) {
    super(props);

    this.hls = new Hls();
    this.togglePlay = this.togglePlay.bind(this);
    this._toggleControls = _.throttle(this.toggleControls.bind(this), 4000);
    this.seek = this.seek.bind(this);
    this.updateElapsedTime = this.updateElapsedTime.bind(this);
    this.onVideoPlaying = this.onVideoPlaying.bind(this);
    this.onVideoEnded = this.onVideoEnded.bind(this);
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
    this.clearTimer = this.clearTimer.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('component updated');
    const { hls, videoEl } = this;
    const { video } = this.props;

    hls.loadSource(`http://localhost:2222/api/cast/stream?video=${video.path}`);
    hls.attachMedia(videoEl);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      console.log('should play video');
      videoEl.play()}
    );
  }
  

  componentWillUnmount() {
    this.clearTimer();
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
    this.videoEl.pause();
    this.clearTimer();
    const { video, updateVideoUrl, updateVideoCurrTime } = this.props;
    const { path } = video;
    updateVideoUrl({ path, seekTime });
    return updateVideoCurrTime(seekTime);
  }

  updateElapsedTime(startTime) {
    const { updateVideoCurrTime, video } = this.props;
    const { videoEl } = this;
    if (!videoEl.paused) {
      const currTime = new Date().getTime();
      this.timer = d3.timeout(_.partial(this.updateElapsedTime, currTime), 1000 - (currTime - startTime));
      updateVideoCurrTime(0.5 + video.currentTime);
      console.log('start: ', startTime, 'curr: ', currTime, 'now: ', new Date().getTime(), 'elapsed: ', currTime - startTime);
    }
  }

  onVideoPlaying() {
    const { video, togglePauseVideo } = this.props;
    if (video.paused) {
      togglePauseVideo();
    }
    const startTime = new Date().getTime();
    this.timer = d3.timeout(_.partial(this.updateElapsedTime, startTime), 500);
  }

  onVideoEnded(e) {
    console.log('the video has ended');
    this.clearTimer();
    return this.props.toggleVideoPlayer();
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

  clearTimer() {
    if (this.timer) this.timer.stop();
  }
  
  render() {
    const { video, player } = this.props;

    return (
      <Wrapper id='video-player' className='center' onMouseMove={this._toggleControls}>
        <video 
          autoPlay 
          playsInline width='100%'
          onPlaying={this.onVideoPlaying}
          onEnded={this.onVideoEnded}
          onStalled={this.clearTimer}
          onPause={this.clearTimer}
          ref={(el) => this.videoEl = el}
          // src={`http://localhost:2222/api/cast/stream?video=${video.path}&seek=${video.seekTime}`}
        >
        </video>
        <VideoControls
          show={player.showControls}
          togglePlay={this.togglePlay}
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
  toggleVideoPlayer: bindActionCreators(toggleVideoPlayer, dispatch),
  toggleVideoControls: bindActionCreators(toggleVideoControls, dispatch),
  togglePauseVideo: bindActionCreators(togglePauseVideo, dispatch),
  toggleVideoFullscreen: bindActionCreators(toggleVideoFullscreen, dispatch),
  updateVideoCC: bindActionCreators(updateVideoCC, dispatch),
  updateVideoVolumn: bindActionCreators(updateVideoVolumn, dispatch),
  updateVideoUrl: bindActionCreators(updateVideoUrl, dispatch),
  updateVideoCurrTime: bindActionCreators(updateVideoCurrTime, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoPlayer);
