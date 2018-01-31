import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { toggleFileBrowserDialog } from 'stores/file-browser';
import { updateTextTrackId } from 'stores/text-track';

import { Flex } from 'shared/components';

import SubtitleSource from './subtitle-source/subtitle-source';
import SubtitleEncoding from './subtitle-encoding/subtitle-encoding';
import SubtitleOffset from './subtitle-offset/subtitle-offset';

const Container = styled.ul`
  position: absolute;
  list-style: none;
  left: 50%;
  top: 50%;
  width: 600px;
  height: auto;
  transform: translate(-50%, -50%);
  ${'' /* background: ${({ theme }) => theme['wet_asphalt']}; */}
`;

const Setting = styled.li`
  position: relative;
  display: flex;
  width: 100%;
  height: 48px;
  margin-bottom: 24px;
`;

const Source = Flex.extend`
  position: absolute;
  left: 0;
  top: 0;
  width: 100px;
  height: 100%;
  color: #fff;
  font-weight: bold;
  font-size: 14px;
  box-sizing: border-box;
  background: ${({ theme }) => theme['turquoise']};

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    right: calc(-10px * 0.866);
    transform: translateY(-50%);
    border-width: 10px 0 10px 10px;
    border-style: solid;
    border-color: transparent transparent transparent ${({ theme }) => theme['turquoise']};
    z-index: 10;
  }
`;

const Encoding = Source.extend`
  background: ${({ theme }) => theme['peter_river']};

  &::before {
    border-color: transparent transparent transparent ${({ theme }) => theme['peter_river']};
  }
`;

const Offset = Source.extend`
  background: ${({ theme }) => theme['sun_flower']};

  &::before {
    border-color: transparent transparent transparent ${({ theme }) => theme['sun_flower']};
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
    const { toggleFileBrowserDialog, onControlsMouseMove, isVisible, textTrack } = this.props;
    const displayTitle = textTrack.label === '' ? 'None' : textTrack.label;

    return (
      <Container style={{ display: isVisible ? 'block' : 'none' }} onMouseMove={onControlsMouseMove}>
        <Setting>
          <Source align='center' justify='center'><span>Source</span></Source>
          <Content align='center' justify='center'>
            <SubtitleSource title={displayTitle} toggleFileBrowserDialog={toggleFileBrowserDialog} />
          </Content>
        </Setting>
        <Setting>
          <Encoding align='center' justify='center'><span>Encoding</span></Encoding>
          <Content align='center' justify='center'>
            <SubtitleEncoding />
          </Content>
        </Setting>
        <Setting>
          <Offset align='center' justify='center'><span>Offset</span></Offset>
          <Content align='center' justify='center'>
            <SubtitleOffset />
          </Content>
        </Setting>
      </Container>
    );
  }
}

const mapStateToProps = state => ({ textTrack: state.textTrack });

const mapDispatchToProps = dispatch => ({
  toggleFileBrowserDialog: bindActionCreators(toggleFileBrowserDialog, dispatch),
  updateTextTrackId: bindActionCreators(updateTextTrackId, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SubSettings);