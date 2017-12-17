import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import VideoControls from '../../containers/video-controls/video-controls-component';

import { 
  updateVideoSrc,
  updateVideoCurrTime,
  toggleVideoControls,
  togglePauseVideo
} from '../../actions/video';

import { Wrapper } from './video-player-styles';

class VideoPlayer extends Component {
  constructor(props) {
    super(props);

    this.togglePlay = this.togglePlay.bind(this);
    this.seek = this.seek.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.video.path !== this.props.video.path) {
      this.videoEl.load();
    }
  }
  

  togglePlay(e) {
    e.preventDefault();
    const { video, togglePauseVideo } = this.props;
    const { videoEl } = this;
    video.status.paused ? videoEl.play() : videoEl.pause();
    togglePauseVideo();
  }

  seek(e, time) {
    e.preventDefault();

    const { video, updateVideoSrc } = this.props;

    updateVideoSrc(video.path + `&seek=${time}`);
  }
  
  render() {
    const { video, toggleVideoControls } = this.props;

    return (
      <Wrapper id='video-player' style={{ display: video.displayVideoPlayer ? 'flex' : 'flex'}}>
        <video autoPlay playsInline width='100%' ref={(el) => this.videoEl = el}>
          <source src={'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'} type='video/mp4'/>
          {/* <source src={video.path} type='video/mp4'/> */}
        </video>
        <VideoControls 
          togglePlay={this.togglePlay}
          seek={this.seek}
          paused={video.status.paused}
        />
      </Wrapper>
    );
  }
}

const mapStateToProps = (state) => ({ video: state.video });

const mapDispatchToProps = (dispatch) => ({ 
  toggleVideoControls: bindActionCreators(toggleVideoControls, dispatch),
  togglePauseVideo: bindActionCreators(togglePauseVideo, dispatch),
  updateVideoSrc: bindActionCreators(updateVideoSrc, dispatch),
  updateVideoCurrTime: bindActionCreators(updateVideoCurrTime, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoPlayer);
