import styled from 'styled-components';

export const Wrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100vh;
  left: 0;
  top: 0;
  background: rgba(49, 49, 49, 0.9);
  z-index: 105;
`;

export const Dialog = styled.div`
  display: grid;
  grid-template-columns: 2fr 4fr;
  width: 850px;
  height: 80%;
  max-height: 600px;
  background: rgb(255, 255, 255);
`;

export const DialogSidebar = styled.div`
  grid-column: 1;
  background: lightcoral;
`;

export const Main = styled.div`
  grid-column: 2;
  padding: 1.8em;
  overflow: auto;
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
  cursor: pointer;
  margin-left: 1em;
`;

