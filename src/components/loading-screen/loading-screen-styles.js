import styled from 'styled-components';

export const Container = styled.div`
  visibility: ${({ isVisible }) => isVisible ? 'visible' : 'hidden'};
  opacity: ${({ isVisible }) => isVisible ? 1 : 0};
  z-index: ${({ isVisible }) => isVisible ? 200 : -1};
  transition: opacity 0.25s ease;
  background: rgba(34, 34, 34, 0.25);


  &:before {
    content: '';
    position: absolute;
    z-index: -1;
  }
`;
