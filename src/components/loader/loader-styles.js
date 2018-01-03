import styled from 'styled-components';

export const Container = styled.div.attrs({
  size: ({ size }) => size,
  color: ({ color }) => color ? color : 'rgb(255, 255, 255)',
  bg: ({ bg }) => bg ? bg : 'transparent'
})`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  font-size: ${({ size }) => size}px;
  color: ${({ color }) => color};
  background: ${({ bg }) => bg};
  top: 50%;
  left: 50%;
  margin-top: -${({ size }) => size / 2}px;
  margin-left: -${({ size }) => size / 2}px;
`;