import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import { Container } from './loader-styles';

const Loader = ({ size, color, background }) => {
  return (
    <Container 
      className='flex flex-center absolute'
      size={size}
      color={color}
      bg={background}
    >
      <FontAwesomeIcon icon={['fas', 'spinner']} spin/>
    </Container>
  );
};

export default Loader;