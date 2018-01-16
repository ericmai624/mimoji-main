import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { togglePlayer, streamToGoogleCast } from 'stores/app';
import { toggleFileBrowserDialog, fetchContent } from 'stores/file-browser';
import { setStreamSource, updateStreamInfo } from 'stores/stream';
import { genTextTrackId } from 'stores/text-track';

import FileBrowserList from './file-list/file-list-component';
import CastOptions from './cast-options/cast-options-component';

import { Container } from './file-browser-styles';

class FileBrowser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOptionsVisible: false
    };
    
    this.fetch = this.fetch.bind(this);
    this.onDoubleClickDirectory = this.onDoubleClickDirectory.bind(this);
    this.onDoubleClickFile = this.onDoubleClickFile.bind(this);
    this.stream = this.stream.bind(this);
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
    const { setStreamSource } = this.props;
    if (file.type === 'subtitle') return this.addTextTrack(file.filePath, file.name, 'auto', 0);
    // this.setState({ file });
    if (file.type === 'video') {
      this.selectedVideo = file.filePath;
      setStreamSource(this.selectedVideo);
      this.toggleCastOptions();
    }
  }

  stream(option) {
    const { io } = window;
    const { app, fileBrowser, toggleFileBrowserDialog, togglePlayer, streamToGoogleCast, updateStreamInfo } = this.props;
    const { isOptionsVisible } = this.state;
    
    streamToGoogleCast(option);

    io.emit('new stream', { video: this.selectedVideo, seek: 0 });

    io.once('stream created', updateStreamInfo);

    if (fileBrowser.isVisible) toggleFileBrowserDialog();
    if (isOptionsVisible) this.toggleCastOptions();
    if (!app.isPlayerEnabled) togglePlayer();
  }

  addTextTrack(location, label, encoding, offset) {
    const { fileBrowser, toggleFileBrowserDialog, genTextTrackId } = this.props;

    genTextTrackId({ location, label, encoding, offset });
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
      <Container id='file-browser' className='flex flex-center absolute full-size' isVisible={fileBrowser.isVisible}>
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
          stream={this.stream}
          toggleCastOptions={this.toggleCastOptions}
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
  fetchContent: bindActionCreators(fetchContent, dispatch),
  toggleFileBrowserDialog: bindActionCreators(toggleFileBrowserDialog, dispatch),
  togglePlayer: bindActionCreators(togglePlayer, dispatch),
  streamToGoogleCast: bindActionCreators(streamToGoogleCast, dispatch),
  setStreamSource: bindActionCreators(setStreamSource, dispatch),
  updateStreamInfo: bindActionCreators(updateStreamInfo, dispatch),
  genTextTrackId: bindActionCreators(genTextTrackId, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(FileBrowser);