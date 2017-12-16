import React, { Component } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import FileList from '../components/file-list';

import { toggleFileDialog, fetchDirList } from '../actions/file-dialog';
import { updateVideoSrc } from '../actions/video';

const Wrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100vh;
  left: 0;
  top: 0;
  align-items: center;
  justify-content: center;
  background: rgba(49, 49, 49, 0.9);
`;

const Dialog = styled.div`
  display: grid;
  grid-template-columns: 2fr 4fr;
  width: 850px;
  height: 80%;
  max-height: 600px;
  background: rgb(255, 255, 255);
`;

const DialogSidebar = styled.div`
  grid-column: 1;
  background: lightcoral;
`;

const Main = styled.div`
  grid-column: 2;
  padding: 1.8em;
  overflow: auto;
`;

const Close = styled.div`
  display: inline-block;
  width: 40px;
  height: 40px;
  cursor: pointer;
`;

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

    axios.post('/api/cast/update', { filePath: file })
      .then((response) => {
        console.log(response);
        const { hash, contentType } = response.data;
        updateVideoSrc(`http://172.16.1.13:2222/api/cast/video/${hash}`, contentType);
        // const { cast, chrome } = window;
    
        // const castSession = cast.framework.CastContext.getInstance().getCurrentSession();
        // const mediaInfo = new chrome.cast.media.MediaInfo('http://172.16.1.13:2222/api/cast/video.mp4', 'video/mp4');
        // // mediaInfo.streamType = chrome.cast.media.StreamType.BUFFERED;
        // const request = new chrome.cast.media.LoadRequest(mediaInfo);
    
        // if (castSession) {
        //   castSession.loadMedia(request)
        //     .then(() => console.log('load'), (errorCode) => console.log('Error Code: ', errorCode));
        // }
      });

    toggleFileDialog()
  }

  render() {
    const { dir, showFileDialog, toggleFileDialog, fetchDirList } = this.props;

    return (
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