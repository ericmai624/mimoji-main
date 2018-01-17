import styled from 'styled-components';

export const Container = styled.div`
  visibility: ${({ isVisible }) => isVisible ? 'visible' : 'hidden'};
  opacity: ${({ isVisible }) => isVisible ? 1 : 0};
  z-index: ${({ isVisible }) => isVisible ? 2147483647 : -1};
  background: ${({ hasOverlay }) => 
    hasOverlay ? 
      'rgba(0, 0, 0, 0.25)' : 
      'url(\'/assets/background/209285.jpg\') center center no-repeat fixed'};
  background-size: cover;
  transition: opacity 0.25s ease-in-out;
`;