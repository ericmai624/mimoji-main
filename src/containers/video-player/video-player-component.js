import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import VideoControls from '../../containers/video-controls/video-controls-component';

import { updateVideoUrl, updateVideoCurrTime, togglePauseVideo } from '../../actions/video';
import { toggleVideoPlayer, toggleVideoControls } from '../../actions/player';

import { Wrapper } from './video-player-styles';

class VideoPlayer extends Component {
  constructor(props) {
    super(props);

    this.togglePlay = this.togglePlay.bind(this);
    this.toggleControls = this.toggleControls.bind(this);
    this.seek = this.seek.bind(this);
    this.updateCurrTime = this.updateCurrTime.bind(this);
    this.onVideoPlaying = this.onVideoPlaying.bind(this);
    this.onVideoStalled = this.onVideoStalled.bind(this);
    this.onVideoEnded = this.onVideoEnded.bind(this);
    this.clearTimer = this.clearTimer.bind(this);
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

  toggleControls(e) {
    e.preventDefault();
    const { toggleVideoControls, player } = this.props;
    clearTimeout(this.controlTimer);
    if (player.showControls) {
      this.controlTimer = setTimeout(toggleVideoControls, 5000);
    } else {
      toggleVideoControls();
    }
  } 

  seek(seekTime) {
    this.videoEl.pause();
    this.clearTimer();
    const { video, updateVideoUrl, updateVideoCurrTime } = this.props;
    const { path } = video;
    updateVideoUrl({ path, seekTime });
    return updateVideoCurrTime(seekTime);
  }

  updateCurrTime() {
    const { video, player, updateVideoCurrTime } = this.props;

    if (!this.videoEl.paused && player.showControls) {
      updateVideoCurrTime(this.videoEl.currentTime + video.seekTime);
      this.showtimeTimer = setTimeout(this.updateCurrTime, 1000);
    }
  }

  onVideoPlaying(){
    const { video, togglePauseVideo } = this.props;

    if (video.paused) {
      togglePauseVideo();
    }

    return this.updateCurrTime();
  }

  onVideoStalled(e) {
    console.log('loading...');
    // this.clearTimer();
  }

  onVideoEnded(e) {
    // this.clearTimer();
    return this.props.toggleVideoPlayer();    
  }

  clearTimer() {
    clearTimeout(this.showtimeTimer);
  }
  
  render() {
    const { video, player } = this.props;

    return (
      <Wrapper id='video-player' onMouseMove={this.toggleControls}>
        <video 
          autoPlay 
          playsInline width='100%' 
          onPlaying={this.onVideoPlaying}
          // onPause={this.clearTimer}
          onEnded={this.onVideoEnded}
          onStalled={this.onVideoStalled}
          ref={(el) => this.videoEl = el}
          src={`http://localhost:2222/api/cast/stream?video=${video.path}&seek=${video.seekTime}`}
        >
          {/* <source src={'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'} type='video/mp4'/> */}
        </video>
        <VideoControls
          show={player.showControls}
          togglePlay={this.togglePlay}
          seek={this.seek}
          paused={video.paused}
          currTime={video.currentTime}
          duration={video.duration}
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
  updateVideoUrl: bindActionCreators(updateVideoUrl, dispatch),
  updateVideoCurrTime: bindActionCreators(updateVideoCurrTime, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoPlayer);
