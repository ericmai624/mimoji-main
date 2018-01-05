import React from 'react';

import { Container } from './cast-options-styles';

const CastOptions = ({ isVisible, cast, stream }) => {
  return (
    <Container isVisible={isVisible}>
      <div onClick={cast}>cast to Chromecast</div>
      <div onClick={stream}>Play in browser</div>
    </Container>
  );
};

export default CastOptions;