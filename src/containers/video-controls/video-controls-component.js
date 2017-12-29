import React, { PureComponent } from 'react';
import _ from 'lodash';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import moment from 'moment';
import momentDurationSetup from 'moment-duration-format';

import { 
  Container,
  Showtime,
  ProgressContainer,
  Progress,
  ControlsBtns,
  Bridge,
  VolumeContainer,
  VolumeRangeWrapper,
  VolumeRange,
  Sub
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
    if (!this.state.showVolumeRange) this.setState({ showVolumeRange: true });
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
    if (volume === 0 || muted) {
      volumeIcon = [
        <FontAwesomeIcon key='volume-off' icon={['fas', 'volume-off']} transform='left-5.4'/>,
        <FontAwesomeIcon key='times' icon={['fas', 'times']} transform='shrink-7 right-3.4'/>
      ];
    }

    return (
      <Container className='flex flex-align-center flex-space-around fixed' showControls={showControls}>
        <ControlsBtns onClick={togglePlay} className='flex flex-center'>
          <FontAwesomeIcon icon={['fas', paused ? 'play' : 'pause']}/>
        </ControlsBtns>
        <ControlsBtns onClick={killSwitch} className='flex flex-center'>
          <FontAwesomeIcon icon={['fas', 'stop']}/>
        </ControlsBtns>
        <ProgressContainer className='zero-padding' onClick={this.handleSeek}>
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
        <VolumeContainer
          className='relative'
          onMouseOver={this.onVolumeMouseEnter}
          onMouseLeave={this.onVolumeMouseLeave}
        >
          <ControlsBtns
            className='flex flex-center fa-layers fa-fw'
            onClick={toggleMute}
          >
            {volumeIcon}
          </ControlsBtns>
          <VolumeRangeWrapper 
            className='flex flex-center absolute'
            onClick={(e) => e.stopPropagation()}
            showVolumeRange={showVolumeRange}
          >
            <VolumeRange className='zero-padding zero-margin'
              value={volume}
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
          <Bridge className='relative' showVolumeRange={showVolumeRange}></Bridge>
        </VolumeContainer>
        <ControlsBtns className='flex flex-center'>
          <Sub>SUB</Sub>
        </ControlsBtns>
        <ControlsBtns className='flex flex-center' onClick={toggleFullscreen}>
          <FontAwesomeIcon icon={['fas', fullscreen ? 'compress' : 'expand']}/>
        </ControlsBtns>
      </Container>
    );
  }
}

export default VideoControls;