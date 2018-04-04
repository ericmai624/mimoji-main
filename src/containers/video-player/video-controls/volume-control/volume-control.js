import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import { Flex } from 'src/shared/components';

import ControlButton from 'src/containers/video-player/control-buttons/control-buttons';

const Bridge = styled.div`
  display: ${({ isVisible }) => isVisible ? 'block' : 'none'};
  width: 42px;
  height: 35px;
  z-index: 1;
  transform: translateY(-50px);
  position: relative;
  background: transparent;
`;

const VolumeContainer = styled.div`
  width: 42px;
  height: 24px;
  font-size: 24px;
  color: rgb(255,255,255);
  box-sizing: border-box;
  z-index: 50;
  position: relative;
`;

const VolumeRangeWrapper = Flex.extend`
  opacity: ${({ isVisible }) => isVisible ? 1 : 0};
  visibility: ${({ isVisible }) => isVisible ? 'visible' : 'hidden'};
  transform: rotate(-90deg) translate(115px, -32px);
  transform-origin: 50% 50%;
  background: ${({ theme }) => theme['wet_asphalt']};
  width: 105px;
  height: 40px;
  padding: 0px 5px;
  box-sizing: border-box;
  transition: opacity 0.25s ease-in-out;
  position: absolute;
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
  cursor: pointer;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    background: ${({ theme }) => theme['green_sea']};
    width: 16px;
    height: 16px;
    border-radius: 50%;
    cursor: pointer;

    &:hover {
      background: #48c9b0;
    }
  }

  &::-webkit-slider-runnable-track {
    background: transparent;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    background: ${({ theme }) => theme['green_sea']};
    width: 16px;
    height: 16px;
    border-radius: 50%;
    cursor: pointer;

    &:hover {
      background: #48c9b0;
    }
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
    background: ${({ theme }) => theme['green_sea']};
    width: 16px;
    height: 16px;
    border-radius: 50%;
    cursor: pointer;

    &:hover {
      background: #48c9b0;
    }
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

class VolumeControl extends PureComponent {
  static propTypes = {
    muteOrUnmute: PropTypes.func.isRequired,
    setVolume: PropTypes.func.isRequired,
    volume: PropTypes.number.isRequired,
    isMuted: PropTypes.bool.isRequired
  }

  state = {
    showVolumeRange: false
  };

  onVolumeMouseEnter = (e) => {
    if (!this.state.showVolumeRange) this.setState({ showVolumeRange: true });
  }

  onVolumeMouseLeave = (e) => {
    this.setState({ showVolumeRange: false });
  }

  render() {
    const { muteOrUnmute, setVolume, volume, isMuted, theme } = this.props;
    const { showVolumeRange } = this.state;

    let volumeIcon = (<FontAwesomeIcon icon={['fas', 'volume-up']}/>);
    if (volume < 0.5) volumeIcon = (<FontAwesomeIcon icon={['fas', 'volume-down']}/>);
    if (volume === 0 || isMuted) {
      volumeIcon = [
        <FontAwesomeIcon key='volume-off' icon={['fas', 'volume-off']} transform='left-4.5' />,
        <FontAwesomeIcon key='times' icon={['fas', 'times']} transform='shrink-7 right-4.5' />
      ];
    }

    return (
      <VolumeContainer
        onMouseOver={this.onVolumeMouseEnter}
        onMouseLeave={this.onVolumeMouseLeave}
      >
        <ControlButton onClick={muteOrUnmute} className={'fa-layers fa-fw'}>
          {volumeIcon}
        </ControlButton>
        <VolumeRangeWrapper
          align='center'
          justify='center'
          onClick={(e) => e.stopPropagation()}
          isVisible={showVolumeRange}
        >
          <VolumeRange
            value={volume}
            onChange={setVolume}
            style={{
              background: `linear-gradient(to right, ${theme['turquoise']} 0%,` 
                          + `${theme['turquoise']} ${volume * 100}%,` 
                          + `${theme['clouds']} ${volume * 100}%,` 
                          + `${theme['clouds']} 100%)`
            }}
          >
          </VolumeRange>
        </VolumeRangeWrapper>
        <Bridge isVisible={showVolumeRange}></Bridge>
      </VolumeContainer>
    );
  }
}

export default withTheme(VolumeControl);