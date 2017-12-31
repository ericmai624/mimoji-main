import styled from 'styled-components';

const containerWidth = 500;
const containerHeight = 300;
const fontColor = 'rgb(255, 255, 255)';

export const Container = styled.div`
  width: ${containerWidth}px;
  height: ${containerHeight}px;
  left: 50%;
  top: 50%;
  margin-left: -${containerWidth / 2}px;
  margin-top: -${containerHeight / 2}px;
  border-radius: 5px;
  background: rgba(49, 49, 49, 0.6);
  color: ${fontColor};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
`;