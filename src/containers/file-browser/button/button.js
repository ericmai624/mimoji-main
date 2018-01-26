import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import { Button } from 'shared/components';

const lightgray = 'rgba(219, 219, 219, 0.5)';

const Container = Button.extend`
  font-size: 24px;
  color: ${({ c }) => c ? c.normal : 'white'};
  background: ${({ bg }) => bg ? bg.normal : 'transparent'};
  transition: color 0.25s ease-in-out;

  &:hover {
    color: ${({ c, theme }) => c ? c.hover : theme.orange};
    background: ${({ bg }) => bg ? bg.hover : lightgray};
  }
`;

const FileBrowserButton = ({ children, className, onClick, icon, style, color, background }) => {
  return (
    <Container
      className={className}
      onClick={onClick}
      style={style}
      size='36px'
      c={color}
      bg={background}
    >
      {children ? children : <FontAwesomeIcon icon={icon}/>}
    </Container>
  );
};

export default FileBrowserButton;