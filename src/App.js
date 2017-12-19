import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { updateCastPlayer, updateCastController } from './actions/cast';

import Cast from './components/cast';
import FileDialog from './containers/file-dialog/file-dialog-component';
import VideoPlayer from './containers/video-player/video-player-component';

class App extends Component {
  componentDidMount() {
    window['__onGCastApiAvailable'] = (isAvailable) => {
      if (isAvailable) {
        this.initializeCastApi();
      }
    };
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
        <FileDialog/>
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
