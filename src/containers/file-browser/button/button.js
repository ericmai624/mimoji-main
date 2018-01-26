import React from 'react';
import styled from 'styled-components';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

const lightgray = 'rgba(219, 219, 219, 0.5)';

const Container = styled.div`
  width: ${({ w }) => w || '36px'};
  height: ${({ h }) => h || '36px'};
  font-size: ${({ s }) => s || '24px'};
  color: ${({ c }) => c ? c.normal : 'white'};
  background: ${({ bg }) => bg ? bg.normal : 'transparent'};

  &:hover {
    color: ${({ c, theme }) => c ? c.hover : theme.orange};
    background: ${({ bg }) => bg ? bg.hover : lightgray};
  }
`;

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