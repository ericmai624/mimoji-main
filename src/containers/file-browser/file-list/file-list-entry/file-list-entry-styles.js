import styled from 'styled-components';

const iconSize = '24px';
const lightgray = 'rgba(219, 219, 219, 0.5)';

export const List = styled.ul`
  list-style: none;
  max-height: 480px;
`;

export const Entry = styled.li`
  user-select: none;
  padding: 16px;
  align-items: center;
  border-bottom: 1px solid rgba(155, 155, 155, 0.8);
  transition: color 0.15s ease-out;

  &:hover {
    background: ${lightgray};
    color: rgb(228, 75, 54);
    transition: color 0.15s ease-in;
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
