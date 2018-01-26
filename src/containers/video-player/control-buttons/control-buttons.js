import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import { Button } from 'shared/components';

const Container = Button.extend`
  width: 42px;
  color: ${({ color }) => color ? color.normal : 'rgba(255,255,255,1)'};
  z-index: 50;
  transition: color 0.25s ease-in-out;

  &:hover {
    color: ${({ color, theme }) => color ? color.hover : theme.orange};
  }
`;

const ControlButton = ({ children, onClick, className, icon, color, style }) => {
  return (
    <Container
      onClick={onClick}
      size='24px'
      color={color}
      style={style}
      className={className}
    >
      {children ? children : <FontAwesomeIcon icon={icon}/>}
    </Container>
  );
};

export default ControlButton;