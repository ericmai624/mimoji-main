import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { updateCastPlayer, updateCastController } from './actions/cast';

import Cast from './components/cast';
import ChooseVideo from './containers/choose-video';
import FileDialog from './containers/file-dialog';

const Root = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 50px calc(100vh - 50px);
`;

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
      receiverApplicationId:
        chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
    }); 

    const player = new cast.framework.RemotePlayer();
    const controller = new cast.framework.RemotePlayerController(player);
    updateCastPlayer(player);
    updateCastController(controller);
  }
  
  render() {
    return (
      <Root>
        <Cast/>
        <ChooseVideo/>
        <FileDialog/>
      </Root>
    );
  }
}

const mapStateToProps = (state) => ({ cast: state.cast });

const mapDispatchToProps = (dispath) => ({ 
  updateCastPlayer: bindActionCreators(updateCastPlayer, dispath),
  updateCastController: bindActionCreators(updateCastController, dispath)
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
