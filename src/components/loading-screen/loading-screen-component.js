import React from 'react';

import Loader from 'components/loader/loader-component';

import { Container } from './loading-screen-styles';

const Loading = ({ isInitializing }) => {
  return (
    <Container 
      id='loading-screen' className='flex-center absolute full-size no-select' isVisible={isInitializing}>
      <Loader size={42} />
    </Container>
  );
};

export default Loading;
