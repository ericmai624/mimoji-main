import styled from 'styled-components';

export const Container = styled.div`
  display: ${({ isVisible }) => isVisible ? 'flex' : 'none'};
  background: ${({ hasOverlay }) => 
    hasOverlay ? 
      'rgba(0, 0, 0, 0.25)' : 
      'url(\'/assets/background/209285.jpg\') center center no-repeat fixed'};
  background-size: cover;
  z-index: 2147483647;
`;