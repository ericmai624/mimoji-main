import React from 'react';

import {
  List,
  Entry,
  Icon,
  Span
} from './file-list-styles';

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