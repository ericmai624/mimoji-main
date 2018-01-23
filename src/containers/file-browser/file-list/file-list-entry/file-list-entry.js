import React from 'react';
import styled from 'styled-components';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import Loader from 'components/loader/loader';

const iconSize = '24px';

const Container = styled.div`
  overflow: auto;
  flex-grow: 1;
`;

const List = styled.ul`
  opacity: ${({ isVisible }) => isVisible ? 1 : 0};
  width: 100%;
  height: 100%;
  transition: opacity 0.25s ease-in-out;
`;

const Entry = styled.li`
  padding: 16px;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
  box-sizing: border-box;
  background: transparent;
  transition: all 0.25s ease-in-out;

  &:hover {
    background: linear-gradient(135deg, rgba(246,120,97,0.8), 60%, rgba(247,247,247,0.8));
    color: rgb(255,255,255);
  }
`;

const Icon = styled.div`
  width: ${iconSize};
  height: ${iconSize};
  font-size: ${iconSize};
  padding: 0;
`;

const Span = styled.span`
  margin-left: 12px;
  word-break: break-all;
`;


const FileBrowserListEntry = ({ content, isPending, onDoubleClickDirectory, onDoubleClickFile, navigateUpDir }) => {
  return (
    <Container className='flex relative'>
      <Loader
        className='flex-center absolute'
        size={36}
        color={'rgba(255,255,255,0.94)'}
        style={{ display: true ? 'flex' : 'none' }}
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