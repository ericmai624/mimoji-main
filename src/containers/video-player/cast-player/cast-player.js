import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { timer } from 'd3-timer';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { toggleLoading, togglePlayer } from 'stores/app';
import { updateStreamInfo, updateStreamTime, rejectStream, resetStream } from 'stores/stream';
import { resetTextTrack } from 'stores/text-track';

import Loader from 'components/loader/loader';
import VideoControls from 'containers/video-player/video-controls/video-controls';

import { Flex } from 'shared/components';

const Container = Flex.extend`
  width: 100%;
  height: 100%;
  position: absolute;
  background: transparent;
  z-index: 98;
  transition: transform 0.5s ease-in-out;
`;

class CastPlayer extends Component {

  static propTypes = {
    updateStreamInfo: PropTypes.func.isRequired, 
    toggleLoading: PropTypes.func.isRequired, 
    togglePlayer: PropTypes.func.isRequired,  
    updateStreamTime: PropTypes.func.isRequired,
    rejectStream: PropTypes.func.isRequired,  
    resetStream: PropTypes.func.isRequired, 
    resetTextTrack: PropTypes.func.isRequired,
    ip: PropTypes.object.isRequired,
    app: PropTypes.object.isRequired,
    stream: PropTypes.object.isRequired,
    textTrack: PropTypes.object.isRequired,
    isFileBrowserEnabled: PropTypes.bool.isRequired
  }
  
  constructor(props) {
    super(props);

    this.state = {
      isSeeking: false,
      isPaused: false,
      isMuted: false,
      volume: 1,
      currTimeOffset: 0
    };
    
    /* Bind all methods to 'this' keyword to avoid illegal invokation */
    this.initPlayer = this.initPlayer.bind(this);
    this.setEventListeners = this.setEventListeners.bind(this);
    this.removeEventListeners = this.removeEventListeners.bind(this);
    this.cast = this.cast.bind(this);
    this.switch = this.switch.bind(this);
    this.seek = this.seek.bind(this);
    this.updateTime = this.updateTime.bind(this);
    this.startTimer = this.startTimer.bind(this);
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
    this.onCurrentTimeChanged = this.onCurrentTimeChanged.bind(this);
    this.onPausedChanged = this.onPausedChanged.bind(this);
    this.onMutedChanged = this.onMutedChanged.bind(this);
    this.onVolumeLevelChanged = this.onVolumeLevelChanged.bind(this);
    this.onPlayerStateChanged = this.onPlayerStateChanged.bind(this);
  }

  componentDidMount() {
    const { io } = window;
    const { rejectStream } = this.props;
    /* Init event listeners for socket.io */
    io.on('playlist ready', this.cast);
    io.on('stream rejected', rejectStream);
  }

  componentDidUpdate(prevProps, prevState) {
    const { textTrack: prevTextTrack } = prevProps;
    const { textTrack: currTextTrack } = this.props;
    const isSameTextTrack = prevTextTrack.id === currTextTrack.id;

    if (currTextTrack.isEnabled && !isSameTextTrack && this.castSession) {
      this.updateTextTrack(this.castSession);
    }
  }

  componentWillUnmount() {
    console.log('Component is unmounting');
    const { io } = window;
    const { controller } = this;
    const { rejectStream } = this.props;

    /* Make sure all event listeners are cleared before component is unmounted */
    if (controller) this.removeEventListeners(controller);
    io.off('playlist ready', this.cast);
    io.off('stream rejected', rejectStream);
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
    const start = performance.now();
    const { 
      IS_CONNECTED_CHANGED,
      CURRENT_TIME_CHANGED,
      IS_PAUSED_CHANGED,
      VOLUME_LEVEL_CHANGED,
      IS_MUTED_CHANGED,
      PLAYER_STATE_CHANGED
    } = window.cast.framework.RemotePlayerEventType;

    this.eventsList = [
      { event: IS_CONNECTED_CHANGED, handler: this.onConnectionChanged },
      { event: CURRENT_TIME_CHANGED, handler: this.onCurrentTimeChanged },
      { event: IS_PAUSED_CHANGED, handler: this.onPausedChanged },
      { event: VOLUME_LEVEL_CHANGED, handler: this.onVolumeLevelChanged },
      { event: IS_MUTED_CHANGED, handler: this.onMutedChanged },
      { event: PLAYER_STATE_CHANGED, handler: this.onPlayerStateChanged },
    ];

    this.eventsList.forEach(({ event, handler }) => controller.addEventListener(event, handler));

    console.log(`Registered Event Listeners %c+${performance.now() - start}ms`, 'color: #d80a52;');
  }

  removeEventListeners(controller) {
    if (!controller || !this.eventsList.length) return;
    console.log('Unregistering Event Listeners');
    const start = performance.now();

    this.eventsList.forEach(({ event, handler }) => controller.removeEventListener(event, handler));
    this.eventsList = [];

    console.log(`Unregistered Event Listeners %c+${performance.now() - start}ms`, 'color: #d80a52;');
  }

