import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 800px;
  border-radius: 10px;
  background: rgba(48, 47, 42, 0.6);
  z-index: 101;
  position: fixed;
  left: 50%;
  bottom: 5%;
  margin-left: -400px;
  align-items: center;
  justify-content: center;
  padding: 0.2em;
  box-sizing: border-box;
`;

export const Progress = styled.div`
  width: 600px;
  height: 0.5em;
  box-sizing: content-box;
  border-radius: 0.25em;
  overflow: hidden;
  background: rgb(52, 52, 52);
  cursor: pointer;
`;

export const ProgressBar = styled.div`
  height: 100%;
  border-radius: 0.25em;
  background: rgb(236, 90, 51);
`;

export const Controls = styled.div`
  height: 60px;
  padding: 0 0.5em 0.2em 0.5em;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
`;

export const Play = styled.div`
  width: 2em;
  font-size: 2em;
  cursor: pointer;
`;