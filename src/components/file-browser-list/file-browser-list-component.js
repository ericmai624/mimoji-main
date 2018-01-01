import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import {
  List,
  Entry,
  Icon,
  Span
} from './file-browser-list-styles';

const FileBrowserList = ({ content, onDoubleClickDirectory, onDoubleClickFile, navigateUpDir }) => {
  return (
    <List>
      <Entry className='flex' onDoubleClick={navigateUpDir}>
        <Icon>
          <FontAwesomeIcon icon={['far', 'folder']}/>
        </Icon>
        <Span>..</Span>
      </Entry>
      {content.map((entry, i) => {
        let { name, type } = entry;
        let icon;
        if (type === 'directory') icon = ['far', 'folder'];
        else if (type === 'video') icon = ['fas', 'film'];
        else if (type === 'subtitle') icon = ['far', 'file-alt'];
        else icon = ['far', 'file'];

        return (
          <Entry className='flex'
            key={i} 
            onDoubleClick={type === 'directory' ? (e) => onDoubleClickDirectory(e, entry) : (e) => onDoubleClickFile(e, entry)}
          >
            <Icon>
              <FontAwesomeIcon icon={icon}/>
            </Icon>
            <Span>{name}/</Span>
          </Entry>
        );
      })}
    </List>
  );
};

export default FileBrowserList;