import React, { Component, Fragment } from 'react';
import _ from 'lodash';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import moment from 'moment';
import momentDurationSetup from 'moment-duration-format';

import { 
  Container,
  Showtime,
  ProgressContainer,
  Progress,
  Bridge,
  VolumeContainer,
  VolumeRangeWrapper,
  VolumeRange
} from './video-controls-styles';

import SubSettings from './subtitle-settings/subtitle-settings-component';
import ControlButton from '../control-buttons/control-buttons-component';

momentDurationSetup(moment);

class VideoControls extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      showVolumeRange: false,
      showSubSettings: false
    };

    this.handleSeek = this.handleSeek.bind(this);
    this.onVolumeMouseEnter = this.onVolumeMouseEnter.bind(this);
    this.onVolumeMouseLeave = this.onVolumeMouseLeave.bind(this);
    this.toggleSubSettings = this.toggleSubSettings.bind(this);
  }
  
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

  onVolumeMouseEnter(e) {
    if (!this.state.showVolumeRange) this.setState({ showVolumeRange: true });
  }

  onVolumeMouseLeave(e) {
    this.setState({ showVolumeRange: false });
  }

  toggleSubSettings(e) {
    e.preventDefault();
    const { showSubSettings } = this.state;
    this.setState({ showSubSettings: !showSubSettings });
  }

  render() {
    const { 
      toggleFileBrowserDialog, 
      playOrPause, 
      muteOrUnmute, 
      toggleFullscreen, 
      setVolume, 
      stop, 
      isControlsVisible,
      isPaused,
      isMuted,
      isFullscreenEnabled,
      volume,
      currentTime,
      duration
    } = this.props;
    const { showVolumeRange, showSubSettings } = this.state;

    const format = duration > 3599 ? 'hh:mm:ss' : 'mm:ss';
    const displayedTime = moment.duration(currentTime, 'seconds').format(format, { trim: false });
    const endTime = moment.duration(duration, 'seconds').format(format, { trim: false });

    let volumeIcon = (<FontAwesomeIcon icon={['fas', 'volume-up']}/>);
    if (volume < 0.5) volumeIcon = (<FontAwesomeIcon icon={['fas', 'volume-down']}/>);
    if (volume === 0 || isMuted) {
      volumeIcon = [
        <FontAwesomeIcon key='volume-off' icon={['fas', 'volume-off']} transform='left-4.5' />,
        <FontAwesomeIcon key='times' icon={['fas', 'times']} transform='shrink-7 right-4.5' />
      ];
    }

    return (
      <Fragment>
        <Container 
          className='flex flex-align-center flex-space-around absolute'
          isControlsVisible={isControlsVisible}
        >
          <ControlButton onClick={playOrPause} icon={['fas', isPaused ? 'play' : 'pause']}/>
          <ControlButton onClick={stop} icon={['fas', 'stop']}/>
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
          <VolumeContainer
            className='relative'
            onMouseOver={this.onVolumeMouseEnter}
            onMouseLeave={this.onVolumeMouseLeave}
          >
            <ControlButton onClick={muteOrUnmute} className={'fa-layers fa-fw'}>
              {volumeIcon}
            </ControlButton>
            <VolumeRangeWrapper
              className='flex flex-center absolute'
              onClick={(e) => e.stopPropagation()}
              showVolumeRange={showVolumeRange}
            >
              <VolumeRange
                value={volume}
                onChange={setVolume}
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
          <ControlButton onClick={this.toggleSubSettings}>
            <FontAwesomeIcon icon={['fas', 'language']} size='lg'/>
          </ControlButton>
          {toggleFullscreen ? <ControlButton onClick={toggleFullscreen} icon={['fas', isFullscreenEnabled ? 'compress' : 'expand']}/> : null}
        </Container>
        {showSubSettings ? 
          <SubSettings
            toggleFileBrowserDialog={toggleFileBrowserDialog} 
            toggleSubSettings={this.toggleSubSettings}
          /> : null}
      </Fragment>
    );
  }
}

export default VideoControls;