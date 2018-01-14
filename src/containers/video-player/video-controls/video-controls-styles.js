import styled from 'styled-components';

const ctrlBg = 'rgba(65, 68, 86, 0.8)';
const orange = 'rgba(228, 75, 54, 0.9)';
const borderRadius = 6;
const progressHeight = 12;

export const Container = styled.div`
  width: 800px;
  height: 48px;
  padding: 0 45px;
  border-radius: 10px;
  background: ${ctrlBg};
  opacity: ${({ isControlsVisible }) => isControlsVisible ? 1 : 0};
  left: 50%;
  bottom: 5%;
  margin-left: -400px;
  box-sizing: border-box;
  transition: opacity 0.25s ease-in-out;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
`;

export const ProgressContainer = styled.div`
  display: block;
  width: 320px;
  height: ${progressHeight}px;
  border: none;
  border-radius: ${borderRadius}px;
  line-height: 0;
`;

export const SeekTime = styled.div`
  visibility: ${({ isVisible }) => isVisible ? 'visible' : 'hidden'};
  opacity: ${({ isVisible }) => isVisible ? 1 : 0};
  font-size: 12px;
  background: rgba(0, 0, 0, 0.85);
  padding: 5px;
  width: 50px;
  height: 12px;
  bottom: 34px;
  border-radius: 4px;
  box-sizing: content-box;
  z-index: 108;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);
  transition: opacity 0.25s ease;

  &:before {
    content: '';
    position: absolute;
    left: calc(50% - 5px);
    bottom: -4px;
    border-width: 5px 5px 0 5px;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.85) transparent transparent transparent;
  }
`;

export const Progress = styled.progress`
  display: block;
  width: 100%;
  height: ${progressHeight}px;
  border: none;
  border-radius: ${borderRadius}px;
  color: ${orange};
  -webkit-appearance: none;

  &::-webkit-progress-value {
    background: ${orange};
    border: none;
    border-radius: ${borderRadius}px;
  }
  &::-webkit-progress-inner-element {
    overflow: hidden;
    border: none;
    border-radius: ${borderRadius}px;
  }
  &::-moz-progress-bar {
    background: ${orange};
    border: none;
    border-radius: ${borderRadius}px;
  }
`;

export const Bridge = styled.div`
  display: ${({ showVolumeRange }) => showVolumeRange ? 'block' : 'none'};
  width: 42px;
  height: 35px;
  z-index: 1;
  transform: translateY(-50px);
`;

export const VolumeContainer = styled.div`
  width: 42px;
  height: 24px;
  font-size: 24px;
  box-sizing: border-box;
  z-index: 50;
`;

export const VolumeRangeWrapper = styled.div`
  opacity: ${({ showVolumeRange }) => showVolumeRange ? 1 : 0};
  visibility: ${({ showVolumeRange }) => showVolumeRange ? 'visible' : 'hidden'};
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
  step: '0.1'
})`
  width: 90px;
  height: 6px;
  border-radius: 2px;
  outline: none;
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
