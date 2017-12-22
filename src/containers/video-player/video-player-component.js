import React, { PureComponent } from 'react';
import _ from 'lodash';
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

    this.togglePlay = this.togglePlay.bind(this);
    this._toggleControls = _.throttle(this.toggleControls.bind(this), 4000);
    this.seek = this.seek.bind(this);
    this.onVideoTimeUpdate = this.onVideoTimeUpdate.bind(this);
    this.onVideoEnded = this.onVideoEnded.bind(this);
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
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
    if (this.hideControls) {
      this.hideControls.stop();
    }
    if (player.showControls) {
      this.hideControls = d3.timeout(toggleVideoControls, 5000);
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

  onVideoTimeUpdate() {
    if (this.props.player.showControls) {
      this.props.updateVideoCurrTime(_.floor(this.videoEl.currentTime + this.props.video.seekTime));
    }
  }

  onVideoEnded(e) {
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
  
  render() {
    const { video, player } = this.props;

    return (
      <Wrapper id='video-player' className='center' onMouseMove={this._toggleControls}>
        <video 
          autoPlay 
          playsInline width='100%'
          onTimeUpdate={this.onVideoTimeUpdate}
          onPlaying={this.onVideoPlaying}
          onEnded={this.onVideoEnded}
          onStalled={this.clearTimer}
          onPause={this.clearTimer}
          ref={(el) => this.videoEl = el}
          src={`http://localhost:2222/api/cast/stream?video=${video.path}&seek=${video.seekTime}`}
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
