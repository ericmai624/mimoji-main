import styled from 'styled-components';

const fontColor = 'rgb(0, 0, 0)';
const bg = 'rgba(255, 255, 255, 0.65)';
const boxShadow = '0 0 15px 5px rgba(0, 0, 0, 0.12)';

export const Container = styled.div`
  visibility: ${({ isVisible }) => isVisible ? 'visible' : 'hidden'};
  opacity: ${({ isVisible }) => isVisible ? 1 : 0};
  width: 700px;
  height: 80%;
  max-height: 600px;
  flex-direction: row;
  transition: opacity 0.2s ease-in-out;
  background: ${({ isPlayerEnabled }) => isPlayerEnabled ? 'rgba(255,255,255,1)' : 'inherit'};
  overflow: hidden;
  border-radius: 5px;
  box-shadow: ${boxShadow};

  &:before {
    content: '';
    width: 750px;
    height: calc(100% + 50px);
    background: inherit;
    position: absolute;
    left: -25px;
    right: 0;
    top: -25px;
    bottom: 0;
    box-shadow: inset 0 0 0 700px rgba(255,255,255,0.3);
    filter: blur(10px);
  }
`;

export const Main = styled.div`
  width: 700px;
  height: 100%;
  padding: 25px;
  left: calc(50% - 350px);
  top: 50%;
  transform: translateY(-50%);
  color: ${fontColor};
  background-color: ${bg};
  box-sizing: border-box;
  box-shadow: ${boxShadow};
  flex-direction: column;
`;

export const Nav = styled.div`
  flex-direction: row;
  flex-shrink: 0;
`;

export const Directory = styled.div`
  border: 1px solid ${fontColor};
  padding: 8px 16px;
  width: 60%;
  height: auto;
  min-height: 34.5px;
  box-sizing: border-box;

  &:hover {
    word-wrap: break-word;
    white-space: unset;
  }
`;

