import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import { Flex } from 'shared/components';

const Container = Flex.extend`
  width: ${({ width }) => width || '42px'};
  height: ${({ height }) => height || '24px'};
  font-size: ${({ size }) => size || '24px'};
  color: ${({ color }) => color ? color.normal : 'rgba(255,255,255,1)'};
  z-index: 50;
  background: transparent;
  cursor: pointer;
  transition: color 0.25s ease-in-out;

  &:hover {
    color: ${({ color, theme }) => color ? color.hover : theme.orange};
  }
`;

const ControlButton = ({ children, onClick, className, icon, color, width, height, size, style }) => {
  return (
    <Container
      onClick={onClick}
      align='center'
      justify='center'
      color={color}
      width={width}
      height={height}
      size={size}
      style={style}
      className={className}
    >
      {children ? children : <FontAwesomeIcon icon={icon}/>}
    </Container>
  );
};

export default ControlButton;