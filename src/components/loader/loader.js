import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import { Flex } from 'shared/components';

const Container = Flex.extend`
  display: ${({ isVisible }) => isVisible ? 'flex' : 'none'};
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  font-size: ${({ size }) => size}px;
  color: ${({ color }) => color || 'rgb(255, 255, 255)'};
  background: ${({ bg }) => bg || 'transparent'};
`;

const Loader = ({ className, size, color, background, style, isVisible }) => {
  return (
    <Container 
      align='center'
      justify='center'
      className={className}
      size={size}
      color={color}
      bg={background}
      style={style}
      isVisible={isVisible}
    >
      <FontAwesomeIcon icon={['fas', 'spinner']} spin/>
    </Container>
  );
};

export default Loader;