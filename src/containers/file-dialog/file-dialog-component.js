import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import FileList from '../../components/file-list/file-list-component';

import { toggleFileDialog, fetchDirList } from '../../actions/file-dialog';
import { updateVideoUrl, updateVideoDuration } from '../../actions/video';
import { toggleVideoPlayer } from '../../actions/player';

import {
  Wrapper,
  Dialog,
  DialogSidebar,
  Main,
  Close,
  Label,
  LabelWrapper
} from './file-dialog-styles';

class FileDialog extends Component {
  constructor(props) {
    super(props);
    this.castSelectedFile = this.castSelectedFile.bind(this);
  }
  
  componentDidMount() {
    const { fetchDirList, dir } = this.props;
    fetchDirList(dir.curr);
  }

  castSelectedFile(e, path) {
    e.preventDefault();

    const { toggleFileDialog, toggleVideoPlayer, updateVideoUrl, updateVideoDuration } = this.props;

    toggleFileDialog();
    
    axios.get(`http://172.16.1.11:2222/api/cast/duration?video=${path}`)
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
    /*

    */
  }

  render() {
    const { dir, showFileDialog, toggleFileDialog, fetchDirList } = this.props;

    return (
      <Fragment>
        <LabelWrapper>
          <Label onClick={toggleFileDialog}>Choose a Video</Label>
        </LabelWrapper>
        <Wrapper style={{ display: showFileDialog ? 'flex' : 'none' }}>
          <Dialog>
            <DialogSidebar></DialogSidebar>
            <Main>
              <Close onClick={toggleFileDialog}>
                <i className="fas fa-times"></i>
              </Close>
              <FileList 
                dir={dir} 
                fetchDirList={fetchDirList} 
                castSelectedFile={this.castSelectedFile}
              />
            </Main>
          </Dialog>
        </Wrapper>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({ showFileDialog: state.showFileDialog, dir: state.dir });

const mapDispatchToProps = (dispatch) => ({ 
  fetchDirList: bindActionCreators(fetchDirList, dispatch),
  toggleFileDialog: bindActionCreators(toggleFileDialog, dispatch),
  toggleVideoPlayer: bindActionCreators(toggleVideoPlayer, dispatch),
  updateVideoUrl: bindActionCreators(updateVideoUrl, dispatch),
  updateVideoDuration: bindActionCreators(updateVideoDuration, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(FileDialog);