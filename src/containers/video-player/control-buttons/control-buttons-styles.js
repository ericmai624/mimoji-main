import styled from 'styled-components';

const white = 'rgb(255, 255, 255)';
const orange = 'rgba(228, 75, 54, 0.9)';

export const Container = styled.div`
  width: ${({ width }) => width ? width : '42px'};
  height: ${({ height }) => height ? height : '24px'};
  font-size: ${({ size }) => size ? size : '24px'};
  color: ${({ color }) => color ? color.normal : white};
  cursor: pointer;
  transition: color 0.25s ease-out;
  z-index: 50;

  &:hover {
    color: ${({ color }) => color ? color.hover : orange};
    transition: color 0.25s ease-in;
  }
`;