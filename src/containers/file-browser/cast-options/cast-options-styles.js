import styled from 'styled-components';

export const Container = styled.div.attrs({
  v: ({ isVisible }) => isVisible
})`
  visibility: ${({ v }) => v ? 'visible' : 'hidden'};
  opacity : ${({ v }) => v ? 1 : 0};
  width: ${({ v }) => v ? '400px' : 0};
  height: ${({ v }) => v ? '200px' : 0};
  background: lightgray;
  transition: height 0.2s ease;
`;