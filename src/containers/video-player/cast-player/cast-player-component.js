import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { togglePlayer } from 'stores/app';
import { createStream, updateStreamTime, resetStream } from 'stores/stream';
import { toggleFileBrowserDialog } from 'stores/file-browser';
import { resetTextTrack } from 'stores/text-track';

import VideoControls from '../video-controls/video-controls-component';

import { Container } from './cast-player-styles';

class CastPlayer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPaused: false,
      isMuted: false,
      isBuffering: false,
      volume: 1,
      currTimeOffset: 0
    };
    
    this.initSession = this.initSession.bind(this);
    this.initPlayer = this.initPlayer.bind(this);
    this.cast = this.cast.bind(this);
    this.seek = this.seek.bind(this);
    this.updateTime = this.updateTime.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.setTextTrack = this.setTextTrack.bind(this);
    this.updateTextTrack = this.updateTextTrack.bind(this);
    this.muteOrUnmute = this.muteOrUnmute.bind(this);
    this.playOrPause = this.playOrPause.bind(this);
    this.setVolume = this.setVolume.bind(this);
    this.stop = this.stop.bind(this);
    this.cleanup = this.cleanup.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    const textTrackEnabled = !prevProps.textTrack.isEnabled && this.props.textTrack.isEnabled;
    const textTrackChanged = (prevProps.textTrack.id !== this.props.textTrack.id) ||
                             (prevProps.textTrack.offset !== this.props.textTrack.offset) ||
                             (prevProps.textTrack.encoding !== this.props.textTrack.encoding);
    if (textTrackEnabled || textTrackChanged) this.updateTextTrack();
  }
  
  componentWillUnmount() {
    this.stopTimer();
  }

  componentDidMount() {
    const { stream } = this.props;
    if (stream.id !== '' && !stream.hasError) this.cast();
  }
  
  initSession() {
    console.log('cast session');
    const { cast } = window;
    const castSession = cast.framework.CastContext.getInstance().getCurrentSession();
    if (!castSession) return cast.framework.CastContext.getInstance().requestSession();
    return Promise.resolve();
  }

  initPlayer() {
    const { cast, chrome } = window;
    const { 
      IS_CONNECTED_CHANGED,
      IS_PAUSED_CHANGED,
      VOLUME_LEVEL_CHANGED,
      IS_MUTED_CHANGED,
      PLAYER_STATE_CHANGED
    } = cast.framework.RemotePlayerEventType;
    const { stream, updateStreamTime } = this.props;
    const { isPaused, isMuted, currTimeOffset, volume } = this.state;

    this.player = new cast.framework.RemotePlayer();
    this.controller = new cast.framework.RemotePlayerController(this.player);

    const { player, controller } = this;

    controller.addEventListener(IS_CONNECTED_CHANGED, () => {
      if (!player.isConnected) {
        console.log('RemotePlayerController: Player disconnected');
        this.cleanup();
      }
    });

    controller.addEventListener(IS_PAUSED_CHANGED, () => {
      if (isPaused !== player.isPaused) {
        this.setState({ isPaused: player.isPaused });
      }
    });

    controller.addEventListener(VOLUME_LEVEL_CHANGED, () => {
      if (volume !== player.volumelevel) {
        this.setState({ volume: player.volumeLevel });
      }
    });

    controller.addEventListener(IS_MUTED_CHANGED, () => {
      if (isMuted !== player.isMuted) {
        this.setState({ isMuted: player.isMuted });
      }
    });

    controller.addEventListener(PLAYER_STATE_CHANGED, () => {
      const { playerState } = player;

      if (playerState === chrome.cast.media.PlayerState.PLAYING) {
        this.updateTime();
        this.setState({ isBuffering: false });
      }
      if (playerState === chrome.cast.media.PlayerState.PAUSED) {
        this.stopTimer();
        this.setState({ isBuffering: false });
      }
      if (playerState === chrome.cast.media.PlayerState.BUFFERING) {
        this.stopTimer();
        this.setState({ isBuffering: true });
      }
      console.log(player);
    });
  }

  cast() {
    const { cast, chrome } = window;
    const { ip, stream, textTrack } = this.props;

    if (!this.castSession) this.castSession = cast.framework.CastContext.getInstance().getCurrentSession();

    const mediaSource = `http://${ip.address}:6300/api/stream/video/${stream.id}/playlist.m3u8`;
    const mediaInfo = new chrome.cast.media.MediaInfo(mediaSource);
    mediaInfo.contentType = 'application/vnd.apple.mpegurl';
    mediaInfo.streamType = chrome.cast.media.StreamType.LIVE;
    // style text track
    mediaInfo.textTrackStyle = new chrome.cast.media.TextTrackStyle();
    mediaInfo.textTrackStyle.backgroundColor = '#00000000';
    mediaInfo.textTrackStyle.fontFamily = '\'Roboto\', sans-serif';
    mediaInfo.textTrackStyle.fontScale = 1.2;

    const request = new chrome.cast.media.LoadRequest(mediaInfo);

    if (textTrack.isEnabled) {
      mediaInfo.tracks = [this.setTextTrack()];
      request.activeTrackIds = [1];
    }
    // start streaming
    this.castSession.loadMedia(request)
      .then(() => {
        console.log('load success');
        this.initPlayer();
      }, (err) => console.log('Error code: ', err))
      .catch(err => console.log(err));
  }

  setTextTrack() {
    let { chrome } = window;
    let { ip, textTrack } = this.props;

    let sub = new chrome.cast.media.Track(1 /* track id */, chrome.cast.media.TrackType.TEXT);
    sub.trackContentId = `http://${ip.address}:6300/api/stream/subtitle/${textTrack.id}?offset=${textTrack.offset}`;
    sub.trackContentType = 'text/vtt';
    sub.subType = chrome.cast.media.TextTrackType.SUBTITLES;
    sub.name = textTrack.label;
    sub.language = 'zh';

    return sub;
  }

  updateTextTrack() {
    const { chrome } = window;
    const tracksInfoRequest = new chrome.cast.media.EditTracksInfoRequest([1]);
    console.log(tracksInfoRequest);
  }

  seek(time) {
    const { stream, createStream, updateStreamTime } = this.props;
    this.controller.stop();

    this.setState({ currTimeOffset: time }, () => {
      updateStreamTime(time);
      createStream(stream.video, time)
        .then(() => {
          if (!stream.hasError) this.cast();
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  updateTime(prev = Date.now() - 1000) {
    const { chrome } = window;
    const { currTimeOffset } = this.state;
    const { stream, updateStreamTime } = this.props;
    const { playerState } = this.player;
    const isPlaying = playerState === chrome.cast.media.PlayerState.PLAYING;
   
    updateStreamTime(stream.currentTime + 1);
    if (isPlaying) this.timer = setTimeout(_.partial(this.updateTime, Date.now()), 2000 - (Date.now() - prev));
  }

  stopTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  playOrPause() {
    const { isPaused } = this.player;
    this.setState({ isPaused: !isPaused }, () => {
      this.controller.playOrPause();
    });
  }

  muteOrUnmute() {
    const { isMuted } = this.player;
    this.setState({ isMuted: !isMuted }, () => {
      this.controller.muteOrUnmute();
    });
  }

  setVolume(e) {
    const volume = parseFloat(e.target.value);
    this.setState({ volume }, () => {
      this.player.volumeLevel = volume;
      this.controller.setVolumeLevel();
    });
  }

  stop() {
    console.log('video has stopped');
    if (this.controller) this.controller.stop();
    this.stopTimer();
    this.cleanup();
  }

  cleanup() {
    console.log('cleaning up Cast Player');
    const { stream, togglePlayer, resetStream, resetTextTrack } = this.props;

    const method = 'post';
    const headers = new Headers();
    const body = JSON.stringify({ id: stream.id });
    headers.append('Content-Type', 'application/json');

    fetch('/api/stream/terminate', { method, headers, body });

    resetStream();
    resetTextTrack();
    togglePlayer();
  }

  render() {
    const { isPaused, isMuted, volume } = this.state;
    const { stream, toggleFileBrowserDialog } = this.props;
    return (
      <Container className='flex flex-center absolute'>
        <VideoControls 
          seek={this.seek}
          toggleFileBrowserDialog={toggleFileBrowserDialog}
          playOrPause={this.playOrPause}
          muteOrUnmute={this.muteOrUnmute}
          setVolume={this.setVolume}
          stop={this.stop}
          isControlsVisible={true}
          isPaused={isPaused}
          isMuted={isMuted}
          volume={volume}
          currentTime={stream.currentTime}
          duration={stream.duration}
        />
      </Container>
    );
  }
}

const mapStateToProps = state => ({ ip: state.ip, cast: state.cast, stream: state.stream, textTrack: state.textTrack });

const mapDispatchToProps = (dispatch) => ({ 
  createStream: bindActionCreators(createStream, dispatch),
  togglePlayer: bindActionCreators(togglePlayer, dispatch),
  toggleFileBrowserDialog: bindActionCreators(toggleFileBrowserDialog, dispatch),
  updateStreamTime: bindActionCreators(updateStreamTime, dispatch),
  resetStream: bindActionCreators(resetStream, dispatch),
  resetTextTrack: bindActionCreators(resetTextTrack, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CastPlayer);