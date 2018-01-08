import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class CastPlayer extends Component {
  constructor(props) {
    super(props);
    
    this.initSession = this.initSession.bind(this);
    this.cast = this.cast.bind(this);
    this.seek = this.seek.bind(this);
    this.loadTextTrack = this.loadTextTrack.bind(this);
    this.end = this.end.bind(this);
    this.cleanup = this.cleanup.bind(this);
  }

  componentDidMount() {
    this.cast();
  }
  
  
  initSession() {
    let { cast } = window;
    console.log('initiating Google Cast...');
    this.castSession = cast.framework.CastContext.getInstance().getCurrentSession();
    if (!this.castSession) return cast.framework.CastContext.getInstance().requestSession(); // nullable Promise 
    return Promise.resolve();
  }

  cast() {
    let { cast, chrome } = window;
    let { stream, textTrack } = this.props;

    this.initSession()
      .then(err => {
        console.log(err);
        if (err) throw err;
        console.log('loading video');
        if (!this.castSession) this.castSession = cast.framework.CastContext.getInstance().getCurrentSession();
        let mediaSource = `http://172.16.1.19:3000/api/stream/video/${stream.id}/playlist.m3u8`;
        let contentType = 'application/vnd.apple.mpegurl';
        let mediaInfo = new chrome.cast.media.MediaInfo(mediaSource, contentType);
        mediaInfo.streamType = chrome.cast.media.StreamType.BUFFERED;

        if (textTrack.isEnabled) this.loadTextTrack(mediaInfo);

        let request = new chrome.cast.media.LoadRequest(mediaInfo);
        this.castSession.loadMedia(request);
      })
      .then(() => console.log('load success'), (err) => console.log('Error code: ', err))
      .catch(err => console.log(err));
  }

  seek() {
    // unload current session

    // init new session with new seek time
  }

  loadTextTrack(mediaInfo) {
    let { chrome } = window;
    let { textTrack } = this.props;

    let sub = new chrome.cast.media.Track(1 /* track id */, chrome.cast.media.TrackType.TEXT);
    sub.trackContentId = `http://172.16.1.19:3000/api/stream/subtitle/${textTrack.id}?offset=${textTrack.offset}`;
    sub.trackContentType = 'text/vtt';
    sub.subType = chrome.cast.media.TextTrackType.SUBTITLES;
    sub.name = 'SUB';
    mediaInfo.textTrackStyle = new chrome.cast.media.TextTrackStyle();
    mediaInfo.tracks = [sub];
  }

  end() {

  }

  cleanup() {

  }

  render() {
    return (
      <div>
        Chromecast
      </div>
    );
  }
}

const mapStateToProps = state => ({ stream: state.stream, textTrack: state.textTrack });

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(CastPlayer);