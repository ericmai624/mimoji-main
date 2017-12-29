import styled from 'styled-components';

export const List = styled.ul`
  list-style: none;
  max-height: 600px;
`;

export const Entry = styled.li`
  user-select: none;
  padding: 1em;
  align-items: center;
  border-bottom: 1px solid #e3e3e3;
  cursor: pointer;
  transition: color 0.15s ease-out;

  &:hover {
    background: rgba(59, 59, 59, 0.4);
    color: rgb(228, 75, 54);
    transition: color 0.15s ease-in;
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
