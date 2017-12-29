import styled from 'styled-components';

export const Container = styled.div.attrs({
  opacity: props => props.showControls ? 1 : 0
})`
  width: 800px;
  height: 3em;
  padding: 0 45px;
  border-radius: 10px;
  background: rgba(48, 47, 42, 0.5);
  opacity: ${(props) => props.opacity};
  z-index: 2147483647;
  left: 50%;
  bottom: 5%;
  margin-left: -400px;
  box-sizing: border-box;
  transition: opacity 0.25s ease-in-out;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
`;

export const Showtime = styled.div`
  color: rgb(255, 255, 255);
  user-select: none;
`;

export const ProgressContainer = styled.div`
  display: block;
  width: 320px;
  height: 8px;
  border: none;
  border-radius: 4px;
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
  width: 42px;
  height: 24px;
  font-size: 24px;
  color: rgb(255, 255, 255);
  cursor: pointer;
  transition: color 0.25s ease-out;

  &:hover {
    color: rgba(228, 75, 54, 0.9);
    transition: color 0.25s ease-in;
  }
`;

export const Bridge = styled.div.attrs({
  display: ({ showVolumeRange }) => showVolumeRange ? 'block' : 'none'
})`
  display: ${({ display }) => display};
  background: transparent;
  width: 42px;
  height: 20px;
  transform: translateY(-43px);
`;

export const VolumeContainer = styled.div`
  width: 42px;
  height: 24px;
  font-size: 24px;
  color: rgb(255, 255, 255);
  box-sizing: border-box;
`;

export const VolumeRangeWrapper = styled.div.attrs({
  opacity: (props) => props.showVolumeRange ? '1' : '0',
  visibility: (props) => props.showVolumeRange ? 'visible' : 'hidden'
})`
  opacity: ${props => props.opacity};
  visibility: ${props => props.visibility};
  transform: rotate(-90deg) translate(110px, -27px);
  transform-origin: 50% 50%;
  background: rgba(48, 47, 42, 0.5);
  width: 95px;
  height: 40px;
  border-radius: 5px;
  padding: 0px 5px;
  box-sizing: border-box;
  transition: opacity 0.25s ease-in-out;
`;

export const VolumeRange = styled.input.attrs({
  type: 'range',
  min: '0',
  max: '1',
  step: '0.01'
})`
  width: 80px;
  height: 6px;
  border-radius: 2px;
  outline: none;
  cursor: pointer;
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

export const Sub = styled.div`
  width: 24px;
  height: 20px;
  line-height: 20px;
  vertical-align: middle;
  text-align: center;
  background: rgb(255, 255, 255);
  color: rgba(48, 47, 42, 1);
  font-size: 10px;
  font-weight: 900;
  border-radius: 2px;
  transition: background 0.25s ease-out;

  &:hover {
    color: rgb(255, 255, 255);
    background: rgba(228, 75, 54, 0.9);
    transition: background 0.25s ease-in;
  }
`;