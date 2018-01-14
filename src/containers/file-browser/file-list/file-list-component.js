import React from 'react';

import FileBrowserListEntry from './file-list-entry/file-list-entry-component';
import FileBrowserButton from '../button/button-component';

import {
  Container,
  Side,
  Main,
  Nav,
  Directory
} from './file-list-styles';

const FileBrowserList = ({ 
  fileBrowser, isVisible, onDoubleClickDirectory, onDoubleClickFile, toggleFileBrowserDialog, navigateUpDir }) => (
  <Container className='grid' isVisible={isVisible}>
    <Side className='flex flex-center'>
      <h2>File Browser</h2>
    </Side>
    <Main>
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
        onDoubleClickDirectory={onDoubleClickDirectory} 
        onDoubleClickFile={onDoubleClickFile}
        navigateUpDir={navigateUpDir}
      />
    </Main>
  </Container>
);

export default FileBrowserList;