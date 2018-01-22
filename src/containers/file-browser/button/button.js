import React from 'react';
import styled from 'styled-components';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

const transparent = 'transparent';
const lightgray = 'rgba(219, 219, 219, 0.5)';
const black = 'rgb(0, 0, 0)';
const orange = 'rgba(228, 75, 54, 1)';

const Container = styled.div`
  width: ${({ w }) => w ? w : '36px'};
  height: ${({ h }) => h ? h : '36px'};
  font-size: ${({ s }) => s ? s : '24px'};
  color: ${({ c }) => c ? c.normal : black};
  background: ${({ bg }) => bg ? bg.normal : transparent};

  &:hover {
    color: ${({ c }) => c ? c.hover : orange};
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