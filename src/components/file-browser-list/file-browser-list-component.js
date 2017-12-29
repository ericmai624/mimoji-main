import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import {
  List,
  Entry,
  Icon,
  Span
} from './file-browser-list-styles';

const FileBrowserList = ({ content, onDoubleClickDirectory, onDoubleClickFile }) => {
  return (
    <List className='zero-padding zero-margin'>
      {content.map((entry, i) => {
        const { isDirectory } = entry;

        return (
          <Entry className='flex'
            key={i} 
            onDoubleClick={isDirectory ? (e) => onDoubleClickDirectory(e, entry.filePath) : (e) => onDoubleClickFile(e, entry.filePath)}
          >
            <Icon>
              <FontAwesomeIcon icon={['fas', isDirectory ? 'folder' : 'file']}/>
            </Icon>
            <Span>{entry.fileName}/</Span>
          </Entry>
        );
      })}
    </List>
  );
};

export default FileBrowserList;