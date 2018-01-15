import React, { Fragment } from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import Loader from 'components/loader/loader-component';

import {
  LoaderWrapper,
  List,
  Entry,
  Icon,
  Span
} from './file-list-entry-styles';

const FileBrowserListEntry = ({ content, isFetching, onDoubleClickDirectory, onDoubleClickFile, navigateUpDir }) => {
  return (
    <Fragment>
      <LoaderWrapper isVisible={isFetching} className='flex flex-center'>
        <Loader className='flex flex-center' size={36} color={'black'}/> 
      </LoaderWrapper>
      <List isVisible={!isFetching}>
        <Entry className='flex pointer' onDoubleClick={navigateUpDir}>
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
            <Entry className='flex pointer'
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
    </Fragment>
  );
};

export default FileBrowserListEntry;