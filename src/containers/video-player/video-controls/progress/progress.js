import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import momentDurationSetup from 'moment-duration-format';

import { Flex } from 'shared/components';

momentDurationSetup(moment);

const borderRadius = 6;
const progressHeight = 12;

const ProgressContainer = Flex.extend`
  width: 320px;
  height: ${progressHeight * 2}px;
  border: none;
  border-radius: ${borderRadius}px;
  line-height: 0;
  position: relative;
  background: transparent;
  cursor: pointer;
`;

const SeekTime = Flex.extend`
  visibility: ${({ isVisible }) => isVisible ? 'visible' : 'hidden'};
  opacity: ${({ isVisible }) => isVisible ? 1 : 0};
  font-size: 12px;
  color: rgb(255,255,255);
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
  position: absolute;

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

const ProgressBar = styled.progress`
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

class Progress extends Component {

  static propTypes = {
    currentTime: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired,
    format: PropTypes.string.isRequired,
    seek: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    
    this.state = {
      seekTimePos: 0,
      seekTime: 0,
      isSeekTimeVisible: false
    };

    this.getSeekTime = this.getSeekTime.bind(this);
    this.hideSeekTime = this.hideSeekTime.bind(this);
    this.handleSeek = this.handleSeek.bind(this);
  }
  
  getSeekTime(e) {
    e.stopPropagation();
    const { duration } = this.props;
    const { progress } = this;

    let seekTimePos = e.pageX - progress.getBoundingClientRect().left;
    if (seekTimePos < 0) seekTimePos = 0; // ensure seekTime won't go negative
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
    seek(seekTime);
  }

  render() {
    const { seekTimePos, seekTime, isSeekTimeVisible } = this.state;
    const { currentTime, duration, format } = this.props;
    const cursorTime = moment.duration(seekTime, 'seconds').format(format, { trim: false });

    return (
      <ProgressContainer
        align='center'
        justify='center'
        onClick={this.handleSeek}
        onMouseMove={this.getSeekTime}
        onMouseLeave={this.hideSeekTime}
        innerRef={(el) => this.progress = el}
      >
        <SeekTime 
          align='center'
          justify='center'
          style={{left: `${seekTimePos - 30}px`}}
          isVisible={isSeekTimeVisible}
        >
          {cursorTime}
        </SeekTime>
        <ProgressBar value={currentTime} max={duration} />
      </ProgressContainer>
    );
  }
}

export default Progress;