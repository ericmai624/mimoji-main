import React, { Component, Fragment } from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import FileBrowserList from '../../components/file-browser-list/file-browser-list-component';

import { toggleFileBrowserDialog, fetchDirContent } from '../../actions/file-browser';
import { updateVideoUrl, updateVideoDuration } from '../../actions/video';
import { toggleVideoPlayer } from '../../actions/player';

import {
  Wrapper,
  Dialog,
  DialogSidebar,
  Main,
  NaviBtns,
  Label,
  LabelWrapper
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
    const { toggleFileDialog, toggleVideoPlayer, updateVideoUrl, updateVideoDuration } = this.props;

    toggleFileDialog();
    
    axios.get(`http://localhost:2222/api/cast/duration?video=${path}`)
      .then((response) => {
          const seekTime = 0;
          toggleVideoPlayer();
          updateVideoDuration(response.data);
          updateVideoUrl({ path, seekTime });

          /*
          const { cast, chrome } = window;

          const castSession = cast.framework.CastContext.getInstance().getCurrentSession();
          const mediaInfo = new chrome.cast.media.MediaInfo(`http://172.16.1.11:2222/api/cast/stream?video=${path}`, 'video/mp4');
          const request = new chrome.cast.media.LoadRequest(mediaInfo);
      
          if (castSession) {
            castSession.loadMedia(request)
              .then(() => console.log('load'), (errorCode) => console.log('Error Code: ', errorCode));
          }
          */
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
      <Fragment>
        <LabelWrapper>
          <Label onClick={toggleFileBrowserDialog}>Choose a Video</Label>
        </LabelWrapper>
        <Wrapper style={{ display: fileBrowser.showDialog ? 'flex' : 'none' }}>
          <Dialog>
            <DialogSidebar></DialogSidebar>
            <Main>
              <NaviBtns onClick={toggleFileBrowserDialog}>
                <FontAwesomeIcon icon={['fas', 'times']}/>
              </NaviBtns>
              <NaviBtns>
                <FontAwesomeIcon icon={['fas', 'chevron-up']} onClick={this.navigateUpDir}/>
              </NaviBtns>
              <FileBrowserList
                content={fileBrowser.content} 
                onDoubleClickDirectory={onDoubleClickDirectory} 
                onDoubleClickFile={onDoubleClickFile}
              />
            </Main>
          </Dialog>
        </Wrapper>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({ showFileDialog: state.showFileDialog, fileBrowser: state.fileBrowser });

const mapDispatchToProps = (dispatch) => ({ 
  fetchDirContent: bindActionCreators(fetchDirContent, dispatch),
  toggleFileBrowserDialog: bindActionCreators(toggleFileBrowserDialog, dispatch),
  toggleVideoPlayer: bindActionCreators(toggleVideoPlayer, dispatch),
  updateVideoUrl: bindActionCreators(updateVideoUrl, dispatch),
  updateVideoDuration: bindActionCreators(updateVideoDuration, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(FileBrowser);