import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import { Container } from './loader-styles';

const Loader = ({ className, size, color, background, style }) => {
  return (
    <Container 
      className={className}
      size={size}
      color={color}
      bg={background}
      style={style}
    >
      <FontAwesomeIcon icon={['fas', 'spinner']} spin/>
    </Container>
  );
};

export default Loader;