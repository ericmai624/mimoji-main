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
  box-sizing: border-box;
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
  width: 320px;
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

export const VolumeRangeWrapper = styled.div`
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  position: absolute;
  padding: 0;
  background: rgba(48, 47, 42, 0.5);
  width: 95px;
  height: 40px;
  border-radius: 5px;
  top: -85px;
`;

export const VolumeRange = styled.input`
  width: 80px;
  height: 6px;
  border-radius: 2px;
  outline: none;
  cursor: pointer;
  box-sizing: border-box;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    background: rgba(219, 219, 219, 1);
    width: 16px;
    height: 16px;
    border-radius: 50%;
    cursor: pointer;
  }

  &::-webkit-slider-runnable-track {
    background: transparent;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    background: rgba(219, 219, 219, 1);
    width: 16px;
    height: 16px;
    border-radius: 50%;
    cursor: pointer;
  }

  &::-moz-range-track {
    background: transparent;
    cursor: pointer;
  }

  &::-ms-thumb {
    background: rgba(219, 219, 219, 1);
    width: 16px;
    height: 16px;
    border-radius: 50%;
    cursor: pointer; 
  }

  &::-ms-track {
    width: 80px;
    height: 8px;
    cursor: pointer;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }

  &:focus {
    outline: none;
  }
`;