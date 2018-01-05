import React, { Component } from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import FileBrowserListEntry from './file-list-entry/file-list-entry-component';

import {
  Container,
  Side,
  Main,
  Nav,
  NaviBtns,
  Directory
} from './file-list-styles';

const FileBrowserList = ({ 
  fileBrowser, 
  isVisible, 
  onDoubleClickDirectory, 
  onDoubleClickFile, 
  toggleFileBrowserDialog, 
  navigateUpDir 
}) => (
  <Container className='grid' isVisible={isVisible}>
    <Side className='flex flex-center'>
      <h2>File Browser</h2>
    </Side>
    <Main>
      <Nav className='flex flex-align-center flex-space-between'>
        <Directory className='ellipsis'>
          <span>{fileBrowser.directory}</span>
        </Directory>
        <NaviBtns className='flex flex-center' onClick={navigateUpDir}>
          <FontAwesomeIcon icon={['fas', 'chevron-up']}/>
        </NaviBtns>
        <NaviBtns className='flex flex-center'>
          <FontAwesomeIcon icon={['fas', 'sort-amount-down']}/>
        </NaviBtns>
        <NaviBtns className='flex flex-center'>
          <FontAwesomeIcon icon={['fas', 'filter']}/>
        </NaviBtns>
        <NaviBtns className='flex flex-center' onClick={toggleFileBrowserDialog}>
          <FontAwesomeIcon icon={['fas', 'times']}/>
        </NaviBtns>
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