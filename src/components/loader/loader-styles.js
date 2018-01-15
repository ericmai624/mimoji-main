import styled from 'styled-components';

export const Container = styled.div`
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