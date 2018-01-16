import styled from 'styled-components';

const white = 'rgb(255, 255, 255)';
const orange = 'rgba(228, 75, 54, 0.9)';
const height = 150;
const boxShadow = '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)';
const lightgray = 'rgba(219, 219, 219, 0.5)';

export const Container = styled.div`
  visibility: ${({ isVisible }) => isVisible ? 'visible' : 'hidden'};
  opacity : ${({ isVisible }) => isVisible ? 1 : 0};
  width: ${({ isVisible }) => isVisible ? '360px' : 0};
  height: ${({ isVisible }) => isVisible ? height : 0}px;
  background: ${white};
  box-shadow: ${boxShadow};
  transition: opacity 0.25s ease-in-out;
`;

export const Title = styled.div`
  width: 100%;
  height: 50px;
  padding: 0 10px;
  font-size: 18px;
  box-sizing: border-box;
  color: ${white};
  background: ${orange};
`;

export const Options = styled.ul`
  width: 100%;
  height: ${height - 50}px;
  box-sizing: border-box;
`;

export const Option = styled.li`
  width: 100%;
  height: ${(height - 50) / 2}px;
  padding: 0 10px;
  box-sizing: border-box;
  transition: background 0.2s ease-in-out;

  &:hover {
    background: ${lightgray};
  }
`;