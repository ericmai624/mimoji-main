import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { togglePlayer } from 'stores/app';
import { updateStreamInfo, updateStreamTime, rejectStream, resetStream } from 'stores/stream';
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
      isSeeking: false,
      volume: 1,
      currTimeOffset: 0
    };
    
    this.initSession = this.initSession.bind(this);
    this.initPlayer = this.initPlayer.bind(this);
    this.setEventListeners = this.setEventListeners.bind(this);
    this.removeEventListeners = this.removeEventListeners.bind(this);
    this.cast = this.cast.bind(this);
    this.seek = this.seek.bind(this);
    this.updateTime = this.updateTime.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.setTextTrack = this.setTextTrack.bind(this);
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

  componentDidMount() {
    const { io } = window;
    const { rejectStream } = this.props;
    io.on('playlist ready', this.cast);
    io.on('stream rejected', rejectStream);
  }

  componentWillUnmount() {
    console.log('Component is unmounting...');
    const { io } = window;
    const { controller } = this;
    const { rejectStream } = this.props;

    if (controller) this.removeEventListeners(controller);
    io.off('playlist ready', this.cast);
    io.off('stream rejected', rejectStream);
  }
  
  initSession() {
    console.log('cast session');
    const { cast } = window;
    const castSession = cast.framework.CastContext.getInstance().getCurrentSession();
    if (!castSession) return cast.framework.CastContext.getInstance().requestSession();
    return Promise.resolve();
  }

  initPlayer() {
    const { cast } = window;
    if (this.controller) {
      this.removeEventListeners(this.controller);
      this.player = null;
      this.controller = null;
    }
    this.player = new cast.framework.RemotePlayer();
    this.controller = new cast.framework.RemotePlayerController(this.player);
    this.setEventListeners(this.controller);
  }

  setEventListeners(controller) {
    console.log('Registering Event Listeners');
    const start = Date.now();
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
    console.log(`Registered Event Listeners, took %c${Date.now() - start}ms`, 'color: #d80a52;');
  }

  removeEventListeners(controller) {
    if (!controller) return;
    console.log('Unregistering Event Listeners');
    const start = Date.now();
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
    console.log(`Unregistered Event Listeners, took %c${Date.now() - start}ms`, 'color: #d80a52;');
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
    const { PLAYING, PAUSED, BUFFERING } = window.chrome.cast.media.PlayerState;
    console.log(`%cPlayer state has changed to ${value}`, 'background:#e0821d; color:white;');

    if (value === PLAYING) {
      this.updateTime();
      this.setState({ isPaused: false, isBuffering: false });
    } else if (value === PAUSED) {
      this.stopTimer();
      this.setState({ isPaused: true, isBuffering: false });
    } else if (value === BUFFERING) {
      this.stopTimer();
      this.setState({ isBuffering: true });
    }
  }

  cast() {
    console.log('%cCasting video to Google Cast...', 'color:#1b5dc6');
    const start = Date.now();
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
        console.log(`%cCast process complete, took %c${Date.now() - start}ms`, 'color:#1b5dc6;', 'color:#d80a52;');
        this.setState({ isLoading: false });
        this.initPlayer();
        console.log('Can seek: ', this.player.canSeek);
        console.log(`%cPlaying stream id ${stream.id} @ %c${this.state.currTimeOffset}s`, 'color:#1b5dc6;', 'color:#d80a52;');
      }, (err) => console.log('Error code: ', err));
  }

  seek(time) {
    console.log(`%cSeeking ${time}`, 'background:#1b5dc6; color:white;');
    const { io } = window;
    const { stream, updateStreamTime, updateStreamInfo } = this.props;
    
    this.stopTimer(); // Stop show time timer

    if (this.seekTimer) {
      clearTimeout(this.seekTimer);
      this.seekTimer = null;
    }

    updateStreamTime(time);
    this.setState({ isLoading: true, isSeeking: true, currTimeOffset: time }, () => {
      if (this.controller) {
        this.controller.stop();
        this.seekTimer = setTimeout(() => {
          io.emit('new stream', { video: stream.video, seek: time });
          io.once('stream created', updateStreamInfo);
        }, 1000);
      }
    });
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

  updateTime(prev = Date.now() - 1000) {
    if (!this.player) return;
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
    const { io } = window;
    const { app, stream, togglePlayer, resetStream, resetTextTrack } = this.props;
    if (stream.id === '') return;
    this.stopTimer(); // stop the currentTime timer

    io.emit('close stream', { id: stream.id });

    resetStream();
    resetTextTrack();
    if (app.isPlayerEnabled) togglePlayer();
    console.log('Cleaned Cast Player');
  }

  render() {
    const { isLoading, isPaused, isMuted, volume } = this.state;
    const { stream, toggleFileBrowserDialog } = this.props;

    if (stream.hasError) {
      return (
        <Container className='flex flex-center absolute'>
          <span style={{color: 'white'}}>Something went wrong...</span>
        </Container>
      );
    }

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
  updateStreamInfo: bindActionCreators(updateStreamInfo, dispatch),
  togglePlayer: bindActionCreators(togglePlayer, dispatch),
  toggleFileBrowserDialog: bindActionCreators(toggleFileBrowserDialog, dispatch),
  updateStreamTime: bindActionCreators(updateStreamTime, dispatch),
  rejectStream: bindActionCreators(rejectStream, dispatch),
  resetStream: bindActionCreators(resetStream, dispatch),
  resetTextTrack: bindActionCreators(resetTextTrack, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CastPlayer);