  onConnectionChanged() {
    if (!this.player.isConnected) {
      console.log('RemotePlayerController: Player disconnected');
      this.cleanup();
    }
  }

  onCurrentTimeChanged({ value }) {
    if (value) this.remoteElapsedTime = value;
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
      this.startTimer();
      if (app.isInitializing && !isSeeking) toggleLoading(); 
      this.setState({ isSeeking: false, isPaused: false });
    } else if (value === PAUSED) {
      this.stopTimer();
      this.setState({ isPaused: true });
    } else if (value === BUFFERING) {
      this.stopTimer();
      // this.setState({ isBuffering: true });
    } else {

    }
  }

  cast() {
    console.log('%cCasting video to Google Cast...', 'color:#1b5dc6');
    const start = performance.now();
    const { cast, chrome } = window;
    const { ip, stream, textTrack } = this.props;

    this.remoteElapsedTime = 0; // Reset remote player's current time 

    this.castSession = cast.framework.CastContext.getInstance().getCurrentSession();

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
          console.log(`%cCast process complete %c+${performance.now() - start}ms`, 'color:#1b5dc6;', 'color:#d80a52;');
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

    const sub = new chrome.cast.media.Track(id/* track id */, chrome.cast.media.TrackType.TEXT);
    const host = `http://${ip.address}:6300`;
    const pathname = `/api/subtitle/${textTrack.id}`;
    const query = `start=${currTimeOffset}`;
    
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
    const start = performance.now();
    const { ip, textTrack } = this.props;
    const { currTimeOffset } = this.state;
    const host = `http://${ip.address}:6300`;
    const pathname = `/api/subtitle/${textTrack.id}`;
    const query = `start=${currTimeOffset}`;

    session.sendMessage('urn:x-cast:texttrack.add', { url: `${host}${pathname}?${query}` })
      .then(() => console.log(`New text track info has been sent %c+${performance.now() - start}ms`, 'color:#d80a52;'))
      .catch(err => console.log(`Failed to send text track info with ${err}`));
  }

  updateTime(elapsed) {
    const { stream, updateStreamTime } = this.props;
    const { currTimeOffset } = this.state;
    const { remoteElapsedTime, cleanup } = this;

    // The show is ended
    if (stream.currentTime >= stream.duration) return cleanup(); 

    updateStreamTime(remoteElapsedTime + currTimeOffset + elapsed / 1000);
  }

  startTimer() {
    if (!this.mediaSession || !this.player) return;
    const { chrome } = window;
    const isPlaying = this.player.playerState === chrome.cast.media.PlayerState.PLAYING;

    if (isPlaying) this.timer = timer(this.updateTime);
  }

  stopTimer() {
    console.log('Stopping timer ', this.timer);
    if (this.timer) {
      this.timer.stop();
      console.log('Timer ', this.timer, ' has stopped');
      this.timer = null;
    }
  }

  playOrPause() {
    const { isPaused } = this.player;
    const { controller } = this;
    const callback = controller.playOrPause.bind(controller);
    this.setState({ isPaused: !isPaused }, callback);
  }

  muteOrUnmute() {
    const { isMuted } = this.player;
    const { controller } = this;
    const callback = controller.muteOrUnmute.bind(controller);
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
    const { isPaused } = this.player;

    if (this.mediaSession) {
      if (!isPaused) this.controller.playOrPause();
      this.mediaSession.stop(null, cb, console.log);
      this.mediaSession = null;
    }
  }

  stop() {
    console.log('video has stopped');
    this.stopMediaSession(this.cleanup);
  }

  cleanup() {
    console.log('Cleaning up tmp files');
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
    const { stream, isFileBrowserEnabled, toggleFileBrowserDialog } = this.props;

    if (stream.hasError) {
      return (
        <Container align='center' justify='center'>
          <span style={{color: 'white'}}>Something went wrong...</span>
        </Container>
      );
    }

    return (
      <Container
        align='center'
        justify='center'
        style={{ transform: isFileBrowserEnabled ? 'translateX(-100%)' : 'none' }}
      >
        <Loader
          isVisible={isSeeking}
          size={42}
          style={{ position: 'absolute', left: 'calc(50% - 21px)', top: 'calc(50% - 21px)' }}
        /> 
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

const mapStateToProps = state => ({
  ip: state.ip,
  app: state.app,
  stream: state.stream,
  textTrack: state.textTrack,
  isFileBrowserEnabled: state.fileBrowser.isVisible
});

const mapDispatchToProps = (dispatch) => ({ 
  updateStreamInfo: bindActionCreators(updateStreamInfo, dispatch),
  toggleLoading: bindActionCreators(toggleLoading, dispatch),
  togglePlayer: bindActionCreators(togglePlayer, dispatch),
  updateStreamTime: bindActionCreators(updateStreamTime, dispatch),
  rejectStream: bindActionCreators(rejectStream, dispatch),
  resetStream: bindActionCreators(resetStream, dispatch),
  resetTextTrack: bindActionCreators(resetTextTrack, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CastPlayer);