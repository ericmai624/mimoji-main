import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { toggleLoading, togglePlayer } from 'stores/app';
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
      isSeeking: false,
      isPaused: false,
      isMuted: false,
      volume: 1,
      currTimeOffset: 0
    };
    
    this.initSession = this.initSession.bind(this);
    this.initPlayer = this.initPlayer.bind(this);
    this.setEventListeners = this.setEventListeners.bind(this);
    this.removeEventListeners = this.removeEventListeners.bind(this);
    this.setMessageListeners = this.setMessageListeners.bind(this);
    this.cast = this.cast.bind(this);
    this.switch = this.switch.bind(this);
    this.seek = this.seek.bind(this);
    this.updateTime = this.updateTime.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.setTextTrack = this.setTextTrack.bind(this);
    this.updateTextTrack = this.updateTextTrack.bind(this);
    this.muteOrUnmute = this.muteOrUnmute.bind(this);
    this.playOrPause = this.playOrPause.bind(this);
    this.setVolume = this.setVolume.bind(this);
    this.stopMediaSession = this.stopMediaSession.bind(this);
    this.stop = this.stop.bind(this);
    this.cleanup = this.cleanup.bind(this);
    this.onConnectionChanged = this.onConnectionChanged.bind(this);
    this.onPausedChanged = this.onPausedChanged.bind(this);
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

  componentDidUpdate(prevProps, prevState) {
    const { textTrack: prev } = prevProps;
    const { textTrack: curr } = this.props;
    const isSame = prev.id === curr.id;
    if (curr.isEnabled && !isSame && this.castSession) {
      console.log(`Text track id is updated from ${prev.id} to ${curr.id}`);
      this.updateTextTrack(this.castSession);
    }
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
    const { chrome } = window;
    const applicationIDs = chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID;
    const sessionRequest = new chrome.cast.SessionRequest(applicationIDs);
    const apiConfig = new chrome.cast.ApiConfig(sessionRequest,
      session => {
        console.log('apiConfig session callback: ', session);
      },
      receiver => {
        console.log(`apiConfig receiver callback: ${receiver}`);
      });
  
    chrome.cast.initialize(apiConfig, () => {
      console.log('init session success');
    }, console.log);
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
      VOLUME_LEVEL_CHANGED,
      IS_MUTED_CHANGED,
      PLAYER_STATE_CHANGED
    } = window.cast.framework.RemotePlayerEventType;

    controller.addEventListener(IS_CONNECTED_CHANGED, this.onConnectionChanged);
    controller.addEventListener(IS_PAUSED_CHANGED, this.onPausedChanged);
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
      VOLUME_LEVEL_CHANGED,
      IS_MUTED_CHANGED,
      PLAYER_STATE_CHANGED
    } = window.cast.framework.RemotePlayerEventType;

    controller.removeEventListener(IS_CONNECTED_CHANGED, this.onConnectionChanged);
    controller.removeEventListener(IS_PAUSED_CHANGED, this.onPausedChanged);
    controller.removeEventListener(VOLUME_LEVEL_CHANGED, this.onVolumeLevelChanged);
    controller.removeEventListener(IS_MUTED_CHANGED, this.onMutedChanged);
    controller.removeEventListener(PLAYER_STATE_CHANGED, this.onPlayerStateChanged);
    console.log(`Unregistered Event Listeners, took %c${Date.now() - start}ms`, 'color: #d80a52;');
  }

  onConnectionChanged() {
    if (!this.player.isConnected) {
      console.log('RemotePlayerController: Player disconnected');
      this.cleanup();
    }
  }

  onPausedChanged({ value }) {
    const { isPaused } = this.state;
    if (isPaused !== value) this.setState({ isPaused: value });
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
      const { app, toggleLoading } = this.props;
      const { isSeeking } = this.state;
      this.updateTime();
      if (app.isInitializing && !isSeeking) toggleLoading(); 
      this.setState({ isSeeking: false, isPaused: false });
    } else if (value === PAUSED) {
      this.stopTimer();
      this.setState({ isPaused: true });
    } else if (value === BUFFERING) {
      this.stopTimer();
      // this.setState({ isBuffering: true });
    } else {
      const { stream } = this.props;
      // The show is ended
      if (stream.currentTime >= (stream.duration - 1)) this.cleanup(); 
    }
  }

  setMessageListeners(session) {
    session.addMessageListener('urn:x-cast:playermanager.ready', data => {
      console.log(`received ${data} from receiver`);
    });
  }

  cast() {
    console.log('%cCasting video to Google Cast...', 'color:#1b5dc6');
    const start = Date.now();
    const { cast, chrome } = window;
    const { ip, stream, textTrack } = this.props;

    this.castSession = cast.framework.CastContext.getInstance().getCurrentSession();
    this.setMessageListeners(this.castSession);

    const mediaSource = `http://${ip.address}:6300/api/stream/video/${stream.id}/playlist.m3u8`;
    const mediaInfo = new chrome.cast.media.MediaInfo(mediaSource);
    mediaInfo.contentType = 'application/vnd.apple.mpegurl';
    mediaInfo.streamType = chrome.cast.media.StreamType.OTHER;
    // style text track
    mediaInfo.textTrackStyle = new chrome.cast.media.TextTrackStyle();
    mediaInfo.textTrackStyle.backgroundColor = '#00000000';
    mediaInfo.textTrackStyle.fontFamily = '\'Roboto\', sans-serif';
    mediaInfo.textTrackStyle.fontScale = 1.1;

    const request = new chrome.cast.media.LoadRequest(mediaInfo);

    if (textTrack.isEnabled) {
      /* Generate id for text track. Use random to avoid duplicates */
      const id = Math.round(Math.random() * 100);
      mediaInfo.tracks = [this.setTextTrack(id)];
      request.activeTrackIds = [id];
    }
    // start streaming
    if (this.castSession) {
      this.castSession.loadMedia(request)
        .then(() => {
          console.log(`%cCast process complete, took %c${Date.now() - start}ms`, 'color:#1b5dc6;', 'color:#d80a52;');
          this.initPlayer();
          this.mediaSession = this.castSession.getMediaSession();
          console.log(`%cPlaying stream id ${stream.id} @ %c${this.state.currTimeOffset}s`, 'color:#1b5dc6;', 'color:#d80a52;');
        })
        .catch((err) => console.log('Error code: ', err));
    }
  }

  switch() {
    const { io } = window;
    const { stream, updateStreamInfo } = this.props;

    this.stopMediaSession(() => {
      console.log(`creating new stream @ seek %c${stream.currentTime}`, 'color:#d80a52;');
      io.emit('new stream', { video: stream.video, seek: stream.currentTime });
      io.once('stream created', updateStreamInfo);
    });
  }

  seek(time) {
    console.log(`%cSeeking ${time}`, 'background:#1b5dc6; color:white;');
    const { updateStreamTime } = this.props;
    
    this.stopTimer(); // Stop show time timer

    if (this.seekTimer) {
      clearTimeout(this.seekTimer);
      this.seekTimer = null;
    }

    updateStreamTime(time); // reflect seek time on progress bar

    this.setState({ isSeeking: true, currTimeOffset: time }, () => {
      this.seekTimer = setTimeout(this.switch, 1000);
    });
  }

  setTextTrack(id) {
    const { chrome } = window;
    const { ip, textTrack } = this.props;
    const { currTimeOffset } = this.state;

    const sub = new chrome.cast.media.Track(id /* track id */, chrome.cast.media.TrackType.TEXT);
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

  updateTextTrack(session) {
    if (!session) return;
    console.log('Updating text track with receiver');
    const start = Date.now();
    const { ip, textTrack } = this.props;
    const { currTimeOffset } = this.state;
    const host = `http://${ip.address}:6300`;
    const pathname = `/api/stream/subtitle/${textTrack.id}`;
    const query = `offset=${textTrack.offset - currTimeOffset}&encoding=${textTrack.encoding}`;

    session.sendMessage('urn:x-cast:texttrack.add', { url: `${host}${pathname}?${query}` })
      .then(() => console.log(`New text track info has been sent, process took ${Date.now() - start}ms`))
      .catch(err => console.log(`Failed to send text track info with ${err}`));
  }

  updateTime(timestamp) {
    if (!this.mediaSession || !this.player) return;
    this.lastTimeUpdate = this.lastTimeUpdate || timestamp - 1000;
    const { requestAnimationFrame, chrome } = window;
    const { stream, updateStreamTime } = this.props;
    const isPlaying = this.player.playerState === chrome.cast.media.PlayerState.PLAYING;

    if (timestamp - this.lastTimeUpdate > 999) {
      // updateStreamTime(this.mediaSession.getEstimatedTime() + currTimeOffset);
      updateStreamTime(1 + stream.currentTime);
      this.lastTimeUpdate = timestamp;
    }
    if (isPlaying) this.timer = requestAnimationFrame(this.updateTime);
  }

  stopTimer() {
    console.log('Stopping timer...');
    if (this.timer) {
      window.cancelAnimationFrame(this.timer);
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

  stopMediaSession(cb) {
    if (this.mediaSession) {
      this.mediaSession.stop(null, cb, console.log);
      this.mediaSession = null;
    }
  }

  stop() {
    console.log('video has stopped');
    this.stopMediaSession(this.cleanup);
  }

  cleanup() {
    console.log('Cleaning up tmp files...');
    const { io } = window;
    const { app, stream, togglePlayer, resetStream, resetTextTrack } = this.props;

    if (stream.id === '') return;

    this.stopTimer(); // stop the currentTime timer

    io.emit('close stream', { id: stream.id });

    resetStream();
    resetTextTrack();
    if (app.isPlayerEnabled) togglePlayer();

    console.log('Cleaned tmp files');
  }

  render() {
    const { isSeeking, isPaused, isMuted, volume } = this.state;
    const { stream, toggleFileBrowserDialog } = this.props;

    if (stream.hasError) {
      return (
        <Container className='flex flex-center absolute'>
          <span style={{color: 'white'}}>Something went wrong...</span>
        </Container>
      );
    }

    return (
      <Fragment>
        <Container className='flex flex-center absolute full-size'>
          {isSeeking ? <Loader className='flex flex-center absolute' size={42} /> : null}
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
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({ ip: state.ip, app: state.app, stream: state.stream, textTrack: state.textTrack });

const mapDispatchToProps = (dispatch) => ({ 
  updateStreamInfo: bindActionCreators(updateStreamInfo, dispatch),
  toggleLoading: bindActionCreators(toggleLoading, dispatch),
  togglePlayer: bindActionCreators(togglePlayer, dispatch),
  toggleFileBrowserDialog: bindActionCreators(toggleFileBrowserDialog, dispatch),
  updateStreamTime: bindActionCreators(updateStreamTime, dispatch),
  rejectStream: bindActionCreators(rejectStream, dispatch),
  resetStream: bindActionCreators(resetStream, dispatch),
  resetTextTrack: bindActionCreators(resetTextTrack, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CastPlayer);