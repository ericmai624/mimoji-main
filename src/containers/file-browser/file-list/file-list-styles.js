import styled from 'styled-components';

const fontColor = 'rgb(0, 0, 0)';
const overlay = 'rgba(38, 38, 38, 0.9)';
const bg = 'rgba(255, 255, 255, 1)';

export const Container = styled.div.attrs({
  v: ({ isVisible }) => isVisible
})`
  visibility: ${({ v }) => v ? 'visible' : 'hidden'};
  opacity: ${({ v }) => v ? 1 : 0};
  grid-template-columns: 2fr 4fr;
  grid-column-gap: 20px;
  border-radius: 5px;
  width: ${({ v }) => v ? '900px' : 0};
  height: ${({ v }) => v ? '80%' : 0};
  max-height: 480px;
  overflow: auto;
  transition: height 0.2s ease;
`;

export const Side = styled.div`
  grid-column: 1;
  border-radius: 5px;
  background: ${bg};  
`;

export const Main = styled.div`
  border-radius: 5px;
  user-select: none;
  grid-column: 2;
  padding: 28px;
  overflow: auto;
  color: ${fontColor};
  background: ${bg};
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

`;

export const NaviBtns = styled.div`
  width: 36px;
  height: 36px;
  font-size: 24px;
  color: ${fontColor};
  cursor: pointer;
  transition: color 0.25s ease-out;

  &:hover {
    color: rgba(228, 75, 54, 0.9);
    transition: color 0.25s ease-in;
  }
`;


