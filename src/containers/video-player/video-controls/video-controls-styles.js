import styled from 'styled-components';

const ctrlBg = 'rgba(65, 68, 86, 0.8)';
const orange = 'rgba(228, 75, 54, 0.9)';
const borderRadius = '4px';
const progressHeight = '8px';

export const Container = styled.div.attrs({
  opacity: ({ isControlsVisible }) => isControlsVisible ? 1 : 0
})`
  width: 800px;
  height: 48px;
  padding: 0 45px;
  border-radius: 10px;
  background: ${ctrlBg};
  opacity: ${({ opacity }) => opacity};
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
  height: ${progressHeight};
  border: none;
  border-radius: ${borderRadius};
  overflow: hidden;
  cursor: pointer;
  line-height: 0;
  transition: transform 0.25s ease-in-out;
  background: transparent;

  &:hover {
    transform: scaleY(2);
    transition: transform 0.25s ease-in-out;    
  }
`;

export const Progress = styled.progress`
  display: block;
  width: 100%;
  height: ${progressHeight};
  border: none;
  border-radius: ${borderRadius};
  color: ${orange};

  &::-webkit-progress-value {
    background: ${orange};
    border: none;
    border-radius: ${borderRadius};
  }
  &::-moz-progress-bar {
    background: ${orange};
    border: none;
    border-radius: ${borderRadius};
  }
`;

export const Bridge = styled.div.attrs({
  display: ({ showVolumeRange }) => showVolumeRange ? 'block' : 'none'
})`
  display: ${({ display }) => display};
  background: transparent;
  width: 42px;
  height: 35px;
  z-index: 1;
  transform: translateY(-50px);
`;

export const VolumeContainer = styled.div`
  width: 42px;
  height: 24px;
  font-size: 24px;
  color: rgb(255, 255, 255);
  box-sizing: border-box;
  z-index: 50;
`;

export const VolumeRangeWrapper = styled.div.attrs({
  opacity: ({ showVolumeRange }) => showVolumeRange ? '1' : '0',
  visibility: ({ showVolumeRange }) => showVolumeRange ? 'visible' : 'hidden'
})`
  opacity: ${({ opacity }) => opacity};
  visibility: ${({ visibility }) => visibility};
  transform: rotate(-90deg) translate(115px, -32px);
  transform-origin: 50% 50%;
  background: ${ctrlBg};
  width: 105px;
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
  width: 90px;
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
    outline: none;
    background: transparent;
    cursor: pointer;
  }

  &::-moz-focus-outer {
    border: 0;
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

/*
export const Sub = styled.div`
  width: 26px;
  height: 20px;
  line-height: 20px;
  padding: 0px 1px;
  vertical-align: middle;
  text-align: center;
  background: rgb(255, 255, 255);
  color: rgba(48, 47, 42, 1);
  font-size: 10px;
  font-weight: bold;
  border-radius: 2px;
  transition: background 0.25s ease-out;

  &:hover {
    color: rgb(255, 255, 255);
    background: ${orange};
    transition: background 0.25s ease-in;
  }
`;
*/