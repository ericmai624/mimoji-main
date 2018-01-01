import React, { Component } from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import FileBrowserList from '../../components/file-browser-list/file-browser-list-component';

import { toggleFileBrowserDialog, fetchContent } from '../../actions/file-browser';
import { getStreamInfo, updateStreamSub } from '../../actions/stream';
import { togglePlayerProps } from '../../actions/player';

import {
  Dimmer,
  Container,
  Side,
  Main,
  Nav,
  NaviBtns,
  CurrDirectory
} from './file-browser-styles';

class FileBrowser extends Component {
  constructor(props) {
    super(props);

    this.fetch = this.fetch.bind(this);
    this.onDoubleClickDirectory = this.onDoubleClickDirectory.bind(this);
    this.onDoubleClickFile = this.onDoubleClickFile.bind(this);
    this.addSubtitle = this.addSubtitle.bind(this);
    this.castSelectedFile = this.castSelectedFile.bind(this);
    this.navigateUpDir = this.navigateUpDir.bind(this);
  }
  
  componentDidMount() {
    const { fileBrowser } = this.props;
    this.fetch(fileBrowser.currDir);
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
    let ext = file.name.slice(-3);
    if (ext === 'srt' || ext === 'vtt') return this.addSubtitle(file.filePath, file.name, '', 0);
    return this.castSelectedFile(file.filePath);
  }

  addSubtitle(path, title, encoding, offset) {
    const { updateStreamSub, toggleFileBrowserDialog } = this.props;
    updateStreamSub({ path, title, encoding, offset, enabled: true });
    toggleFileBrowserDialog();
  }

  castSelectedFile(path) {
    const { toggleFileBrowserDialog, togglePlayerProps, getStreamInfo } = this.props;

    return getStreamInfo(path, 0)
      .then(() => {
        toggleFileBrowserDialog();
        togglePlayerProps('main');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  navigateUpDir(e) {
    e.preventDefault();
    const { fileBrowser } = this.props;
    this.fetch(fileBrowser.currDir, '..');
  }

  render() {
    const { fileBrowser, toggleFileBrowserDialog } = this.props;

    return (
      <Dimmer className='flex flex-center absolute' hidden={!fileBrowser.showDialog}>
        <Container className='grid'>
          <Side></Side>
          <Main>
            <Nav className='flex flex-align-center flex-space-between'>
              <CurrDirectory className='ellipsis'>
                <span>{fileBrowser.currDir}</span>
              </CurrDirectory>
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

const mapStateToProps = (state) => ({ fileBrowser: state.fileBrowser });

const mapDispatchToProps = (dispatch) => ({ 
  fetchContent: bindActionCreators(fetchContent, dispatch),
  toggleFileBrowserDialog: bindActionCreators(toggleFileBrowserDialog, dispatch),
  togglePlayerProps: bindActionCreators(togglePlayerProps, dispatch),
  getStreamInfo: bindActionCreators(getStreamInfo, dispatch),
  updateStreamSub: bindActionCreators(updateStreamSub, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(FileBrowser);