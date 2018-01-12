import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { togglePlayer } from 'stores/app';
import { createStream, updateStreamTime, resetStream } from 'stores/stream';
import { toggleFileBrowserDialog } from 'stores/file-browser';
import { resetTextTrack } from 'stores/text-track';

import Loader from 'components/loader/loader-component';
import VideoControls from 'containers/video-player/video-controls/video-controls-component';

import { Container } from './cast-player-styles';

class CastPlayer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isPaused: false,
      isMuted: false,
      isBuffering: false,
      volume: 1,
      currTimeOffset: 0
    };
    
    this.initSession = this.initSession.bind(this);
    this.setEventListeners = this.setEventListeners.bind(this);
    this.removeEventListeners = this.removeEventListeners.bind(this);
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
    this.onConnectionChanged = this.onConnectionChanged.bind(this);
    this.onPausedChanged = this.onPausedChanged.bind(this);
    this.onCurrentTimeChanged = this.onCurrentTimeChanged.bind(this);
    this.onMutedChanged = this.onMutedChanged.bind(this);
    this.onVolumeLevelChanged = this.onVolumeLevelChanged.bind(this);
    this.onPlayerStateChanged = this.onPlayerStateChanged.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    const { stream: prev } = prevProps;
    const { stream: curr } = this.props;

    const isNewStream = curr.id !== prev.id;
    if (isNewStream && !curr.hasError) this.cast();
  }

  componentWillUnmount() {
    console.log('Component is unmounting...');
    const { controller } = this;
    if (controller) this.removeEventListeners(controller);
  }
  
  initSession() {
    console.log('cast session');
    const { cast } = window;
    const castSession = cast.framework.CastContext.getInstance().getCurrentSession();
    if (!castSession) return cast.framework.CastContext.getInstance().requestSession();
    return Promise.resolve();
  }

  setEventListeners(controller) {
    console.log('Registering Event Listeners...');
    const { 
      IS_CONNECTED_CHANGED,
      IS_PAUSED_CHANGED,
      CURRENT_TIME_CHANGED,
      VOLUME_LEVEL_CHANGED,
      IS_MUTED_CHANGED,
      PLAYER_STATE_CHANGED
    } = window.cast.framework.RemotePlayerEventType;

    controller.addEventListener(IS_CONNECTED_CHANGED, this.onConnectionChanged);
    controller.addEventListener(IS_PAUSED_CHANGED, this.onPausedChanged);
    controller.addEventListener(CURRENT_TIME_CHANGED, this.onCurrentTimeChanged);
    controller.addEventListener(VOLUME_LEVEL_CHANGED, this.onVolumeLevelChanged);
    controller.addEventListener(IS_MUTED_CHANGED, this.onMutedChanged);
    controller.addEventListener(PLAYER_STATE_CHANGED, this.onPlayerStateChanged);
    console.log('Registered Event Listeners');
  }

  onConnectionChanged() {
    if (this.player && !this.player.isConnected) {
      console.log('RemotePlayerController: Player disconnected');
      this.cleanup();
    }
  }

  onPausedChanged({ value }) {
    const { isPaused } = this.state;
    if (isPaused !== value) this.setState({ isPaused: value });
  }

  onCurrentTimeChanged({ value }) {
    const { currTimeOffset } = this.state;
    const { updateStreamTime } = this.props;

    if (value) updateStreamTime(currTimeOffset + value);
  }

  onVolumeLevelChanged({ value }) {
    const { volume } = this.state;
    if (volume !== value) this.setState({ volume: value });
  }

  onMutedChanged({ value }) {
    const { isMuted } = this.state;
    if (isMuted !== value) this.setState({ isMuted: value });
  }

  onPlayerStateChanged({ value }) {
    const { IDLE, PLAYING, PAUSED, BUFFERING } = window.chrome.cast.media.PlayerState;
    if (value === PLAYING) {
      this.updateTime();
      this.setState({ isPaused: false, isBuffering: false });
    } else if (value === PAUSED) {
      this.stopTimer();
      this.setState({ isPaused: true, isBuffering: false });
    } else if (value === BUFFERING) {
      this.stopTimer();
      this.setState({ isBuffering: true });
    } else if (value === IDLE) {
      console.log(value);
    }
  }

  removeEventListeners(controller) {
    console.log('Unregistering Event Listeners...');
    const { 
      IS_CONNECTED_CHANGED,
      IS_PAUSED_CHANGED,
      CURRENT_TIME_CHANGED,
      VOLUME_LEVEL_CHANGED,
      IS_MUTED_CHANGED,
      PLAYER_STATE_CHANGED
    } = window.cast.framework.RemotePlayerEventType;

    controller.removeEventListener(IS_CONNECTED_CHANGED, this.onConnectionChanged);
    controller.removeEventListener(IS_PAUSED_CHANGED, this.onPausedChanged);
    controller.removeEventListener(CURRENT_TIME_CHANGED, this.onCurrentTimeChanged);
    controller.removeEventListener(VOLUME_LEVEL_CHANGED, this.onVolumeLevelChanged);
    controller.removeEventListener(IS_MUTED_CHANGED, this.onMutedChanged);
    controller.removeEventListener(PLAYER_STATE_CHANGED, this.onPlayerStateChanged);
    console.log('Unregistered Event Listeners');
  }

  cast() {
    console.log('Initiating Google Cast...');
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
        this.setState({ isLoading: false });
        this.player = new cast.framework.RemotePlayer();
        this.controller = new cast.framework.RemotePlayerController(this.player);
        this.setEventListeners(this.controller);
      }, (err) => console.log('Error code: ', err));
  }

  setTextTrack() {
    const { chrome } = window;
    const { ip, textTrack } = this.props;
    const { currTimeOffset } = this.state;

    const sub = new chrome.cast.media.Track(1 /* track id */, chrome.cast.media.TrackType.TEXT);
    const host = `http://${ip.address}:6300`;
    const pathname = `/api/stream/subtitle/${textTrack.id}`;
    const query = `offset=${textTrack.offset - currTimeOffset}&encoding=${textTrack.encoding}`;
    sub.trackContentId = `${host}${pathname}?${query}`;
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
    console.log('Seeking ', time);
    const { stream, createStream, updateStreamTime } = this.props;
    const { player, controller } = this;
    const callback = createStream.bind(null, stream.video, time);
    
    this.stopTimer();
    if (controller) {
      this.removeEventListeners(controller);
      controller.stop();
    }
    if (player) player.playerState = window.chrome.cast.media.PlayerState.IDLE;

    updateStreamTime(time);
    this.setState({ isLoading: true, currTimeOffset: time }, callback);
  }

  updateTime(prev = Date.now() - 1000) {
    const { PLAYING: playing } = window.chrome.cast.media.PlayerState;
    const { stream, updateStreamTime } = this.props;
    const { playerState } = this.player;
    const isPlaying = playerState === playing;
   
    updateStreamTime(stream.currentTime + 1);
    if (isPlaying) this.timer = setTimeout(_.partial(this.updateTime, Date.now()), 2000 - (Date.now() - prev));
  }

  stopTimer() {
    console.log('Stopping timer...');
    if (this.timer) {
      clearTimeout(this.timer);
      console.log(`Timer ${this.timer} has stopped`);
      this.timer = null;
    }
  }

  playOrPause() {
    const { isPaused } = this.player;
    const callback = this.controller.playOrPause.bind(this.controller);
    this.setState({ isPaused: !isPaused }, callback);
  }

  muteOrUnmute() {
    const { isMuted } = this.player;
    const callback = this.controller.muteOrUnmute.bind(this.controller);
    this.setState({ isMuted: !isMuted }, callback);
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
    this.cleanup();
  }

  cleanup() {
    console.log('Cleaning up Cast Player...');
    const { app, stream, togglePlayer, resetStream, resetTextTrack } = this.props;
    if (stream.id === '') return;
    this.stopTimer(); // stop the currentTime timer

    const method = 'post';
    const headers = new Headers();
    const body = JSON.stringify({ id: stream.id });
    headers.append('Content-Type', 'application/json');

    fetch('/api/stream/terminate', { method, headers, body });

    resetStream();
    resetTextTrack();
    if (app.isPlayerEnabled) {
      console.log('toggling player');
      togglePlayer();
    }
    console.log('Cleaned Cast Player');
  }

  render() {
    const { isLoading, isPaused, isMuted, volume } = this.state;
    const { stream, toggleFileBrowserDialog } = this.props;
    return (
      <Container className='flex flex-center absolute'>
        {isLoading ? <Loader size={42} /> : null}
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

const mapStateToProps = state => ({ ip: state.ip, app: state.app, stream: state.stream, textTrack: state.textTrack });

const mapDispatchToProps = (dispatch) => ({ 
  createStream: bindActionCreators(createStream, dispatch),
  togglePlayer: bindActionCreators(togglePlayer, dispatch),
  toggleFileBrowserDialog: bindActionCreators(toggleFileBrowserDialog, dispatch),
  updateStreamTime: bindActionCreators(updateStreamTime, dispatch),
  resetStream: bindActionCreators(resetStream, dispatch),
  resetTextTrack: bindActionCreators(resetTextTrack, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CastPlayer);