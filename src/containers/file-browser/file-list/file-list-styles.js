import styled from 'styled-components';

const fontColor = 'rgb(0, 0, 0)';
const bg = 'rgba(255, 255, 255, 1)';

export const Container = styled.div`
  visibility: ${({ isVisible }) => isVisible ? 'visible' : 'hidden'};
  opacity: ${({ isVisible }) => isVisible ? 1 : 0};
  grid-template-columns: 2fr 4fr;
  grid-column-gap: 20px;
  border-radius: 5px;
  width: ${({ isVisible }) => isVisible ? '900px' : 0};
  height: ${({ isVisible }) => isVisible ? '80%' : 0};
  max-height: 480px;
  overflow: auto;
  transition: height 0.2s linear;
`;

export const Side = styled.div`
  height: auto;
  grid-column: 1;
  border-radius: 5px;
  background: ${bg};  
`;

export const Main = styled.div`
  border-radius: 5px;
  width: 100%;
  height: auto;
  user-select: none;
  grid-column: 2;
  padding: 28px;
  overflow: auto;
  color: ${fontColor};
  background: ${bg};
  box-sizing: border-box;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 36px 1fr;
  align-items: center;
  justify-content: center;
`;

export const Directory = styled.div`
  border: 1px solid ${fontColor};
  padding: 8px 16px;
  width: 60%;
  height: auto;
  min-height: 34.5px;
  box-sizing: border-box;

  &:hover {
    word-wrap: break-word;
    white-space: unset;
  }
`;

export const Nav = styled.div`
  grid-column: 1/4;
  grid-row: 1;
`;
