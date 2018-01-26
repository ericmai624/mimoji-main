import React, { Component } from 'react';
import { withTheme } from 'styled-components';

import FileBrowserListEntry from './file-list-entry/file-list-entry';
import FileBrowserButton from '../button/button';
import Search from './search/search';

import { Flex } from 'shared/components';

const fontColor = 'rgba(255,255,255,0.8)';
const boxShadow = '0 0 15px 5px rgba(0, 0, 0, 0.12)';

const Container = Flex.extend`
  width: 50%;
  height: 66.67%;
  background: inherit;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: ${boxShadow};
  position: relative;

  &::before {
    display: block;
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

const Main = Flex.extend`
  width: 100%;
  height: 100%;
  padding: 25px;
  color: ${fontColor};
  box-sizing: border-box;
  box-shadow: ${boxShadow};
  position: absolute;
`;

const Nav = Flex.extend`
  flex-shrink: 0;
`;

class FileBrowserList extends Component {
  render() {
    const { 
      theme,
      isPlayerEnabled,
      fileBrowser,
      isVisible,
      onDoubleClickDirectory,
      onDoubleClickFile,
      toggleFileBrowserDialog,
      navigateUpDir
    } = this.props;
    /* Solid background color if player is enabled */
    const backgroundColor = theme.bgColor.replace(/\d*\.*\d+\)$/, isPlayerEnabled ? '1)' : '0.25)');

    return (
      <Container align='center' justify='center' style={{ display: isVisible ? 'flex' : 'none' }}>
        <Main column justify='center' style={{ backgroundColor }}>
          <Nav align='center' justify='space-between'>
            <Search />
            <FileBrowserButton onClick={navigateUpDir} icon={['fas', 'chevron-up']} />
            <FileBrowserButton onClick={toggleFileBrowserDialog} icon={['fas', 'times']} />
          </Nav>
          <FileBrowserListEntry
            content={fileBrowser.displayedContent}
            isPending={fileBrowser.isPending}
            onDoubleClickDirectory={onDoubleClickDirectory} 
            onDoubleClickFile={onDoubleClickFile}
            navigateUpDir={navigateUpDir}
          />
        </Main>
      </Container>
    );
  }
}

export default withTheme(FileBrowserList);