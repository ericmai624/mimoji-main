import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { toggleFileBrowserDialog } from 'stores/file-browser';
import { updateTextTrackId } from 'stores/text-track';

import { Flex } from 'shared/components';

import SubtitleOffset from './subtitle-offset/subtitle-offset';
import SubtitleEncoding from './subtitle-encoding/subtitle-encoding';

const containerWidth = 300;
const containerHeight = 300;
const boxShadow = '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)';
const padding = 25;

const ContainerRectangle = Flex.extend`
  left: 50%;
  top: 50%;
  margin-left: -${containerWidth + 35}px;
  margin-top: -${(containerHeight - 50) / 2}px;
  width: ${containerWidth * 2 + 70}px;
  height: ${containerHeight - 50}px;
  padding: ${padding}px ${padding}px;
  background: ${({ theme }) => theme.bgColor};
  box-shadow: ${boxShadow};
  z-index: 101;
  box-sizing: border-box;
  color: rgb(255,255,255);
  position: absolute;
`;

const ContainerSquare = Flex.extend`
  right: 50%;
  top: 50%;
  margin-right: -10px;
  margin-top: -${containerHeight / 2}px;
  width: ${containerWidth}px;
  height: ${containerHeight}px;
  padding: ${padding}px;
  align-items: center;
  box-sizing: border-box;
  background: rgb(255, 255, 255);
  box-shadow: ${boxShadow};
  z-index: 102;
  position: absolute;
`;

const Preference = styled.ul`
  width: ${containerWidth - padding}px;
  list-style: none;
  float: right;
`;

const Setting = styled.li`
  display: flex;
  width: 100%;
  height: 15px;
  margin: 40px 0;
  font-size: 12px;
`;

const Wrapper = Flex.extend`
  width: 100%;
  overflow: hidden;
  word-wrap: break-word;
`;

const StyledSpan = styled.span`
  font-size: 15px;
  line-height: 20px;
  color: rgb(110, 110, 110);
  transition: color 0.25s ease;

  &:hover {
    text-decoration: underline;
    color: ${({ theme }) => theme.orange};
    cursor: pointer;
  }
`;

const ButtonsContainer = Flex.extend`
  width: 100px;
  height: 42px;
  right: 20px;
  bottom: 20px;
  position: absolute;
`;

const ButtonWrapper = Flex.extend`
  font-size: 24px;
  width: 40px;
  height: 40px;
  cursor: pointer;
  transition: color 0.25s ease-in-out;

  &:hover {
    color: ${({ theme }) => theme.orange};
    background: rgba(219, 219, 219, 0.2);
  }
`;

class SubSettings extends Component {

  static propTypes = {
    textTrack: PropTypes.object.isRequired,
    isVisible: PropTypes.bool.isRequired,
    toggleFileBrowserDialog: PropTypes.func.isRequired,
    toggleSubSettings: PropTypes.func.isRequired,
    onControlsMouseMove: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    
    this.confirm = this.confirm.bind(this);
  }

  confirm(e) {
    const { io } = window;
    const { textTrack, updateTextTrackId, toggleSubSettings } = this.props;
    const data = {
      location: textTrack.location,
      offset: textTrack.offset,
      encoding: textTrack.encoding
    };

    if (textTrack.isEnabled) {
      io.emit('new subtitle', data);
      io.once('subtitle created', id => updateTextTrackId(id, textTrack.label));
    }
    
    toggleSubSettings();
  }

  render() {
    const { toggleFileBrowserDialog, toggleSubSettings, onControlsMouseMove, isVisible, textTrack } = this.props;
    const displayTitle = textTrack.label === '' ? 'None' : textTrack.label;

    return (
      <Fragment>
        <ContainerSquare
          align='center'
          justify='center'
          style={{ display: isVisible ? 'flex' : 'none' }}
          onMouseMove={onControlsMouseMove} /* Prevent controls from hiding */
        >
          <Wrapper column justify='center'>
            <h2>Language</h2>
            <StyledSpan onClick={toggleFileBrowserDialog}>
              <FontAwesomeIcon icon={['fas', 'ellipsis-h']} size='2x'/>
            </StyledSpan>
            <div>{displayTitle}</div>
          </Wrapper>
        </ContainerSquare>
        <ContainerRectangle
          align='center'
          justify='flex-end'
          style={{ display: isVisible ? 'flex' : 'none' }}
          onMouseMove={onControlsMouseMove}
        >
          <Preference>
            <Setting>
              <span>Encoding:&nbsp;</span>
              <SubtitleEncoding />
            </Setting>
            <Setting>
              <span>Offset&nbsp;<span>(seconds)</span>:&nbsp;</span>
              <SubtitleOffset />
            </Setting>
          </Preference>
          <ButtonsContainer align='center' justify='space-around'>
            <ButtonWrapper align='center' justify='center' onClick={toggleSubSettings}>
              <FontAwesomeIcon icon={['fas', 'times']}/>
            </ButtonWrapper>
            <ButtonWrapper align='center' justify='center' onClick={this.confirm}>
              <FontAwesomeIcon icon={['fas', 'check']}/>
            </ButtonWrapper>
          </ButtonsContainer>
        </ContainerRectangle>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({ textTrack: state.textTrack });

const mapDispatchToProps = dispatch => ({
  toggleFileBrowserDialog: bindActionCreators(toggleFileBrowserDialog, dispatch),
  updateTextTrackId: bindActionCreators(updateTextTrackId, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SubSettings);