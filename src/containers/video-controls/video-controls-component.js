import React, { Component } from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import moment from 'moment';
import momentDurationSetup from 'moment-duration-format';

import { 
  Wrapper,
  ProgressContainer,
  Progress,
  Controls,
  Play
} from './video-controls-styles';

momentDurationSetup(moment);

class VideoControls extends Component {
  handleSeek(e) {
    e.stopPropagation();
    const { duration, seek } = this.props;
    const { progress } = this;

    let offsetLeft = 0;
    let node = progress;
    let n = 2; // number of parent nodes excluding root div
    while (n >= 0) {
      offsetLeft += node.offsetLeft;
      node = node.parentNode;
      n--;
    }

    const pos = (e.pageX - offsetLeft) / progress.clientWidth;
    seek(parseInt(pos * duration, 10));
  }

  render() {
    const { togglePlay, show, paused, currTime, duration } = this.props;
    const format = duration > 3599 ? 'hh:mm:ss' : 'mm:ss';
    const displayedTime = moment.duration(currTime, 'seconds').format(format, { trim: false });
    const endTime = moment.duration(duration, 'seconds').format(format, { trim: false });

    return (
      <Wrapper style={{ opacity: show ? '0.7' : '0' }}>
        <Play onClick={togglePlay}>
          {paused ? <FontAwesomeIcon icon={['fas', 'play']}/> : <FontAwesomeIcon icon={['fas', 'pause']}/>}
        </Play>
        <ProgressContainer onClick={this.handleSeek.bind(this)}>
          <Progress 
            value={currTime} 
            max={duration}
            innerRef={(el) => this.progress = el}
          >
          </Progress>
        </ProgressContainer>
        <div style={{color: 'white', marginLeft: '10px'}}>
          {displayedTime} / {endTime}
        </div>
        <Controls>
        </Controls>
      </Wrapper>
    );
  }
}

export default VideoControls;