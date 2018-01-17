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
  background: url('/assets/background/209285.jpg') no-repeat center center fixed;
  background-size: cover;
  overflow: hidden;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
`;

const Label = styled.label`
  font-size: 24px;
  color: rgba(228, 228, 228, 1);
  background-color: rgba(23, 69, 124, 0.9);
  outline: none;
  border: none;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  padding: 0.6em 0.8em;
  margin: 0;
`;

class App extends Component {
  componentWillMount() {
    window.io = io('http://localhost:6300', { transports: ['websocket'] });
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
        <Wrapper id='wrapper' className={`flex flex-center absolute${app.isInitializing ? ' blur' : ''}`}>
          {app.isPlayerEnabled ?
            (<VideoPlayer isChromecast={app.isChromecast} />) : 
            (<Label className='pointer no-select' onClick={toggleFileBrowserDialog}>Choose a Video</Label>)}
          <FileBrowser />
        </Wrapper>
        <Loading isInitializing={app.isInitializing}/>
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
