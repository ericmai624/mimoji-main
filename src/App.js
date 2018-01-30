import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import fontawesome from '@fortawesome/fontawesome';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import solid from '@fortawesome/fontawesome-free-solid';
import regular from '@fortawesome/fontawesome-free-regular';
import brand from '@fortawesome/fontawesome-free-brands';
import { ThemeProvider } from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { toggleFileBrowserDialog } from 'stores/file-browser';
import { toggleFullscreen } from 'stores/app';
import { getIpAddress } from 'stores/ip'; 

import LoadingScreen from 'components/loading-screen/loading-screen';
import FileBrowser from 'containers/file-browser/file-browser';
import VideoPlayer from 'containers/video-player/video-player';

import { Flex, Button } from 'shared/components';

fontawesome.library.add(brand, solid, regular);

const theme = {
  orange: 'rgba(228, 75, 54, 0.9)',
  bgColor: 'rgba(65, 68, 86, 0.8)'
};

const Wrapper = Flex.extend`
  width: 100%;
  height: 100%;
  filter: ${({ isBlur }) => isBlur ? 'blur(15px) brightness(60%)' : 'none'};
  transition: filter 0.4s ease-in-out;
  overflow: hidden;
  position: absolute;
  background-image: url('assets/img/1440627692.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed;
  background-size: cover;
`;

const Start = Button.extend`
  display: ${({ isVisible }) => isVisible ? 'flex' : 'none'};
  color: rgba(228, 228, 228, 0.94);
  background-color: #415b76;
  color: #2c3e50;
  outline: none;
  border: none;
  box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.12);
  cursor: pointer;
  user-select: none;
  z-index: 10;
  transition: all 0.25s ease-in-out;

  &:hover {
    color: #1abc9c;
    box-shadow: 0 0 6px 3px rgba(0, 0, 0, 0.25);
  }
`;

class App extends Component {

  static propTypes = {
    app: PropTypes.object.isRequired,
    isFileBrowserEnabled: PropTypes.bool.isRequired,
    getIpAddress: PropTypes.func.isRequired,
    toggleFileBrowserDialog: PropTypes.func.isRequired,
    toggleFullscreen: PropTypes.func.isRequired
  }

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
    document.addEventListener('fullscreenchange', (e) => toggleFullscreen());
    document.addEventListener('webkitfullscreenchange', (e) => toggleFullscreen());
    document.addEventListener('mozfullscreenchange', (e) => toggleFullscreen());
    document.addEventListener('msfullscreenchange', (e) => toggleFullscreen());
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
    button.style.display = 'none';
    // button.style.zIndex = 10;
    this.wrapper.insertAdjacentElement('beforeend', button);
  }
  
  render() {
    const { app, isFileBrowserEnabled, toggleFileBrowserDialog } = this.props;
    
    return (
      <ThemeProvider theme={theme}>
        <Fragment>
          <Wrapper
            id='wrapper'
            align='center'
            justify='center'
            isBlur={app.isInitializing}
            innerRef={el => this.wrapper = el}
          >
            <Start
              size='60px'
              onClick={toggleFileBrowserDialog}
              isVisible={!app.isPlayerEnabled && !isFileBrowserEnabled}
            >
              <FontAwesomeIcon icon={['fab', 'microsoft']}/>
            </Start>
            <FileBrowser />
            {app.isPlayerEnabled ? (<VideoPlayer isChromecast={app.isChromecast} />) : null}
          </Wrapper>
          <LoadingScreen isInitializing={app.isInitializing}/>
        </Fragment>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = (state) => ({ app: state.app, isFileBrowserEnabled: state.fileBrowser.isVisible });

const mapDispatchToProps = (dispatch) => ({
  getIpAddress: bindActionCreators(getIpAddress, dispatch),
  toggleFileBrowserDialog: bindActionCreators(toggleFileBrowserDialog, dispatch),
  toggleFullscreen: bindActionCreators(toggleFullscreen, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
