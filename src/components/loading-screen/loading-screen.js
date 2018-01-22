import React from 'react';
import styled from 'styled-components';

import Loader from 'components/loader/loader-component';

const Container = styled.div`
  display: ${({ isVisible }) => isVisible ? 'flex' : 'none'};
  background: rgba(0, 0, 0, 0.25);
  z-index: 200;
`;

const LoadingScreen = ({ isInitializing }) => {
  return (
    <Container 
      id='loading-screen' className='flex-center absolute full-size no-select' isVisible={isInitializing}>
      <Loader size={42} />
    </Container>
  );
};

export default LoadingScreen;
