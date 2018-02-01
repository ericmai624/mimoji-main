import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { toggleFileBrowserDialog } from 'stores/file-browser';
import { setTextTrackInfo } from 'stores/text-track';

import { Flex, Button } from 'shared/components';

import SubtitleSource from './subtitle-source/subtitle-source';
import SubtitleEncoding from './subtitle-encoding/subtitle-encoding';
import SubtitleOffset from './subtitle-offset/subtitle-offset';

const Container = Flex.extend`
  position: absolute;
  left: 50%;
  top: 50%;
  width: 680px;
  height: 320px;
  transform: translate(-50%, -50%) scale(0.8);
  box-sizing: border-box;
  padding: 50px 40px;
  padding-bottom: 0;
  /* Same color as file browser */
  background-image: url('assets/img/1440627692.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed;
  background-size: cover;
`;

const Title = Flex.extend`
  position: absolute;
  left: 82px;
  top: -25px;
  width: 300px;
  height: 50px;
  padding-left: 25px;
  background: ${({ theme }) => theme['wet_asphalt']};
  color: #fff;
  font-size: 24px;
  font-weight: bold;
  user-select: none;
  box-shadow: 1px 1px 1px 1px rgba(0,0,0,0.1), -1px 1px 1px 1px rgba(0,0,0,0.1);
`;

const List = styled.ul`
  position: absolute;
  width: 600px;
  list-style: none;
`;

const Setting = styled.li`
  position: relative;
  display: flex;
  width: 100%;
  height: 48px;
  margin-bottom: 38px;
  box-shadow: 1px 1px 1px 1px rgba(0,0,0,0.1), -1px 1px 1px 1px rgba(0,0,0,0.1);
`;

const IconWrapper = Flex.extend`
  width: 26px;
`;

const Source = Flex.extend`
  position: absolute;
  left: 0;
  top: 0;
  width: 100px;
  height: 100%;
  padding-left: 5px;
  color: #fff;
  font-weight: bold;
  font-size: 14px;
  box-sizing: border-box;
  background: ${({ theme }) => theme['wet_asphalt']};

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    right: calc(-8px * 0.866);
    transform: translateY(-50%);
    border-width: 10px 0 10px 8px;
    border-style: solid;
    border-color: transparent transparent transparent ${({ theme }) => theme['wet_asphalt']};
    z-index: 10;
  }
`;

const Encoding = Source.extend`
  background: ${({ theme }) => theme['wet_asphalt']};

  &::before {
    border-color: transparent transparent transparent ${({ theme }) => theme['wet_asphalt']};
  }
`;

const Offset = Source.extend`
  background: ${({ theme }) => theme['wet_asphalt']};

  &::before {
    border-color: transparent transparent transparent ${({ theme }) => theme['wet_asphalt']};
  }
`;

const Content = Flex.extend`
  position: absolute;
  left: 100px;
  top: 0;
  width: calc(100% - 100px);
  height: 100%;
  padding-left: 25px;
  box-sizing: border-box;
  background: ${({ theme }) => theme['clouds']};
`;

const Confirm = Button.extend`
  position: absolute;
  bottom: -20px;
  right: 64px;
  width: 90px;
  height: 40px;
  background: ${({ theme }) => theme['peter_river']};
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  box-shadow: 1px 1px 1px 1px rgba(0,0,0,0.1), -1px 1px 1px 1px rgba(0,0,0,0.1);

  &:hover {
    background: #5dade2;
  }
`;

const Cancel = Confirm.extend`
  position: absolute;
  right: 184px;
  background: ${({ theme }) => theme['alizarin']};

  &:hover {
    background: #ec7063;
  }
`;

class SubSettings extends Component {

  static propTypes = {
    textTrack: PropTypes.object.isRequired,
    isVisible: PropTypes.bool.isRequired,
    toggleFileBrowserDialog: PropTypes.func.isRequired,
    toggleSubSettings: PropTypes.func.isRequired,
    onControlsMouseMove: PropTypes.func
  }

  constructor(props) {
    super(props);
    
    this.confirm = this.confirm.bind(this);
  }

  confirm(e) {
    const { io } = window;
    const { textTrack, setTextTrackInfo, toggleSubSettings } = this.props;
    const { location, offset, encoding, label } = textTrack;

    if (textTrack.isEnabled) {
      io.emit('new subtitle', { location, offset, encoding });
      io.once('subtitle created', id => setTextTrackInfo({ id, label, location }));
    }
    
    toggleSubSettings();
  }

  render() {
    const { toggleFileBrowserDialog, onControlsMouseMove, toggleSubSettings, isVisible, textTrack } = this.props;
    const displayTitle = textTrack.label === '' ? 'None' : textTrack.label;

    return (
      <Container
        align='center'
        justify='center'
        style={{ display: isVisible ? 'block' : 'none' }} 
        onMouseMove={onControlsMouseMove}
      >
        <Title align='center'>Subtitle</Title>
        <List>
          <Setting>
            <Source align='center' justify='flex-start'>
              <IconWrapper align='center' justify='center'>
                <FontAwesomeIcon icon={['fas', 'hdd']} />
              </IconWrapper>
              <span>Source</span>
            </Source>
            <Content align='center' justify='center'>
              <SubtitleSource title={displayTitle} toggleFileBrowserDialog={toggleFileBrowserDialog} />
            </Content>
          </Setting>
          <Setting>
            <Encoding align='center' justify='flex-start'>
              <IconWrapper align='center' justify='center'>
                <FontAwesomeIcon icon={['fas', 'code']} />
              </IconWrapper>
              <span>Encoding</span>
            </Encoding>
            <Content align='center' justify='center'>
              <SubtitleEncoding />
            </Content>
          </Setting>
          <Setting>
            <Offset align='center' justify='flex-start'>
              <IconWrapper align='center' justify='center'>
                <FontAwesomeIcon icon={['fas', 'clock']} />
              </IconWrapper>
              <span>Offset</span>
            </Offset>
            <Content align='center' justify='center'>
              <SubtitleOffset />
            </Content>
          </Setting>
        </List>
        <Confirm onClick={this.confirm}>Confirm</Confirm>
        <Cancel onClick={toggleSubSettings}>Cancel</Cancel>
      </Container>
    );
  }
}

const mapStateToProps = state => ({ textTrack: state.textTrack });

const mapDispatchToProps = dispatch => ({
  toggleFileBrowserDialog: bindActionCreators(toggleFileBrowserDialog, dispatch),
  setTextTrackInfo: bindActionCreators(setTextTrackInfo, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SubSettings);