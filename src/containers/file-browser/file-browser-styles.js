import styled from 'styled-components';

export const Container = styled.div`
  display: ${({ isVisible }) => isVisible ? 'flex' : 'none'};
  z-index: 2147483647;
`;