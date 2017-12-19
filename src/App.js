import React, { Component, Fragment } from 'react';
import fontawesome from '@fortawesome/fontawesome';
import solid from '@fortawesome/fontawesome-free-solid';
import regular from '@fortawesome/fontawesome-free-regular';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { updateCastPlayer, updateCastController } from './actions/cast';

import Cast from './components/cast';
import FileBrowser from './containers/file-browser/file-browser-component';
import VideoPlayer from './containers/video-player/video-player-component';

fontawesome.library.add(solid, regular);

class App extends Component {
  constructor(props) {
    super(props);
    
    this.loadGoogleCastFramework = this.loadGoogleCastFramework.bind(this);
    this.initializeCastApi = this.initializeCastApi.bind(this);
  }
  
  componentDidMount() {
    window['__onGCastApiAvailable'] = (isAvailable) => {
      if (isAvailable) {
        this.initializeCastApi();
      }
    };
    this.loadGoogleCastFramework();
  }

  loadGoogleCastFramework() {
    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1';
    document.querySelector('#root').appendChild(script);
  }

  initializeCastApi() {
    const { cast, chrome } = window;
    const { updateCastPlayer, updateCastController } = this.props;

    cast.framework.CastContext.getInstance().setOptions({
      receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
    }); 

    const player = new cast.framework.RemotePlayer();
    const controller = new cast.framework.RemotePlayerController(player);
    updateCastPlayer(player);
    updateCastController(controller);
  }
  
  render() {
    const { player } = this.props;
    
    return (
      <Fragment>
        <Cast/>
       {player.showPlayer ? (<VideoPlayer />) : null}
        <FileBrowser/>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({ cast: state.cast, player: state.player });

const mapDispatchToProps = (dispath) => ({ 
  updateCastPlayer: bindActionCreators(updateCastPlayer, dispath),
  updateCastController: bindActionCreators(updateCastController, dispath)
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
