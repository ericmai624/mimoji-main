import styled from 'styled-components';

export const Container = styled.div`
  display: ${({ isVisible }) => isVisible ? 'flex' : 'none'};
  background: rgba(0, 0, 0, 0.25);
  z-index: 200;
`;
