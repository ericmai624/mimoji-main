import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import VideoControls from '../../containers/video-controls/video-controls-component';

import { toggleVideoControls } from '../../actions/video';

import { Wrapper } from './video-player-styles';

class VideoPlayer extends Component {
  renderVideo() {
    const { video } = this.props;
    const source = React.createElement('source', { src: video.path, type: 'video/mp4' }, null);
    const videoEl = React.createElement('video', { autoPlay: true, playsInline: true }, source);
    console.log(videoEl);
    return videoEl;
  }
  
  render() {
    const { video, toggleVideoControls } = this.props;

    return (
      <Wrapper id='video-player' style={{ display: video.showVideo ? 'flex' : 'flex'}}>
        {video.showVideo ? this.renderVideo() : null}
        <VideoControls />
      </Wrapper>
    );
  }
}

const mapStateToProps = (state) => ({ video: state.video });

const mapDispatchToProps = (dispatch) => ({ 
  toggleVideoControls: bindActionCreators(toggleVideoControls, dispatch) 
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoPlayer);
