import React from 'react';
import styled from 'styled-components';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import { Flex } from 'shared/components';

import Loader from 'components/loader/loader';

const Container = Flex.extend`
  overflow: auto;
  flex-grow: 1;
  width: calc(100% + 20px);
`;

const List = styled.ul`
  width: 100%;
  list-style: none;
  opacity: ${({ isVisible }) => isVisible ? 1 : 0};
  transition: opacity 0.2s ease-in-out;
`;

const Entry = styled.li`
  display: flex;
  width: calc(100% - 22px);
  margin-top: 5px;
  cursor: pointer;
  user-select: none;
  padding: 16px;
  font-weight: 700;
  color: #2c3e50;
  border: 1px solid #2c3e50;
  align-items: center;
  box-sizing: border-box;
  transition: color 0.25s ease-in-out;

  &:hover {
    color: #fff;
    background: #2c3e50;
  }
`;

const IconWrapper = Flex.extend`
  width: 60px;
  height: 60px;
  font-size: 40px;
`;

const FileName = Flex.extend`
  margin-left: 25px;
  overflow: hidden;
  word-break: break-all;
`;

const FileBrowserListEntry = ({ content, isPending, onDoubleClickDirectory, onDoubleClickFile, navigateUpDir }) => {
  return (
    <Container justify='flex-start'>
      <List isVisible={!isPending}>
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
              <IconWrapper align='center' justify='center'>
                <FontAwesomeIcon icon={icon}/>
              </IconWrapper>
              <FileName align='center' justify='flex-start'>{name}/</FileName>
            </Entry>
          );
        })}
        <Loader
          isVisible={isPending}
          size={36}
          color={'rgba(255,255,255,0.94)'}
          style={{ position: 'absolute', left: 'calc(50% - 18px)', top: 'calc(50% - 18px)' }}
        />
      </List>
    </Container>
  );
};

export default FileBrowserListEntry;