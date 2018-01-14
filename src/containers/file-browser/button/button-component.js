import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { Container } from './button-styles';

const FileBrowserButton = ({ children, className, onClick, icon, width, height, size, style, color, background }) => {
  return (
    <Container
      className={`flex flex-center transition-color pointer${className ? ' ' + className : ''}`}
      onClick={onClick}
      style={style}
      w={width}
      h={height}
      s={size}
      c={color}
      bg={background}
    >
      {children ? children : <FontAwesomeIcon icon={icon}/>}
    </Container>
  );
};

export default FileBrowserButton;