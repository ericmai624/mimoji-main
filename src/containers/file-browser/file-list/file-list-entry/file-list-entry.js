import React from 'react';
import styled from 'styled-components';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import { Flex } from 'shared/components';

import Loader from 'components/loader/loader';

const iconSize = '24px';

const Container = Flex.extend`
  overflow: auto;
  flex-grow: 1;
`;

const List = styled.ul`
  list-style: none;
  opacity: ${({ isVisible }) => isVisible ? 1 : 0};
  width: 100%;
  height: 100%;
  transition: opacity 0.25s ease-in-out;
`;

const Entry = styled.li`
  display: flex;
  cursor: pointer;
  user-select: none;
  padding: 16px;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
  box-sizing: border-box;
  background: transparent;
  transition: color 0.25s ease-in-out;

  &:hover {
    background: linear-gradient(135deg, rgba(246,120,97,0.8), 60%, rgba(247,247,247,0.4));
    color: rgb(255,255,255);
  }
`;

const IconWrapper = styled.div`
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
    <Container>
      <Loader
        isVisible={isPending}
        size={36}
        color={'rgba(255,255,255,0.94)'}
        style={{ position: 'absolute', left: 'calc(50% - 18px)', top: 'calc(50% - 18px)' }}
      />
      <List isVisible={!isPending}>
        <Entry onDoubleClick={navigateUpDir}>
          <IconWrapper>
            <FontAwesomeIcon icon={['fas', 'folder']}/>
          </IconWrapper>
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
            <Entry
              key={i} 
              onDoubleClick={type === 'directory' ? 
                (e) => onDoubleClickDirectory(e, entry) : (e) => onDoubleClickFile(e, entry)}
            >
              <IconWrapper>
                <FontAwesomeIcon icon={icon}/>
              </IconWrapper>
              <Span>{name}/</Span>
            </Entry>
          );
        })}
      </List>
    </Container>
  );
};

export default FileBrowserListEntry;