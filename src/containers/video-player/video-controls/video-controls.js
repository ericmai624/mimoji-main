import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import moment from 'moment';
import momentDurationSetup from 'moment-duration-format';

import SubSettings from './subtitle-settings/subtitle-settings';
import Progress from './progress/progress';
import VolumeControl from './volume-control/volume-control';
import ControlButton from '../control-buttons/control-buttons';

import { Flex } from 'src/shared/components';

momentDurationSetup(moment);

const Container = Flex.extend`
  width: 800px;
  height: 48px;
  padding: 0 45px;
  border: none;
  background: ${({ theme }) => theme['wet_asphalt']};
  opacity: ${({ isControlsVisible }) => isControlsVisible ? 1 : 0};
  left: calc(50% - 400px);
  bottom: 5%;
  box-sizing: border-box;
  transition: opacity 0.25s ease-in-out;
  z-index: 101;
  position: absolute;
`;

class VideoControls extends Component {
  static propTypes = {
    onControlsMouseMove: PropTypes.func,
    isFullscreenEnabled: PropTypes.bool,
    toggleFullscreen: PropTypes.func,
    playOrPause: PropTypes.func.isRequired,
    muteOrUnmute: PropTypes.func.isRequired,
    setVolume: PropTypes.func.isRequired,
    seek: PropTypes.func.isRequired,
    stop: PropTypes.func.isRequired,
    isControlsVisible: PropTypes.bool.isRequired,
    isPaused: PropTypes.bool.isRequired,
    isMuted: PropTypes.bool.isRequired,
    volume: PropTypes.number.isRequired,
    currentTime: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired
  }
  
  state = { 
    isSubSettingEnabled: false
  };

  toggleSubSettings = () => {
    const { isSubSettingEnabled } = this.state;
    this.setState({ isSubSettingEnabled: !isSubSettingEnabled });
  }

  render() {
    const {
      onControlsMouseMove,
      playOrPause, 
      muteOrUnmute, 
      toggleFullscreen, 
      setVolume,
      seek,
      stop, 
      isControlsVisible,
      isPaused,
      isMuted,
      isFullscreenEnabled,
      volume,
      currentTime,
      duration
    } = this.props;
    const { isSubSettingEnabled } = this.state;

    const format = duration > 3599 ? 'hh:mm:ss' : 'mm:ss';
    const displayedTime = moment.duration(currentTime, 'seconds').format(format, { trim: false });
    const endTime = moment.duration(duration, 'seconds').format(format, { trim: false });

    return (
      <Fragment>
        <Container
          id='video-controls'
          align='center'
          justify='space-around'
          isControlsVisible={isControlsVisible}
          onMouseMove={onControlsMouseMove}
        >
          <ControlButton onClick={playOrPause} icon={['fas', isPaused ? 'play' : 'pause']}/>
          <ControlButton onClick={stop} icon={['fas', 'stop']}/>
          <Progress seek={seek} currentTime={currentTime} duration={duration} format={format}/>
          <div style={{ color: '#fff', userSelect: 'none' }}>
            {displayedTime} / {endTime}
          </div>
          <VolumeControl
            muteOrUnmute={muteOrUnmute}
            setVolume={setVolume}
            volume={volume}
            isMuted={isMuted}
          />
          <ControlButton onClick={this.toggleSubSettings} style={{ fontSize: '30px', height: '30px' }}>
            <FontAwesomeIcon icon={['fas', 'language']} />
          </ControlButton>
          {toggleFullscreen ?
            <ControlButton onClick={toggleFullscreen} icon={['fas', isFullscreenEnabled ? 'compress' : 'expand']}/> : null}
        </Container>
        <SubSettings
          isVisible={isSubSettingEnabled}
          toggleSubSettings={this.toggleSubSettings}
          onControlsMouseMove={onControlsMouseMove}
        />
      </Fragment>
    );
  }
}

export default VideoControls;