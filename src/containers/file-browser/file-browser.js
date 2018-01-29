import React, { Component } from 'react';
import styled from 'styled-components';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { toggleLoading, togglePlayer, streamToGoogleCast } from 'stores/app';
import { toggleFileBrowserDialog, updateContent, togglePending } from 'stores/file-browser';
import { setStreamSource, updateStreamInfo } from 'stores/stream';
import { updateTextTrackId } from 'stores/text-track';

import { Flex } from 'shared/components';

import FileBrowserList from './file-list/file-list';
import CastOptions from './cast-options/cast-options';
import Nav from './nav/nav';
import Search from './search/search';

const Container = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: inherit;
  ${'' /* background-image: url('assets/img/1440627692.jpg'); */}
`;

const Top = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  height: 70px;
  box-sizing: border-box;
  background: #2c3e50;
  transition: all 0.58s ease-in-out;
`;

const ListContainer = Flex.extend`
  position: absolute;
  top: 70px;
  width: 100%;
  height: calc(100% - 150px);
  box-sizing: border-box;
`;

const CloseWrapper = Flex.extend`
  border-radius: 50%;
  width: 34px;
  height: 34px;
  background: #fff;
  position: absolute;
  right: 58px;
  bottom: 0;
  transform: translateY(13px);
  z-index: 10;
  font-size: 22px;
  color: #2c3e50;
`;

class FileBrowser extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      isOptionsVisible: false,
    };
    
    this.getContent = this.getContent.bind(this);
    this.updatedir = this.updatedir.bind(this);
    this.onDoubleClickDirectory = this.onDoubleClickDirectory.bind(this);
    this.onDoubleClickFile = this.onDoubleClickFile.bind(this);
    this.setPlayerType = this.setPlayerType.bind(this);
    this.wakeUpPlayer = this.wakeUpPlayer.bind(this);
    this.addTextTrack = this.addTextTrack.bind(this);
    this.navigateUpDir = this.navigateUpDir.bind(this);
    this.toggleCastOptions = this.toggleCastOptions.bind(this);
  }
  
  componentDidMount() {
    const { io } = window;

    /* Register event listeners first */
    io.on('request content fulfilled', this.updatedir);

    io.on('request content rejected', this.updatedir);

    /* Start requesting directory content */
    this.getContent();
  }

  getContent(dir, nav) {
    const { io } = window;
    const { togglePending } = this.props;
    togglePending(); // Toggles the loading animation
    io.emit('request content', { dir, nav });
  }

  updatedir(data) {
    const { togglePending, updateContent } = this.props;
    togglePending();
    /* 
    request rejection will not return any data.
    So if data is undefined, the request is rejected 
    */
    updateContent(data, data === undefined);
  }

  onDoubleClickDirectory(e, file) {
    e.preventDefault();
    this.getContent(file.filePath);
  }

  onDoubleClickFile(e, file) {
    e.preventDefault();
    const { setStreamSource, textTrack } = this.props;
    if (file.type === 'subtitle') return this.addTextTrack(file.filePath, file.name, textTrack.encoding, textTrack.offset);
    if (file.type === 'video') {
      this.selectedVideo = file.filePath;
      setStreamSource(this.selectedVideo);
      this.toggleCastOptions();
    }
  }

  setPlayerType(option/* boolean */) {
    const { app, toggleLoading, fileBrowser, toggleFileBrowserDialog, streamToGoogleCast } = this.props;

    if (fileBrowser.isVisible) toggleFileBrowserDialog();

    streamToGoogleCast(option);

    if (!app.isInitializing) toggleLoading();

    /* Wait 1000ms for smoother transition */
    setTimeout(this.wakeUpPlayer, 1000);
  }

  wakeUpPlayer() {
    const { io } = window;
    const { app, updateStreamInfo, togglePlayer } = this.props;
    const { isOptionsVisible } = this.state;

    if (!app.isPlayerEnabled) togglePlayer();

    io.emit('new stream', { video: this.selectedVideo, seek: 0 });
  
    io.once('stream created', updateStreamInfo);

    // switch back to file browser mode quietly in the background
    if (isOptionsVisible) setTimeout(this.toggleCastOptions, 1000);
  }

  addTextTrack(location, label, encoding, offset) {
    const { io } = window;
    const { fileBrowser, toggleFileBrowserDialog, updateTextTrackId } = this.props;

    io.emit('new subtitle', { location, offset, encoding });
    io.once('subtitle created', id => updateTextTrackId(id, label));

    if (fileBrowser.isVisible) return toggleFileBrowserDialog();
  }

  navigateUpDir(e) {
    e.preventDefault();
    const { fileBrowser } = this.props;
    this.getContent(fileBrowser.directory, '..');
  }

  toggleCastOptions(e) {
    if (e) e.stopPropagation();
    const { isOptionsVisible } = this.state;
    this.setState({ isOptionsVisible: !isOptionsVisible });
  }
  
  render() {
    const { isOptionsVisible } = this.state;
    const { app, fileBrowser, toggleFileBrowserDialog } = this.props;
    const { isVisible } = fileBrowser;
    const containerStyle = {
      visibility: isVisible ? 'visible' : 'hidden',
      zIndex: app.isPlayerEnabled ? 2147483647 : 5
    };

    if (fileBrowser.hasError) {
      return (
        <Container 
          id='file-browser'
          align='center'
          justify='center'
          style={containerStyle}
        >
          Something went wrong
        </Container>
      );
    }

    return (
      <Container 
        id='file-browser'
        style={containerStyle}
      >
        <Top style={{ top: isVisible ? 0 : '-70px' }}>
          <Search />
          <CloseWrapper align='center' justify='center' onClick={toggleFileBrowserDialog}>
            <FontAwesomeIcon icon={['fas', 'times']}/>
          </CloseWrapper>
        </Top>
        <ListContainer align='center' justify='flex-end'>
          <FileBrowserList
            fileBrowser={fileBrowser}
            isVisible={!isOptionsVisible}
            onDoubleClickDirectory={this.onDoubleClickDirectory}
            onDoubleClickFile={this.onDoubleClickFile}
            toggleFileBrowserDialog={toggleFileBrowserDialog}
            navigateUpDir={this.navigateUpDir}
          />
          <CastOptions
            isVisible={isOptionsVisible}
            setPlayerType={this.setPlayerType}
            toggleCastOptions={this.toggleCastOptions}
          />
        </ListContainer>
        <Nav location={fileBrowser.directory} isVisible={isVisible}/>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  app: state.app,
  fileBrowser: state.fileBrowser,
  textTrack: state.textTrack
});

const mapDispatchToProps = (dispatch) => ({ 
  updateContent: bindActionCreators(updateContent, dispatch),
  togglePending: bindActionCreators(togglePending, dispatch),
  toggleFileBrowserDialog: bindActionCreators(toggleFileBrowserDialog, dispatch),
  togglePlayer: bindActionCreators(togglePlayer, dispatch),
  toggleLoading: bindActionCreators(toggleLoading, dispatch),
  streamToGoogleCast: bindActionCreators(streamToGoogleCast, dispatch),
  setStreamSource: bindActionCreators(setStreamSource, dispatch),
  updateStreamInfo: bindActionCreators(updateStreamInfo, dispatch),
  updateTextTrackId: bindActionCreators(updateTextTrackId, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(FileBrowser);