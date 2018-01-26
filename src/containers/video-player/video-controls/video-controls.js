import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import moment from 'moment';
import momentDurationSetup from 'moment-duration-format';

import SubSettings from './subtitle-settings/subtitle-settings';
import ControlButton from '../control-buttons/control-buttons';

momentDurationSetup(moment);

const borderRadius = 6;
const progressHeight = 12;

const Container = styled.div`
  width: 800px;
  height: 48px;
  padding: 0 45px;
  border: none;
  border-radius: 10px;
  background: ${({ theme }) => theme.bgColor};
  opacity: ${({ isControlsVisible }) => isControlsVisible ? 1 : 0};
  left: calc(50% - 400px);
  bottom: 5%;
  box-sizing: border-box;
  transition: opacity 0.25s ease-in-out;
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.2);
  z-index: 101;
`;

const ProgressContainer = styled.div`
  width: 320px;
  height: ${progressHeight * 2}px;
  border: none;
  border-radius: ${borderRadius}px;
  line-height: 0;
`;

const SeekTime = styled.div`
  visibility: ${({ isVisible }) => isVisible ? 'visible' : 'hidden'};
  opacity: ${({ isVisible }) => isVisible ? 1 : 0};
  font-size: 12px;
  background: rgba(0, 0, 0, 0.85);
  padding: 5px;
  width: 50px;
  height: 12px;
  bottom: 22px;
  border-radius: 4px;
  box-sizing: content-box;
  z-index: 108;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);
  transition: opacity 0.25s ease;

  &:before {
    content: '';
    position: absolute;
    left: calc(50% - 5px);
    bottom: -4px;
    border-width: 5px 5px 0 5px;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.85) transparent transparent transparent;
  }
`;

const Progress = styled.progress`
  display: block;
  width: 100%;
  height: ${progressHeight}px;
  border: none;
  border-radius: ${borderRadius}px;
  color: ${({ theme }) => theme.orange};
  -webkit-appearance: none;

  &::-webkit-progress-value {
    background: ${({ theme }) => theme.orange};
    border: none;
    border-radius: ${borderRadius}px;
  }
  &::-webkit-progress-inner-element {
    overflow: hidden;
    border: none;
    border-radius: ${borderRadius}px;
  }
  &::-moz-progress-bar {
    background: ${({ theme }) => theme.orange};
    border: none;
    border-radius: ${borderRadius}px;
  }
`;

const Bridge = styled.div`
  display: ${({ showVolumeRange }) => showVolumeRange ? 'block' : 'none'};
  width: 42px;
  height: 35px;
  z-index: 1;
  transform: translateY(-50px);
`;

const VolumeContainer = styled.div`
  width: 42px;
  height: 24px;
  font-size: 24px;
  box-sizing: border-box;
  z-index: 50;
`;

const VolumeRangeWrapper = styled.div`
  opacity: ${({ showVolumeRange }) => showVolumeRange ? 1 : 0};
  visibility: ${({ showVolumeRange }) => showVolumeRange ? 'visible' : 'hidden'};
  transform: rotate(-90deg) translate(115px, -32px);
  transform-origin: 50% 50%;
  background: ${({ theme }) => theme.bgColor};
  width: 105px;
  height: 40px;
  border-radius: 5px;
  padding: 0px 5px;
  box-sizing: border-box;
  transition: opacity 0.25s ease-in-out;
`;

const VolumeRange = styled.input.attrs({
  type: 'range',
  min: '0',
  max: '1',
  step: '0.1'
})`
  width: 90px;
  height: 6px;
  border-radius: 2px;
  outline: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    background: rgba(219, 219, 219, 1);
    width: 16px;
    height: 16px;
    border-radius: 50%;
    cursor: pointer;
  }

  &::-webkit-slider-runnable-track {
    background: transparent;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    background: rgba(219, 219, 219, 1);
    width: 16px;
    height: 16px;
    border-radius: 50%;
    cursor: pointer;
  }

  &::-moz-range-track {
    outline: none;
    background: transparent;
    cursor: pointer;
  }

  &::-moz-focus-outer {
    border: 0;
  }

  &::-ms-thumb {
    background: rgba(219, 219, 219, 1);
    width: 16px;
    height: 16px;
    border-radius: 50%;
    cursor: pointer; 
  }

  &::-ms-track {
    width: 80px;
    height: 8px;
    cursor: pointer;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }

  &:focus {
    outline: none;
  }
`;

class VideoControls extends Component {
  
  constructor(props) {
    super(props);

    this.state = { 
      showVolumeRange: false,
      showSubSettings: true,
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

    const seekTimePos = e.pageX - progress.getBoundingClientRect().left;
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