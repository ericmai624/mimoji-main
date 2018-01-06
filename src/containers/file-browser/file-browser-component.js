import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { togglePlayer, playOnChromecast } from 'stores/app';
import { toggleFileBrowserDialog, fetchContent } from 'stores/file-browser';
import { fetchStreamInfo } from 'stores/stream';
import { updateTextTrack } from 'stores/text-track';

import FileBrowserList from './file-list/file-list-component';
import CastOptions from './cast-options/cast-options-component';

import { Container } from './file-browser-styles';

class FileBrowser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOptionsVisible: true,
      file: {}
    };
    
    this.fetch = this.fetch.bind(this);
    this.onDoubleClickDirectory = this.onDoubleClickDirectory.bind(this);
    this.onDoubleClickFile = this.onDoubleClickFile.bind(this);
    this.stream = this.stream.bind(this);
    this.cast = this.cast.bind(this);
    this.addTextTrack = this.addTextTrack.bind(this);
    this.navigateUpDir = this.navigateUpDir.bind(this);
    this.toggleCastOptions = this.toggleCastOptions.bind(this);
  }
  
  componentDidMount() {
    const { fileBrowser } = this.props;
    this.fetch(fileBrowser.directory);
  }

  fetch(dir, nav) {
    const { fetchContent } = this.props;
    return fetchContent(dir, nav);
  }

  onDoubleClickDirectory(e, file) {
    e.preventDefault();
    this.fetch(file.filePath);
  }

  onDoubleClickFile(e, file) {
    e.preventDefault();
    if (file.type === 'subtitle') return this.addTextTrack(file.filePath, file.name, 'auto', 0);
    this.setState({ file });
    this.toggleCastOptions();
  }

  cast() {
    const { cast, chrome } = window;
    const { fetchStreamInfo, playOnChromecast } = this.props;
    const { file } = this.state;
    const castSession = cast.framework.CastContext.getInstance().getCurrentSession();
    if (!castSession) return console.log('need to connect to Google Cast first');

    fetchStreamInfo(file.filePath)
      .then((data) => {
        playOnChromecast(true);
        const mediaSource = `http://172.16.1.19:3000/api/stream/video/${data.source}/index.m3u8`;
        const mediaType = 'application/x-mpegURL';
        const mediaInfo = new chrome.cast.media.MediaInfo(mediaSource, mediaType);
        const request = new chrome.cast.media.LoadRequest(mediaInfo);
        return castSession.loadMedia(request);
      })
      .then(() => console.log('load success'), (err) => console.log('Error code: ', err));
  }

  stream() {
    const { app, fileBrowser, toggleFileBrowserDialog, togglePlayer, playOnChromecast, fetchStreamInfo } = this.props;
    const { file } = this.state;
    
    fetchStreamInfo(file.filePath)
      .then(() => {
        if (fileBrowser.isVisible) toggleFileBrowserDialog();
        if (!app.isPlayerEnabled) togglePlayer();
        playOnChromecast(false);
        this.setState({ isOptionsVisible: false });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  addTextTrack(path, label, encoding, offset) {
    const { fileBrowser, toggleFileBrowserDialog, updateTextTrack } = this.props;

    updateTextTrack({ path, label, encoding, offset, isEnabled: true });
    if (fileBrowser.isVisible) return toggleFileBrowserDialog();
  }

  navigateUpDir(e) {
    e.preventDefault();
    const { fileBrowser } = this.props;
    this.fetch(fileBrowser.directory, '..');
  }

  toggleCastOptions(e) {
    const { isOptionsVisible } = this.state;
    this.setState({ isOptionsVisible: !isOptionsVisible });
  }
  
  render() {
    const { isOptionsVisible } = this.state;
    const { fileBrowser, toggleFileBrowserDialog } = this.props;

    return (
      <Container className='flex flex-center absolute' hidden={!fileBrowser.isVisible}>
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
          cast={this.cast}
          stream={this.stream}
          toggleCastOptions={this.toggleCastOptions}
        />
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({ app: state.app, fileBrowser: state.fileBrowser });

const mapDispatchToProps = (dispatch) => ({ 
  fetchContent: bindActionCreators(fetchContent, dispatch),
  toggleFileBrowserDialog: bindActionCreators(toggleFileBrowserDialog, dispatch),
  togglePlayer: bindActionCreators(togglePlayer, dispatch),
  playOnChromecast: bindActionCreators(playOnChromecast, dispatch),
  fetchStreamInfo: bindActionCreators(fetchStreamInfo, dispatch),
  updateTextTrack: bindActionCreators(updateTextTrack, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(FileBrowser);