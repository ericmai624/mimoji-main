import React, { Fragment } from 'react';
import { connect } from 'react-redux';

const TextTrack = ({ textTrack, currTimeOffset, isTextTrackEnabled }) => (
  <Fragment>
    {textTrack.isEnabled && isTextTrackEnabled ? <track
      kind='subtitles'
      src={`/api/stream/subtitle?sub=${textTrack.path}&`
          + `offset=${textTrack.offset - currTimeOffset}&`
          + `encoding=${textTrack.encoding}`}
      label={textTrack.label}
      srcLang='zh'
      default={true}
    /> : null}
  </Fragment>
);

const mapStateToProps = (state) => ({ textTrack: state.textTrack });

export default connect(mapStateToProps, null)(TextTrack);