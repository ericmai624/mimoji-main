import React, { Fragment } from 'react';

import WebPlayer from './web-player/web-player';
import CastPlayer from './cast-player/cast-player';

const VideoPlayer = ({ isChromecast }) => {
  return (
    <Fragment>
      {isChromecast ? <CastPlayer /> : <WebPlayer />}
    </Fragment>
  );
};

export default VideoPlayer;