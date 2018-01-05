import styled from 'styled-components';

const white = 'rgb(255, 255, 255)';
const orange = 'rgba(228, 75, 54, 0.9)';

export const Container = styled.div.attrs({
  color: ({ color }) => color ? color : { normal: white, hover: orange },
  size: ({ size }) => size ? size : '24px',
  width: ({ width }) => width ? width : '42px',
  height: ({ height }) => height ? height : '24px'
})`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  font-size: ${({ size }) => size};
  color: ${({ color }) => color.normal};
  cursor: pointer;
  transition: color 0.25s ease-out;
  z-index: 50;

  &:hover {
    color: ${({ color }) => color.hover};
    transition: color 0.25s ease-in;
  }
`;