import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import Loader from 'components/loader/loader-component';

import {
  Container,
  List,
  Entry,
  Icon,
  Span
} from './file-list-entry-styles';

const FileBrowserListEntry = ({ content, isPending, onDoubleClickDirectory, onDoubleClickFile, navigateUpDir }) => {
  return (
    <Container className='flex relative'>
      <Loader
        className='flex flex-center absolute'
        size={36}
        color={'black'}
        style={{
          visibility: isPending ? 'visible' : 'hidden',
          opacity: isPending ? 1 : 0
        }}
      />
      <List className='no-list-style' isVisible={!isPending}>
        <Entry className='flex pointer no-select' onDoubleClick={navigateUpDir}>
          <Icon>
            <FontAwesomeIcon icon={['fas', 'folder']}/>
          </Icon>
          <Span>..</Span>
        </Entry>
        {content.map((entry, i) => {
          let { name, type } = entry;
          let icon;
          if (type === 'directory') icon = ['fas', 'folder'];
          else if (type === 'video') icon = ['fas', 'film'];
          else if (type === 'subtitle') icon = ['fas', 'file-alt'];
          else icon = ['fas', 'file'];

          return (
            <Entry className='flex pointer no-select'
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
    </Container>
  );
};

export default FileBrowserListEntry;