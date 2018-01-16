import React, { Component, Fragment } from 'react';
import io from 'socket.io-client';
import fontawesome from '@fortawesome/fontawesome';
import solid from '@fortawesome/fontawesome-free-solid';
import regular from '@fortawesome/fontawesome-free-regular';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { toggleFileBrowserDialog } from 'stores/file-browser';
import { toggleFullscreen } from 'stores/app';
import { getIpAddress } from 'stores/ip'; 

import FileBrowser from 'containers/file-browser/file-browser-component';
import VideoPlayer from 'containers/video-player/video-player-component';
import Loading from 'components/loading-screen/loading-screen-component';

fontawesome.library.add(solid, regular);

const Wrapper = styled.div`
  transition: filter 0.4s ease-in-out;
  background-image: url('/assets/background/466681.jpg');
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
`;

const LabelWrapper = styled.div`
  height: 100%;
  font-size: 2em;
`;

const Label = styled.label`
  user-select: none;
  color: rgba(228, 228, 228, 1);
  background-color: rgba(23, 69, 124, 0.9);
  outline: none;
  border: none;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  padding: 0.6em 0.8em;
  margin: 0;
  cursor: pointer;
  line-height: 1.15;
`;

class App extends Component {
  componentWillMount() {
    window.io = io('http://localhost:6300');
  }
  
  componentDidMount() {
    const { getIpAddress, toggleFullscreen } = this.props;
    
    getIpAddress();
    
    // Event listener for fullscreen change
    document.addEventListener('fullscreenchange', (e) => toggleFullscreen('fullscreen'));
    document.addEventListener('webkitfullscreenchange', (e) => toggleFullscreen('fullscreen'));
    document.addEventListener('mozfullscreenchange', (e) => toggleFullscreen('fullscreen'));
    document.addEventListener('msfullscreenchange', (e) => toggleFullscreen('fullscreen'));
  }
  
  render() {
    const { app, toggleFileBrowserDialog } = this.props;
    
    return (
      <Fragment>
        <Loading isInitializing={app.isInitializing}/>
        <Wrapper id='wrapper' className={`fixed${app.isInitializing ? ' blur' : ''}`}>
          {app.isPlayerEnabled ? 
            (<VideoPlayer isChromecast={app.isChromecast} />) : 
            (<LabelWrapper className='flex flex-center'>
              <Label onClick={toggleFileBrowserDialog}>Choose a Video</Label>
            </LabelWrapper>)}
          <FileBrowser />
        </Wrapper>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({ app: state.app });

const mapDispatchToProps = (dispatch) => ({
  getIpAddress: bindActionCreators(getIpAddress, dispatch),
  toggleFileBrowserDialog: bindActionCreators(toggleFileBrowserDialog, dispatch),
  toggleFullscreen: bindActionCreators(toggleFullscreen, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
