import React, { Component } from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import FileBrowserList from './file-browser-list/file-browser-list-component';

import { togglePlayer } from 'stores/app';
import { toggleFileBrowserDialog, fetchContent } from 'stores/file-browser';
import { fetchStreamInfo } from 'stores/stream';
import { updateTextTrack } from 'stores/text-track';

import {
  Dimmer,
  Container,
  Side,
  Main,
  Nav,
  NaviBtns,
  Directory
} from './file-browser-styles';

class FileBrowser extends Component {
  constructor(props) {
    super(props);

    this.fetch = this.fetch.bind(this);
    this.onDoubleClickDirectory = this.onDoubleClickDirectory.bind(this);
    this.onDoubleClickFile = this.onDoubleClickFile.bind(this);
    this.stream = this.stream.bind(this);
    this.cast = this.cast.bind(this);
    this.addTextTrack = this.addTextTrack.bind(this);
    this.navigateUpDir = this.navigateUpDir.bind(this);
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
    return this.stream(file.filePath);
  }

  cast(path) {

  }

  stream(path) {
    const { toggleFileBrowserDialog, togglePlayer, fetchStreamInfo } = this.props;
    const { app, fileBrowser } = this.props;

    return fetchStreamInfo(path)
      .then(() => {
        if (fileBrowser.isVisible) toggleFileBrowserDialog();
        if (!app.isPlayerEnabled) togglePlayer();
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

  render() {
    const { fileBrowser, toggleFileBrowserDialog } = this.props;

    return (
      <Dimmer className='flex flex-center absolute' hidden={!fileBrowser.isVisible}>
        <Container className='grid'>
          <Side className='flex flex-center'>
            <h2>File Browser</h2>
          </Side>
          <Main>
            <Nav className='flex flex-align-center flex-space-between'>
              <Directory className='ellipsis'>
                <span>{fileBrowser.directory}</span>
              </Directory>
              <NaviBtns className='flex flex-center' onClick={this.navigateUpDir}>
                <FontAwesomeIcon icon={['fas', 'chevron-up']}/>
              </NaviBtns>
              <NaviBtns className='flex flex-center'>
                <FontAwesomeIcon icon={['fas', 'sort-amount-down']}/>
              </NaviBtns>
              <NaviBtns className='flex flex-center'>
                <FontAwesomeIcon icon={['fas', 'filter']}/>
              </NaviBtns>
              <NaviBtns className='flex flex-center' onClick={toggleFileBrowserDialog}>
                <FontAwesomeIcon icon={['fas', 'times']}/>
              </NaviBtns>
            </Nav>
            <FileBrowserList
              content={fileBrowser.content} 
              onDoubleClickDirectory={this.onDoubleClickDirectory} 
              onDoubleClickFile={this.onDoubleClickFile}
              navigateUpDir={this.navigateUpDir}
            />
          </Main>
        </Container>
      </Dimmer>
    );
  }
}

const mapStateToProps = (state) => ({ fileBrowser: state.fileBrowser, app: state.app });

const mapDispatchToProps = (dispatch) => ({ 
  fetchContent: bindActionCreators(fetchContent, dispatch),
  toggleFileBrowserDialog: bindActionCreators(toggleFileBrowserDialog, dispatch),
  togglePlayer: bindActionCreators(togglePlayer, dispatch),
  fetchStreamInfo: bindActionCreators(fetchStreamInfo, dispatch),
  updateTextTrack: bindActionCreators(updateTextTrack, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(FileBrowser);