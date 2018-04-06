import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import fontawesome from '@fortawesome/fontawesome';
import solid from '@fortawesome/fontawesome-free-solid';
import regular from '@fortawesome/fontawesome-free-regular';
import { ThemeProvider } from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { toggleFileBrowserDialog } from 'src/stores/file-browser';
import { toggleFullscreen } from 'src/stores/app';
import { getIpAddress } from 'src/stores/ip'; 

import LoadingScreen from 'src/components/loading-screen/loading-screen';
import FileBrowser from 'src/containers/file-browser/file-browser';
import VideoPlayer from 'src/containers/video-player/video-player';

import { Flex, Button } from 'src/shared/components';

const theme = {
  'carrot': '#e67e22',
  'pumpkin': '#d35400',
  'wet_asphalt': '#34495e',
  'midnight_blue': '#2c3e50',
  'turquoise': '#1abc9c',
  'green_sea': '#16a085',
  'clouds': '#ecf0f1',
  'silver': '#bdc3c7',
  'peter_river': '#3498db',
  'belize_hole': '#2980b9',
  'sun_flower': '#f1c40f',
  'orange': '#f39c12',
  'alizarin': '#e74c3c',
  'pomegranate': '#c0392b'
};

const Logo = Button.extend`
  display: ${({ isVisible }) => isVisible ? 'flex' : 'none'};
  font-family: 'Megrim', cursive;
  font-weight: bold;
  color: #fff;
  text-align: center;
  vertical-align: middle;
  line-height: 60px;
  user-select: none;
  box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.1), -1px 1px 3px 1px rgba(0, 0, 0, 0.1);
  background-color: #415b76;
  z-index: 10; /* higher than file browser 5 */
  transition: all 0.25s ease-in-out;

  &:hover {
    color: ${({ theme }) => theme['turquoise']};
    box-shadow: 1px 1px 6px 2px rgba(0, 0, 0, 0.15), -1px 1px 6px 2px rgba(0, 0, 0, 0.15);
  }
`;

const Wrapper = Flex.extend`
  width: 100%;
  height: 100%;
  filter: ${({ isBlur }) => isBlur ? 'blur(15px) brightness(60%)' : 'none'};
  transition: filter 0.5s ease-in-out;
  overflow: hidden;
  position: absolute;
  background-image: url('/img/1440627692.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed;
  background-size: cover;
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
    fontawesome.library.add(solid, regular);
  }
  
  componentDidMount() {
    const { getIpAddress, toggleFullscreen } = this.props;
    
    this.createCastButton(); // Create the Google Cast button after script is loaded
    getIpAddress(); // Get ip address for Chromecast stream
    
    // Event listener for fullscreen change
    const fullscreenEvents = ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'msfullscreenchange'];
    fullscreenEvents.forEach(event => document.addEventListener(event, e => toggleFullscreen()));
  }

  initializeCastApi = (isAvailable) => {
    if (isAvailable) {
      window.cast.framework.CastContext.getInstance().setOptions({
        // receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
        // receiverApplicationId: '7DDC0933'
        receiverApplicationId: 'CD03835D'
      });
    }
  }

  insertCastScript = () => {
    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1';
    script.type = 'text/javascript';
    script.async = true;
    document.getElementById('app').insertAdjacentElement('afterend', script);
  }

  createCastButton = () => {
    const button = document.createElement('button', 'google-cast-button');
    button.style.display = 'none';
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
            <Logo size='60px'
              onClick={toggleFileBrowserDialog}
              isVisible={!app.isPlayerEnabled && !app.isInitializing && !isFileBrowserEnabled}
            >
              m
            </Logo>
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
