import styled from 'styled-components';

const iconSize = '24px';
const lightgray = 'rgba(219, 219, 219, 0.25)';

export const Container = styled.div`
  overflow: auto;
  flex-grow: 1;
`;

export const List = styled.ul`
  opacity: ${({ isVisible }) => isVisible ? 1 : 0};
  width: 100%;
  height: 100%;
  transition: opacity 0.25s ease-in-out;
`;

export const Entry = styled.li`
  padding: 16px;
  align-items: center;
  border-bottom: 1px solid rgba(155, 155, 155, 0.8);
  box-sizing: border-box;
  transition: all 0.15s ease-in-out;

  &:hover {
    background: ${lightgray};
    color: rgb(196, 70, 54);
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
