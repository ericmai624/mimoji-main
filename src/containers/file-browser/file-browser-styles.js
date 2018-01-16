import styled from 'styled-components';

const overlay = 'rgba(38, 38, 38, 0.9)';

export const Container = styled.div`
  visibility: ${({ isVisible }) => isVisible ? 'visible' : 'hidden'};
  opacity: ${({ isVisible }) => isVisible ? 1 : 0};
  z-index: ${({ isVisible }) => isVisible ? 2147483647 : -1};
  overflow: hidden;
  background ${overlay};
  transition: opacity 0.2s ease, visibility 0.2s ease;
`;