import styled from 'styled-components';

export const Wrapper = styled.div.attrs({
  opacity: props => props.show ? 1 : 0
})`
  width: 800px;
  height: 3em;
  border-radius: 10px;
  background: rgba(48, 47, 42, 0.5);
  opacity: ${(props) => props.opacity};
  z-index: 2147483647;
  position: fixed;
  left: 50%;
  bottom: 5%;
  margin-left: -400px;
  padding: 0.2em 1em;
  box-sizing: content-box;
  transition: opacity 0.25s ease-in-out;
  display: flex;
  align-items: center;
  justify-contents: space-around;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
`;

export const Showtime = styled.div`
  color: rgb(255, 255, 255);
  margin: 0 0.9em 0 1.8em;
  user-select: none;
`;

export const ProgressContainer = styled.div`
  display: block;
  width: 400px;
  height: 8px;
  border: none;
  margin-left: 1.8em;
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
  color: rgba(228, 75, 54, 0.9);

  &::-webkit-progress-value {
    background: rgba(228, 75, 54, 0.9);
  }
  &::-moz-progress-bar {
    background: rgba(228, 75, 54, 0.9);
  }
`;

export const ControlsBtns = styled.div`
  width: 1.8em;
  font-size: 1.5em;
  color: rgb(255, 255, 255);
  cursor: pointer;
  transition: color 0.25s ease-out;

  &:hover {
    color: rgba(228, 75, 54, 0.9);
    transition: color 0.25s ease-in;
  }
`;