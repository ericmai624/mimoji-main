import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import { Container } from './control-buttons-styles';

const ControlButton = ({ children, onClick, className, icon, color, width, height, size }) => {
  return (
    <Container
      onClick={onClick}
      className={`flex flex-center${className ? ' ' + className : ''}`}
      color={color}
      width={width}
      height={height}
      size={size}
    >
      {children ? children : <FontAwesomeIcon icon={icon}/>}
    </Container>
  );
};

export default ControlButton;