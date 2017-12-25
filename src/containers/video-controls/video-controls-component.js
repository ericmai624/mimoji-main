import React, { PureComponent } from 'react';
import _ from 'lodash';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import moment from 'moment';
import momentDurationSetup from 'moment-duration-format';

import { 
  Wrapper,
  Showtime,
  ProgressContainer,
  Progress,
  ControlsBtns,
} from './video-controls-styles';

momentDurationSetup(moment);

class VideoControls extends PureComponent {
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
    seek(_.floor(pos * duration));
  }

  render() {
    const { toggleFullscreen, togglePlay, killSwitch, show, paused, currTime, duration, fullscreen } = this.props;
    const format = duration > 3599 ? 'hh:mm:ss' : 'mm:ss';
    const displayedTime = moment.duration(currTime, 'seconds').format(format, { trim: false });
    const endTime = moment.duration(duration, 'seconds').format(format, { trim: false });

    return (
      <Wrapper 
        className='center'
        show={show}
      >
        <ControlsBtns onClick={togglePlay} className='center'>
          {paused ? <FontAwesomeIcon icon={['fas', 'play']}/> : <FontAwesomeIcon icon={['fas', 'pause']}/>}
        </ControlsBtns>
        <ControlsBtns onClick={killSwitch} className='center'>
          <FontAwesomeIcon icon={['fas', 'stop']}/>
        </ControlsBtns>
        <ProgressContainer onClick={this.handleSeek.bind(this)}>
          <Progress 
            value={currTime} 
            max={duration}
            innerRef={(el) => this.progress = el}
          >
          </Progress>
        </ProgressContainer>
        <Showtime>
          {displayedTime} / {endTime}
        </Showtime>
        <ControlsBtns className='center'>
          <FontAwesomeIcon icon={['fas', 'volume-up']}/>
        </ControlsBtns>
        <ControlsBtns className='center'>
          <FontAwesomeIcon icon={['fas', 'closed-captioning']}/>
        </ControlsBtns>
        <ControlsBtns className='center' onClick={toggleFullscreen}>
          {fullscreen ? <FontAwesomeIcon icon={['fas', 'compress']}/> : <FontAwesomeIcon icon={['fas', 'expand']}/>}
        </ControlsBtns>
      </Wrapper>
    );
  }
}

export default VideoControls;