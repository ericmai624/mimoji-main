import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import {
  List,
  Entry,
  Icon,
  Span
} from './file-list-styles';

const FileList = ({ dir, onDoubleClickDirectory, onDoubleClickFile }) => {
  return (
    <List>
      {dir.list.map((file, i) => {
        const { isDirectory } = file;

        return (
          <Entry 
            key={i} 
            onDoubleClick={isDirectory ? (e) => onDoubleClickDirectory(e, file.path) : (e) => onDoubleClickFile(e, file.path)}
          >
            <Icon>
              {isDirectory ? <FontAwesomeIcon icon={['fas', 'folder']}/> : <FontAwesomeIcon icon={['fas', 'file']}/>}
            </Icon>
            <Span>{file.fileName}/</Span>
          </Entry>
        );
      })}
    </List>
  );
};

export default FileList;