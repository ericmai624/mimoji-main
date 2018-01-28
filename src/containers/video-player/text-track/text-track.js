import React, { Fragment } from 'react';
import { connect } from 'react-redux';

const TextTrack = ({ textTrack, currTimeOffset, isLoading }) => (
  <Fragment>
    {textTrack.isEnabled && !isLoading ? 
      <track
        kind='subtitles'
        src={`/api/subtitle/${textTrack.id}?start=${currTimeOffset}`}
        label={textTrack.label}
        srcLang='zh'
        default={true}
      /> : null}
  </Fragment>
);

const mapStateToProps = (state) => ({ textTrack: state.textTrack });

export default connect(mapStateToProps, null)(TextTrack);