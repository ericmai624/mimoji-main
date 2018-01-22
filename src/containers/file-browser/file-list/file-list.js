import React from 'react';
import styled from 'styled-components';

import FileBrowserListEntry from './file-list-entry/file-list-entry';
import FileBrowserButton from '../button/button';

const fontColor = 'rgb(0, 0, 0)';
const bg = 'rgba(255, 255, 255, 0.25)';
const boxShadow = '0 0 15px 5px rgba(0, 0, 0, 0.12)';

const Container = styled.div`
  display: ${({ isVisible }) => isVisible ? 'flex' : 'none'};
  width: 700px;
  height: 80%;
  max-height: 600px;
  flex-direction: row;
  background: ${({ isPlayerEnabled }) => isPlayerEnabled ? 'rgba(255, 255, 255, 1)' : 'inherit'};
  overflow: hidden;
  border-radius: 5px;
  box-shadow: ${boxShadow};

  &:before {
    content: '';
    width: 750px;
    height: calc(100% + 50px);
    background: inherit;
    position: absolute;
    left: -25px;
    right: 0;
    top: -25px;
    bottom: 0;
    box-shadow: inset 0 0 0 700px rgba(255,255,255,0.3);
    filter: blur(15px);
  }
`;

const Main = styled.div`
  width: 700px;
  height: 100%;
  padding: 25px;
  left: calc(50% - 350px);
  top: 50%;
  transform: translateY(-50%);
  color: ${fontColor};
  background-color: ${bg};
  box-sizing: border-box;
  box-shadow: ${boxShadow};
  flex-direction: column;
`;

const Nav = styled.div`
  flex-direction: row;
  flex-shrink: 0;
`;

const Directory = styled.div`
  border: 1px solid ${fontColor};
  padding: 8px 16px;
  width: 60%;
  height: auto;
  min-height: 34.5px;
  box-sizing: border-box;

  &:hover {
    word-wrap: break-word;
    white-space: unset;
  }
`;



const FileBrowserList = ({ 
  isPlayerEnabled, fileBrowser, isVisible, onDoubleClickDirectory, onDoubleClickFile, toggleFileBrowserDialog, navigateUpDir }) => (
  <Container className='relative' isVisible={isVisible} isPlayerEnabled={isPlayerEnabled}>
    <Main className='flex no-select absolute'>
      <Nav className='flex flex-align-center flex-space-between'>
        <Directory className='ellipsis'>
          <span>{fileBrowser.directory}</span>
        </Directory>
        <FileBrowserButton onClick={navigateUpDir} icon={['fas', 'chevron-up']} />
        <FileBrowserButton icon={['fas', 'sort-amount-down']} />
        <FileBrowserButton icon={['fas', 'filter']} />
        <FileBrowserButton onClick={toggleFileBrowserDialog} icon={['fas', 'times']} />
      </Nav>
      <FileBrowserListEntry
        content={fileBrowser.content}
        isPending={fileBrowser.isPending}
        onDoubleClickDirectory={onDoubleClickDirectory} 
        onDoubleClickFile={onDoubleClickFile}
        navigateUpDir={navigateUpDir}
      />
    </Main>
  </Container>
);

export default FileBrowserList;