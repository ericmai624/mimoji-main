import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import FileBrowserList from './file-list/file-list';
import CastOptions from './cast-options/cast-options';
import Nav from './nav/nav';
import Search from './search/search';
import { Flex } from 'src/shared/components';

import { toggleLoading, togglePlayer, streamToGoogleCast } from 'src/stores/app';
import { toggleFileBrowserDialog, updateContent } from 'src/stores/file-browser';
import { setStreamSource, updateStreamInfo } from 'src/stores/stream';
import { setTextTrackInfo } from 'src/stores/text-track';

import { fileBrowserType, textTrackType } from 'src/types';

const Container = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
`;

const Top = Flex.extend`
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 40px;
  box-sizing: border-box;
  background: ${({ theme }) => theme['wet_asphalt']};
  transition: transform 0.50s ease-in-out;
`;

const Logo = Flex.extend`
  font-family: 'Megrim', cursive;
  font-size: 32px;
  font-weight: bold;
  color: #fff;
  z-index: 10;
  width: 32px;
  height: 36px;
  user-select: none;
  position: absolute;
  top: 2px;
  left: 25px;
`;

const ListContainer = Flex.extend`
  position: absolute;
  width: 100%;
  height: calc(100% - 120px); /* minus Top and Nav height */
  top: 40px;
  box-sizing: border-box;
  transition: transform 0.5s ease-in-out;
`;

class FileBrowser extends Component {
  static propTypes = {
    app: PropTypes.objectOf(PropTypes.bool),
    fileBrowser: PropTypes.shape(fileBrowserType),
    textTrack: PropTypes.shape(textTrackType),
    updateContent: PropTypes.func,
    toggleFileBrowserDialog: PropTypes.func,
    togglePlayer: PropTypes.func,
    toggleLoading: PropTypes.func,
    streamToGoogleCast: PropTypes.func,
    setStreamSource: PropTypes.func,
    updateStreamInfo: PropTypes.func,
    setTextTrackInfo: PropTypes.func
  }

  state = {
    isOptionsVisible: false,
  };

  componentDidMount() {
    const { io } = window;

    /* Register event listeners first */
    io.on('request content fulfilled', this.updatedir);
    io.on('request content rejected', this.updatedir);
    
    /* Get root directory content */
    this.getContent();
  }

  getContent = (dir = '') => {
    const { io } = window;
    io.emit('request content', dir);
  }

  updatedir = (data) => {
    const { updateContent } = this.props;
    if (!data) {
      return updateContent(true/* error */, null);
    }
    return updateContent(false/* error */, data);
  }

  onDoubleClickDirectory = (e, file) => {
    e.preventDefault();
    this.getContent(file.filePath);
  }

  onDoubleClickFile = (e, file) => {
    e.preventDefault();
    const { setStreamSource, textTrack } = this.props;
    if (file.type === 'subtitle') return this.addTextTrack(file.filePath, file.name, textTrack.encoding, textTrack.offset);
    if (file.type === 'video') {
      this.selectedVideo = file.filePath;
      setStreamSource(this.selectedVideo);
      this.toggleCastOptions();
    }
  }

  setPlayerType = async (e, isChromecast/* boolean */) => {
    const { cast } = window;
    const { app, toggleLoading, fileBrowser, toggleFileBrowserDialog, streamToGoogleCast } = this.props;
    const { isOptionsVisible } = this.state;

    if (fileBrowser.isVisible) toggleFileBrowserDialog();
    if (isOptionsVisible) this.toggleCastOptions();

    streamToGoogleCast(isChromecast);

    try {
      if (isChromecast) {
        const castContext = cast.framework.CastContext.getInstance();
        const sessionState = castContext.getSessionState();
        if (sessionState === cast.framework.SessionState.NO_SESSION) {
          await castContext.requestSession();
        }
      }
      /* Wait 1000ms for smoother transition */
      if (!app.isInitializing) toggleLoading();
  
      setTimeout(this.wakeUpPlayer, 1000);
    } catch (err) {
      console.log(err);
    }
  }

  wakeUpPlayer = () => {
    const { io } = window;
    const { app, updateStreamInfo, togglePlayer } = this.props;

    if (!app.isPlayerEnabled) togglePlayer();

    io.emit('new stream', { video: this.selectedVideo, seek: 0 });
  
    io.once('stream created', updateStreamInfo);
  }

  addTextTrack = (location, label, encoding, offset) => {
    const { io } = window;
    const { fileBrowser, toggleFileBrowserDialog, setTextTrackInfo } = this.props;

    io.emit('new subtitle', { location, offset, encoding });
    io.once('subtitle created', id => setTextTrackInfo({ id, label, location }));

    if (fileBrowser.isVisible) return toggleFileBrowserDialog();
  }

  navigateUpDir = (e) => {
    e.preventDefault();
    const { folders, sep } = this.props.fileBrowser.directory;
    if (!folders || !folders.length) return;
    const location = folders.slice(0, -1).join(sep);
    this.getContent(location);
  }

  toggleCastOptions = (e) => {
    if (e) e.stopPropagation();
    const { isOptionsVisible } = this.state;
    this.setState({ isOptionsVisible: !isOptionsVisible });
  }
  
  render() {
    const { isOptionsVisible } = this.state;
    const { fileBrowser, toggleFileBrowserDialog } = this.props;
    const isComponentVisible = fileBrowser.isVisible;

    if (fileBrowser.hasError) {
      return (
        <Container id='file-browser'>
          <span>Something went wrong</span>
        </Container>
      );
    }

    return (
      <Container id='file-browser'>
        <Top align='center' justify='center' style={{ transform: isComponentVisible ? 'none' : 'translateY(-63px)' }}>
          <Logo>m</Logo>
          <Search />
        </Top>
        <ListContainer align='center' justify='flex-end' style={{ transform: isComponentVisible ? 'none' : 'translateX(100%)' }}>
          <FileBrowserList
            fileBrowser={fileBrowser}
            onDoubleClickDirectory={this.onDoubleClickDirectory}
            onDoubleClickFile={this.onDoubleClickFile}
            navigateUpDir={this.navigateUpDir}
          />
          <CastOptions
            isVisible={isOptionsVisible}
            setPlayerType={this.setPlayerType}
            toggleCastOptions={this.toggleCastOptions}
          />
        </ListContainer>
        <Nav
          directory={fileBrowser.directory}
          isComponentVisible={isComponentVisible}
          toggleFileBrowserDialog={toggleFileBrowserDialog}
        />
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
  toggleFileBrowserDialog: bindActionCreators(toggleFileBrowserDialog, dispatch),
  togglePlayer: bindActionCreators(togglePlayer, dispatch),
  toggleLoading: bindActionCreators(toggleLoading, dispatch),
  streamToGoogleCast: bindActionCreators(streamToGoogleCast, dispatch),
  setStreamSource: bindActionCreators(setStreamSource, dispatch),
  updateStreamInfo: bindActionCreators(updateStreamInfo, dispatch),
  setTextTrackInfo: bindActionCreators(setTextTrackInfo, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(FileBrowser);
