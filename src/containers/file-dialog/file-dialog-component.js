import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import FileList from '../../components/file-list/file-list-component';

import { toggleFileDialog, fetchDirList } from '../../actions/file-dialog';
import { updateVideoSrc } from '../../actions/video';

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

  castSelectedFile(e, file) {
    e.preventDefault();

    const { toggleFileDialog, updateVideoSrc } = this.props;

    toggleFileDialog();
    
    axios.get(`http://172.16.1.13:2222/api/cast/metadata?video=${file}`)
    .then((response) => {
        updateVideoSrc(`http://172.16.1.13:2222/api/cast/stream?video=${file}#t=0,${response.data.format.duration}`);
      });
    /*
    const { cast, chrome } = window;

    const castSession = cast.framework.CastContext.getInstance().getCurrentSession();
    const mediaInfo = new chrome.cast.media.MediaInfo(`http://172.16.1.13:2222/api/cast/stream?video=${file}`, 'video/mp4');
    mediaInfo.duration = null;
    const request = new chrome.cast.media.LoadRequest(mediaInfo);

    if (castSession) {
      castSession.loadMedia(request)
        .then(() => console.log('load'), (errorCode) => console.log('Error Code: ', errorCode));
    }
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
                <i className='fa fa-times fa-lg' aria-hidden='true'></i>
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
  toggleFileDialog: bindActionCreators(toggleFileDialog, dispatch),
  fetchDirList: bindActionCreators(fetchDirList, dispatch),
  updateVideoSrc: bindActionCreators(updateVideoSrc, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(FileDialog);