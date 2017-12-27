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
  VolumeRangeWrapper,
  VolumeRange
} from './video-controls-styles';

momentDurationSetup(moment);

class VideoControls extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { showVolumeRange: false };
    this.handleSeek = this.handleSeek.bind(this);
    this.onVolumeMouseEnter = this.onVolumeMouseEnter.bind(this);
    this.onVolumeMouseLeave = this.onVolumeMouseLeave.bind(this);
  }
  
  handleSeek(e) {
    e.stopPropagation();
    const { stream, seek } = this.props;
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
    seek(_.floor(pos * stream.duration));
  }

  onVolumeMouseEnter(e) {
    this.setState({ showVolumeRange: true });
  }

  onVolumeMouseLeave(e) {
    this.setState({ showVolumeRange: false });
  }

  render() {
    const { toggleFullscreen, togglePlay, toggleMute, changeVolume, killSwitch, stream, showControls } = this.props;
    const { paused, currentTime, duration, fullscreen, muted, volume } = stream;
    const { showVolumeRange } = this.state;

    const format = duration > 3599 ? 'hh:mm:ss' : 'mm:ss';
    const displayedTime = moment.duration(currentTime, 'seconds').format(format, { trim: false });
    const endTime = moment.duration(duration, 'seconds').format(format, { trim: false });

    let volumeIcon = (<FontAwesomeIcon icon={['fas', 'volume-up']}/>);
    if (volume < 0.5) volumeIcon = (<FontAwesomeIcon icon={['fas', 'volume-down']}/>);
    if (volume === 0 || muted) volumeIcon = [
      <FontAwesomeIcon key='volume-off' icon={['fas', 'volume-off']} transform='left-5.4'/>,
      <FontAwesomeIcon key='times' icon={['fas', 'times']} transform='shrink-7 right-3.4'/>
    ];

    return (
      <Wrapper 
        className='center'
        showControls={showControls}
      >
        <ControlsBtns onClick={togglePlay} className='center'>
          <FontAwesomeIcon icon={['fas', paused ? 'play' : 'pause']}/>
        </ControlsBtns>
        <ControlsBtns onClick={killSwitch} className='center'>
          <FontAwesomeIcon icon={['fas', 'stop']}/>
        </ControlsBtns>
        <ProgressContainer onClick={this.handleSeek}>
          <Progress 
            value={currentTime} 
            max={duration}
            innerRef={(el) => this.progress = el}
          >
          </Progress>
        </ProgressContainer>
        <Showtime>
          {displayedTime} / {endTime}
        </Showtime>
        <ControlsBtns
          className='center fa-layers fa-fw'
          onClick={toggleMute}
          onMouseEnter={this.onVolumeMouseEnter}
        >
          {volumeIcon}
          <VolumeRangeWrapper 
            showVolumeRange={showVolumeRange}
            className='center'
            onClick={(e) => e.stopPropagation()}
            onMouseLeave={this.onVolumeMouseLeave}
          >
            <VolumeRange 
              type='range'
              value={volume}
              min='0'
              max='1'
              step='0.01'
              onChange={changeVolume}
              style={{
                background: 'linear-gradient(to right, rgba(228, 75, 54, 0.9) 0%,' 
                            + `rgba(228, 75, 54, 0.9) ${volume * 100}%,` 
                            + `rgba(69, 69, 69, 0.9) ${volume * 100}%,` 
                            + 'rgba(69, 69, 69, 0.9) 100%)'
              }}
            >
            </VolumeRange>
          </VolumeRangeWrapper>
        </ControlsBtns>
        <ControlsBtns className='center'>
          <FontAwesomeIcon icon={['fas', 'closed-captioning']}/>
        </ControlsBtns>
        <ControlsBtns className='center' onClick={toggleFullscreen}>
          <FontAwesomeIcon icon={['fas', fullscreen ? 'compress' : 'expand']}/>
        </ControlsBtns>
      </Wrapper>
    );
  }
}

export default VideoControls;