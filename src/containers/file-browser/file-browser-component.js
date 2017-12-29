import React, { Component } from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import FileBrowserList from '../../components/file-browser-list/file-browser-list-component';

import { toggleFileBrowserDialog, fetchDirContent } from '../../actions/file-browser';
import { getStreamInfo } from '../../actions/stream';
import { toggleVideoPlayer } from '../../actions/player';

import {
  Wrapper,
  Dialog,
  DialogSidebar,
  Main,
  Nav,
  NaviBtns,
  CurrDirectory
} from './file-browser-styles';

class FileBrowser extends Component {
  constructor(props) {
    super(props);

    this.castSelectedFile = this.castSelectedFile.bind(this);
    this.onDoubleClickDirectory = this.onDoubleClickDirectory.bind(this);
    this.onDoubleClickFile = this.onDoubleClickFile.bind(this);
    this.navigateUpDir = this.navigateUpDir.bind(this);
  }
  
  componentDidMount() {
    const { fetchDirContent, fileBrowser } = this.props;
    fetchDirContent(fileBrowser.currDir);
  }

  onDoubleClickDirectory(e, dir) {
    e.preventDefault();
    const { fetchDirContent } = this.props;
    fetchDirContent(dir);
  }

  onDoubleClickFile(e, file) {
    e.preventDefault();
    this.castSelectedFile(file);
  }

  castSelectedFile(path) {
    const { toggleFileBrowserDialog, toggleVideoPlayer, getStreamInfo } = this.props;

    return getStreamInfo(path, 0)
      .then(() => {
        toggleFileBrowserDialog();
        toggleVideoPlayer();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  navigateUpDir(e) {
    e.preventDefault();
    const { fileBrowser, fetchDirContent } = this.props;
    fetchDirContent(fileBrowser.currDir + '/..');
  }

  render() {
    const { fileBrowser, toggleFileBrowserDialog } = this.props;
    const { onDoubleClickDirectory, onDoubleClickFile } = this;

    return (
      <Wrapper className='flex flex-center fixed'>
        <Dialog className='grid'>
          <DialogSidebar></DialogSidebar>
          <Main>
            <Nav>
              <CurrDirectory className='ellipsis'>
                {fileBrowser.currDir}
              </CurrDirectory>
              <NaviBtns className='flex flex-center' onClick={toggleFileBrowserDialog}>
                <FontAwesomeIcon icon={['fas', 'times']}/>
              </NaviBtns>
              <NaviBtns className='flex flex-center' onClick={this.navigateUpDir}>
                <FontAwesomeIcon icon={['fas', 'chevron-up']}/>
              </NaviBtns>
              <NaviBtns className='flex flex-center'>
                <FontAwesomeIcon icon={['fas', 'sort-amount-down']}/>
              </NaviBtns>
              <NaviBtns className='flex flex-center'>
                <FontAwesomeIcon icon={['fas', 'filter']}/>
              </NaviBtns>
            </Nav>
            <FileBrowserList
              content={fileBrowser.content} 
              onDoubleClickDirectory={onDoubleClickDirectory} 
              onDoubleClickFile={onDoubleClickFile}
            />
          </Main>
        </Dialog>
      </Wrapper>
    );
  }
}

const mapStateToProps = (state) => ({ showFileDialog: state.showFileDialog, fileBrowser: state.fileBrowser });

const mapDispatchToProps = (dispatch) => ({ 
  fetchDirContent: bindActionCreators(fetchDirContent, dispatch),
  toggleFileBrowserDialog: bindActionCreators(toggleFileBrowserDialog, dispatch),
  toggleVideoPlayer: bindActionCreators(toggleVideoPlayer, dispatch),
  getStreamInfo: bindActionCreators(getStreamInfo, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(FileBrowser);