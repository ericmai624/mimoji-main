import React, { Component, Fragment } from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import moment from 'moment';
import momentDurationSetup from 'moment-duration-format';

import { 
  Container,
  ProgressContainer,
  SeekTime,
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
      showSubSettings: false,
      seekTime: 0,
      seekTimePos: 0,
      isSeekTimeVisible: false
    };

    this.getSeekTime = this.getSeekTime.bind(this);
    this.hideSeekTime = this.hideSeekTime.bind(this);
    this.handleSeek = this.handleSeek.bind(this);
    this.onVolumeMouseEnter = this.onVolumeMouseEnter.bind(this);
    this.onVolumeMouseLeave = this.onVolumeMouseLeave.bind(this);
    this.toggleSubSettings = this.toggleSubSettings.bind(this);
  }

  getSeekTime(e) {
    e.stopPropagation();
    const { duration } = this.props;
    const { progress } = this;

    const seekTimePos = e.pageX - progress.offsetParent.offsetLeft - progress.offsetLeft + 1;
    const seekTime = seekTimePos / progress.clientWidth * duration;
    this.setState({ seekTime, seekTimePos, isSeekTimeVisible: true });
  }

  hideSeekTime(e) {
    e.stopPropagation();
    this.setState({ isSeekTimeVisible: false });
  }
  
  handleSeek(e) {
    e.stopPropagation();
    const { seek } = this.props;
    const { seekTime } = this.state;
    console.log(`handleSeek is seeking ${seekTime}`);
    seek(seekTime);
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
      onControlsMouseMove,
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
    const { showVolumeRange, showSubSettings, seekTime, seekTimePos, isSeekTimeVisible } = this.state;

    const format = duration > 3599 ? 'hh:mm:ss' : 'mm:ss';
    const displayedTime = moment.duration(currentTime, 'seconds').format(format, { trim: false });
    const cursorTime = moment.duration(seekTime, 'seconds').format(format, { trim: false });
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
          id='video-controls'
          className='flex flex-align-center flex-space-around absolute'
          isControlsVisible={isControlsVisible}
          onMouseMove={onControlsMouseMove}
        >
          <ControlButton onClick={playOrPause} icon={['fas', isPaused ? 'play' : 'pause']}/>
          <ControlButton onClick={stop} icon={['fas', 'stop']}/>
          <ProgressContainer
            className='flex flex-center relative pointer no-background'
            onClick={this.handleSeek}
            onMouseMove={this.getSeekTime}
            onMouseLeave={this.hideSeekTime}
            innerRef={(el) => this.progress = el}
          >
            <SeekTime 
              className='flex flex-center absolute white-font'
              style={{left: `${seekTimePos - 30}px`}}
              isVisible={isSeekTimeVisible}
            >
              {cursorTime}
            </SeekTime>
            <Progress value={currentTime} max={duration} />
          </ProgressContainer>
          <div className='white-font no-select'>
            {displayedTime} / {endTime}
          </div>
          <VolumeContainer
            className='relative white-font'
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
                className='pointer'
                style={{
                  background: 'linear-gradient(to right, rgba(228, 75, 54, 0.9) 0%,' 
                              + `rgba(228, 75, 54, 0.9) ${volume * 100}%,` 
                              + `rgba(69, 69, 69, 0.9) ${volume * 100}%,` 
                              + 'rgba(69, 69, 69, 0.9) 100%)'
                }}
              >
              </VolumeRange>
            </VolumeRangeWrapper>
            <Bridge className='relative no-background' showVolumeRange={showVolumeRange}></Bridge>
          </VolumeContainer>
          <ControlButton onClick={this.toggleSubSettings}>
            <FontAwesomeIcon icon={['fas', 'language']} size='lg'/>
          </ControlButton>
          {toggleFullscreen ? 
            <ControlButton onClick={toggleFullscreen} icon={['fas', isFullscreenEnabled ? 'compress' : 'expand']}/> : null}
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