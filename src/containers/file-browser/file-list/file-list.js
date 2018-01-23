import React from 'react';
import styled from 'styled-components';

import FileBrowserListEntry from './file-list-entry/file-list-entry';
import FileBrowserButton from '../button/button';

const fontColor = 'rgba(255,255,255,0.8)';
const boxShadow = '0 0 15px 5px rgba(0, 0, 0, 0.12)';

const Container = styled.div`
  display: ${({ isVisible }) => isVisible ? 'flex' : 'none'};
  width: 50%;
  height: 66.67%;
  flex-direction: row;
  background: ${({ isPlayerEnabled }) => isPlayerEnabled ? 'rgba(255, 255, 255, 1)' : 'inherit'};
  overflow: hidden;
  border-radius: 10px;
  box-shadow: ${boxShadow};

  &:before {
    content: '';
    background: inherit;
    position: absolute;
    width: calc(100% + 180px);
    height: calc(100% + 180px);
    /* Double blur length to cover full background */
    left: -90px;
    top: -90px;
    box-shadow: inset 0 0 200px 25px rgba(255,255,255,0.35);
    filter: blur(45px);
  }
`;

const Main = styled.div`
  width: 100%;
  height: 100%;
  padding: 25px;
  color: ${fontColor};
  background-color: rgba(65,68,86,.25);
  box-sizing: border-box;
  box-shadow: ${boxShadow};
  flex-direction: column;
`;

const Nav = styled.div`
  flex-shrink: 0;
  flex-direction: row;
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
  <Container className='flex-center relative' isVisible={isVisible} isPlayerEnabled={isPlayerEnabled}>
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