import React from 'react';
import styled from 'styled-components';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

const Container = styled.div`
  width: ${({ width }) => width || '42px'};
  height: ${({ height }) => height || '24px'};
  font-size: ${({ size }) => size || '24px'};
  color: ${({ color }) => color ? color.normal : 'rgba(255,255,255,1)'};
  z-index: 50;

  &:hover {
    color: ${({ color, theme }) => color ? color.hover : theme.orange};
  }
`;

const ControlButton = ({ children, onClick, className, icon, color, width, height, size }) => {
  return (
    <Container
      onClick={onClick}
      className={`flex flex-center transition-color pointer${className ? ' ' + className : ''}`}
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