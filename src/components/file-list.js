import React from 'react';
import styled from 'styled-components';

const List = styled.ul`
  list-style: none;
  max-height: 600px;
  padding: 0;
  margin: 0;
`;

const Entry = styled.li`
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

const Icon = styled.div`
  font-size: 1.4em;
`;

const Span = styled.span`
  margin-left: 0.7em;
  word-break: break-all;
`;

const FileList = ({ dir, fetchDirList, castSelectedFile }) => {
  return (
    <List>
      {dir.list.map((file, i) => {
        if (file.isDirectory) {
          return (
            <Entry key={i} onDoubleClick={(e) => fetchDirList(file.path)}>
              <Icon>
                <i className="fas fa-folder"></i>
              </Icon>
              <Span>{file.fileName}/</Span>
            </Entry>
          );
        }

        return (
          <Entry key={i} onDoubleClick={(e) => castSelectedFile(e, file.path)}>
            <Icon>
              <i className="fas fa-file"></i>
            </Icon>
            <Span>{file.fileName}</Span>
          </Entry>
        );
      })}
    </List>
  );
};

export default FileList;