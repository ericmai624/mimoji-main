import styled from 'styled-components';

const containerWidth = 300;
const containerHeight = 300;
const ctrlBg = 'rgba(65, 68, 86, 0.8)';
const boxShadow = '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)';
const padding = 20;
const orange = 'rgba(228, 75, 54, 1)';

export const ContainerR = styled.div`
  left: 50%;
  top: 50%;
  margin-left: -${containerWidth + 35}px;
  margin-top: -${(containerHeight - 50) / 2}px;
  width: ${containerWidth * 2 + 70}px;
  height: ${containerHeight - 50}px;
  padding: ${padding}px ${padding * 2}px;
  background: ${ctrlBg};
  box-shadow: ${boxShadow};
  z-index: 101;
  box-sizing: border-box;
`;

export const ContainerS = styled.div`
  right: 50%;
  top: 50%;
  margin-right: -10px;
  margin-top: -${containerHeight / 2}px;
  width: ${containerWidth}px;
  height: ${containerHeight}px;
  padding: ${padding}px;
  align-items: center;
  box-sizing: border-box;
  background: rgb(255, 255, 255);
  box-shadow: ${boxShadow};
  z-index: 102;
`;

export const Preference = styled.ul`
  width: ${containerWidth - padding * 2}px;
  list-style: none;
  float: right;
`;

export const Option = styled.li`
  width: 100%;
  margin: 40px 0;
`;

export const StyledDiv = styled.div`
  width: 290px;
  overflow: hidden;
  word-wrap: break-word;
  text-align: center;
`;

export const StyledSpan = styled.span`
  font-size: 15px;
  line-height: 20px;
  color: rgb(110, 110, 110);
  transition: color 0.25s ease;

  &:hover {
    text-decoration: underline;
    color: ${orange};
    cursor: pointer;
  }
`;

export const Btns = styled.div`
  height: 42px;
  float: right;
  position: absolute;
  right: 20px;
  bottom: 20px;
`;

export const Wrapper = styled.div`
  font-size: 24px;
  width: 40px;
  height: 40px;
  cursor: pointer;
  margin-left: 10px;

  &:hover {
    color: ${orange};
    background: rgba(219, 219, 219, 0.2);
  }
`;