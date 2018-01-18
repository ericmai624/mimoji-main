import React from 'react';

import FileBrowserListEntry from './file-list-entry/file-list-entry-component';
import FileBrowserButton from '../button/button-component';

import {
  Container,
  Main,
  Nav,
  Directory
} from './file-list-styles';

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