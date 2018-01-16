import React from 'react';

import FileBrowserButton from '../button/button-component';

import { Container, Title, Options, Option } from './cast-options-styles';

const CastOptions = ({ isVisible, cast, setPlayerManager, toggleCastOptions }) => {
  return (
    <Container isVisible={isVisible}>
      <Title className='flex flex-align-center flex-space-between no-select'>
        <span>Stream Options</span>
        <FileBrowserButton
          onClick={toggleCastOptions}
          icon={['fas', 'times']}
          color={{ normal: 'rgb(255, 255, 255)', hover: 'rgb(233, 63, 60)'}}
        />
      </Title>
      <Options className='no-list-style'>
        <Option onClick={e => setPlayerManager(true)} className='flex flex-align-center pointer'>
          Play on Chromecast
        </Option>
        <Option onClick={e => setPlayerManager(false)} className='flex flex-align-center pointer'>
          Play in the browser
        </Option>
      </Options>
    </Container>
  );
};

export default CastOptions;