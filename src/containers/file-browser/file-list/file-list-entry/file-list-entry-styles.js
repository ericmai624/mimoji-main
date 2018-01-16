import styled from 'styled-components';

const iconSize = '24px';
const lightgray = 'rgba(219, 219, 219, 0.5)';

export const LoaderWrapper = styled.div`
  grid-area: 2/2/2/2;
  visibility: ${({ isVisible }) => isVisible ? 'visible' : 'hidden'};
  opacity: ${({ isVisible }) => isVisible ? 1 : 0};
`;

export const List = styled.ul`
  visibility: ${({ isVisible }) => isVisible ? 'visible' : 'hidden'};
  opacity: ${({ isVisible }) => isVisible ? 1 : 0};
  grid-column: 1/4;
  grid-row: 2;
  list-style: none;
  max-height: 480px;
  height: 100%;
  transition: opacity 0.15s ease-in-out;
`;

export const Entry = styled.li`
  user-select: none;
  padding: 16px;
  align-items: center;
  border-bottom: 1px solid rgba(155, 155, 155, 0.8);
  box-sizing: border-box;
  transition: color 0.15s ease-in-out;

  &:hover {
    background: ${lightgray};
    color: rgb(228, 75, 54);
  }
`;

export const Icon = styled.div`
  width: ${iconSize};
  height: ${iconSize};
  font-size: ${iconSize};
  padding: 0;
`;

export const Span = styled.span`
  margin-left: 12px;
  word-break: break-all;
`;
