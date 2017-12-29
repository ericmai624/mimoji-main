import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  left: 0;
  top: 0;
  background: rgba(49, 49, 49, 0.9);
  z-index: 105;
`;

export const Dialog = styled.div`
  grid-template-columns: 2fr 4fr;
  grid-column-gap: 20px;
  width: 900px;
  height: 80%;
  max-height: 480px;
`;

export const DialogSidebar = styled.div`
  grid-column: 1;
  border-radius: 5px;
  background: rgba(34, 34, 34, 0.8);
`;

export const Main = styled.div`
  border-radius: 5px;
  user-select: none;
  grid-column: 2;
  padding: 1.8em;
  overflow: auto;
  background: rgba(34, 34, 34, 0.8);
  color: rgb(255, 255, 255);
`;

export const CurrDirectory = styled.div`
  border: 1px solid #e3e3e3;
  padding: 0.5em 1em;
  width: 60%;
  height: 34.5px;
  box-sizing: border-box;

  &:hover {
    height: auto;
    word-wrap: break-word;
    white-space: unset;
  }
`;

export const Nav = styled.div`
  display: flex;
`;

export const NaviBtns = styled.div`
  font-size: 1.4em;
  color: rgb(255, 255, 255);
  cursor: pointer;
  margin-left: 1em;
`;

