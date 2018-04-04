import React from 'react';

import { Flex } from 'src/shared/components';

import Loader from 'src/components/loader/loader';

const Container = Flex.extend`
  display: ${({ isVisible }) => isVisible ? 'flex' : 'none'};
  background: rgba(0, 0, 0, 0.25);
  z-index: 200;
  position: absolute;
  width: 100%;
  height: 100%;
  user-select: none;
`;

const LoadingScreen = ({ isInitializing }) => {
  return (
    <Container 
      id='loading-screen' align='center' justify='center' isVisible={isInitializing}>
      <Loader size={42} isVisible={true} />
    </Container>
  );
};

export default LoadingScreen;
