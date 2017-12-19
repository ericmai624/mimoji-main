import styled from 'styled-components';

export const List = styled.ul`
  list-style: none;
  max-height: 600px;
  padding: 0;
  margin: 0;
`;

export const Entry = styled.li`
  user-select: none;
  padding: 1em;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e3e3e3;
  cursor: pointer;

  &:hover {
    background: rgba(235, 235, 235, 0.8);
  }
`;

export const Icon = styled.div`
  font-size: 1.4em;
  padding: 0;
`;

export const Span = styled.span`
  margin-left: 0.7em;
  word-break: break-all;
`;
