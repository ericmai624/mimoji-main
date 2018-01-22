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

import LoadingScreen from 'components/loading-screen/loading-screen';
import FileBrowser from 'containers/file-browser/file-browser';
import VideoPlayer from 'containers/video-player/video-player';

fontawesome.library.add(solid, regular);

const Wrapper = styled.div`
  filter: ${({ isBlur }) => isBlur ? 'blur(15px) brightness(60%)' : 'none'};
  transition: filter 0.4s ease-in-out;
  overflow: hidden;
`;

const Label = styled.label`
  display: ${({ isVisible }) => isVisible ? 'block' : 'none'};
  font-size: 24px;
  color: rgba(228, 228, 228, 1);
  background-color: rgba(23, 69, 124, 0.75);
  outline: none;
  border: none;
  border-radius: 5px;
  box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.12);
  padding: 0.6em 0.8em;
  margin: 0;
  transition: all 0.25s ease-in-out;

  &:hover {
    box-shadow: 0 0 6px 3px rgba(0, 0, 0, 0.25);
    background-color: rgba(23, 69, 124, 0.85);
  }
`;

class App extends Component {

  constructor(props) {
    super(props);
    /* Init Websockets before content is rendered */
    window.io = io('http://localhost:6300', { transports: ['websocket'] });
    /* Define init fn before the framework script is loaded */
    window['__onGCastApiAvailable'] = this.initializeCastApi;
  }

  componentWillMount() {
    this.insertCastScript();
  }
  
  componentDidMount() {
    const { getIpAddress, toggleFullscreen } = this.props;
    
    getIpAddress(); // Get ip address for Chromecast stream

    this.createCastButton(); // Create the Google Cast button after script is loaded
    
    // Event listener for fullscreen change
    document.addEventListener('fullscreenchange', (e) => toggleFullscreen('fullscreen'));
    document.addEventListener('webkitfullscreenchange', (e) => toggleFullscreen('fullscreen'));
    document.addEventListener('mozfullscreenchange', (e) => toggleFullscreen('fullscreen'));
    document.addEventListener('msfullscreenchange', (e) => toggleFullscreen('fullscreen'));
  }

  initializeCastApi(isAvailable) {
    if (isAvailable) {
      window.cast.framework.CastContext.getInstance().setOptions({
        // receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
        // receiverApplicationId: '7DDC0933'
        receiverApplicationId: 'CD03835D'
      });
    }
  }

  insertCastScript() {
    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1';
    script.type = 'text/javascript';
    script.async = true;
    document.getElementById('app').insertAdjacentElement('afterend', script);
  }

  createCastButton() {
    const button = document.createElement('button', 'google-cast-button');
    button.style.border = 'none';
    button.style.outline = 'none';
    button.style.cursor = 'pointer';
    button.style.width = '40px';
    button.style.height = '40px';
    button.style.position = 'absolute';
    button.style.top = '20px';
    button.style.right = '20px';
    button.style.background = 'transparent';
    button.style.zIndex = 10;
    this.wrapper.insertAdjacentElement('beforeend', button);
  }
  
  render() {
    const { app, toggleFileBrowserDialog } = this.props;
    
    return (
      <Fragment>
        <Wrapper
          id='wrapper'
          className='flex flex-center absolute full-size bg'
          isBlur={app.isInitializing}
          innerRef={el => this.wrapper = el}
        >
          {app.isPlayerEnabled ?
            (<VideoPlayer isChromecast={app.isChromecast} />) : null}
          <Label
            className='pointer no-select'
            onClick={toggleFileBrowserDialog}
            isVisible={!app.isPlayerEnabled}
          >
            Choose a Video
          </Label>
          <FileBrowser />
        </Wrapper>
        <LoadingScreen isInitializing={app.isInitializing}/>
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
