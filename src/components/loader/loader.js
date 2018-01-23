import React from 'react';
import styled from 'styled-components';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

const Container = styled.div`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  font-size: ${({ size }) => size}px;
  color: ${({ color }) => color ? color : 'rgb(255, 255, 255)'};
  background: ${({ bg }) => bg ? bg : 'transparent'};
  top: 50%;
  left: 50%;
  margin-top: -${({ size }) => size / 2}px;
  margin-left: -${({ size }) => size / 2}px;
`;

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