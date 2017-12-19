import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  width: 800px;
  border-radius: 10px;
  background: rgba(48, 47, 42, 0.94);
  z-index: 101;
  position: fixed;
  left: 50%;
  bottom: 5%;
  margin-left: -400px;
  align-items: center;
  justify-content: center;
  padding: 0.2em;
  box-sizing: border-box;
  transition: opacity 0.25s ease-in-out;
`;

export const ProgressContainer = styled.div`
  display: block;
  width: 400px;
  height: 8px;
  border: none;
  border-radius: 4px;
  padding: 0;
  overflow: hidden;
  cursor: pointer;
  line-height: 0;
  transition: transform 0.25s ease-in-out;

  &:hover {
    transform: scaleY(2);
    transition: transform 0.25s ease-in-out;    
  }
`;

export const Progress = styled.progress`
  display: block;
  width: 100%;
  height: 8px;
  border: none;
  border-radius: 4px;
  color: rgb(236, 90, 51);

  &::-webkit-progress-value {
    background: rgb(236, 90, 51);
  }
  &::-moz-progress-bar {
    background: rgb(236, 90, 51);
  }
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
  
  &:hover {
    opacity: 1;
  }
`;