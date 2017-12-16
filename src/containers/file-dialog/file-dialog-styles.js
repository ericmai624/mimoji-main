import styled from 'styled-components';

export const LabelWrapper = styled.div`
  height: 100%;
  grid-row: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2em;
  cursor: pointer;
  margin-top: -50px;
`;

export const Label = styled.label`
  user-select: none;
  color: #fefefe;
  background-color: #3f51b5;
  outline: none;
  border: none;
  border-radius: 2px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  padding: 0.6em 0.8em;
  margin: 0;
  cursor: pointer;
`;

export const Wrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100vh;
  left: 0;
  top: 0;
  align-items: center;
  justify-content: center;
  background: rgba(49, 49, 49, 0.9);
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

export const Close = styled.div`
  display: inline-block;
  width: 40px;
  height: 40px;
  cursor: pointer;
`;
