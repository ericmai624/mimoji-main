import styled from 'styled-components';

const overlay = 'rgba(38, 38, 38, 0.9)';

export const Container = styled.div.attrs({
  opacity: ({ hidden }) => hidden ? 0 : 1,
  visibility: ({ hidden }) => hidden ? 'hidden' : 'visible'
})`
  opacity: ${({ opacity }) => opacity};
  visibility: ${({ visibility }) => visibility};
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  overflow: hidden;
  background ${overlay};
  transition: opacity 0.2s ease, visibility 0.2s ease;
  z-index: 2147483647;
`;