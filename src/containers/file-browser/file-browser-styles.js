import styled from 'styled-components';

export const Container = styled.div`
  display: ${({ isVisible }) => isVisible ? 'flex' : 'none'};
  background: ${({ isPlayerEnabled }) => isPlayerEnabled ? 'rgba(0,0,0,.25)' : 'inherit'};
  z-index: ${({ isPlayerEnabled }) => isPlayerEnabled ? 2147483647 : 5};
`;