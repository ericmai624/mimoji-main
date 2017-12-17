import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';

import { 
  Wrapper,
  Progress,
  ProgressBar,
  Controls,
  Play
} from './video-controls-styles';

class VideoControls extends Component {
  calc(e) {
    const x = e.screenX;
    const rect = this.progress.getBoundingClientRect();
    console.log(e);
    console.log(x, rect.left, x - rect.left);
  }

  render() {
    const { togglePlay, paused, seek } = this.props;

    return (
      <Wrapper style={{ display: 'flex' }}>
        <Play onClick={togglePlay}>
          <i className={paused ? 'fas fa-play' : 'fas fa-pause'}></i>
        </Play>
        <Progress 
          onClick={(e) => seek(e, 1000)} 
          innerRef={(el) => this.progress = el}
          onMouseMove={this.calc.bind(this)}
        >
          <ProgressBar style={{width: '70%'}}></ProgressBar>
        </Progress>
        <Controls>
        </Controls>
      </Wrapper>
    );
  }
}

export default VideoControls;