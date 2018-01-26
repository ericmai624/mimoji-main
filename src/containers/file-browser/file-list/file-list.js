import React, { Component } from 'react';
import styled from 'styled-components';

import FileBrowserListEntry from './file-list-entry/file-list-entry';
import FileBrowserButton from '../button/button';

const fontColor = 'rgba(255,255,255,0.8)';
const boxShadow = '0 0 15px 5px rgba(0, 0, 0, 0.12)';

const Container = styled.div.attrs({
  hidden: ({ isVisible }) => !isVisible
})`
  ${'' /* display: ${({ isVisible }) => isVisible ? 'flex' : 'none'}; */}
  display: flex;
  width: 50%;
  height: 66.67%;
  flex-direction: row;
  background: inherit;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: ${boxShadow};

  &::before {
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
  background-color: ${({ theme, isPlayerEnabled }) =>
    theme.bgColor.replace(/\d*\.*\d+\)$/, isPlayerEnabled ? '1)' : '0.25)')};
  box-sizing: border-box;
  box-shadow: ${boxShadow};
  flex-direction: column;
`;

const Nav = styled.div`
  flex-shrink: 0;
  flex-direction: row;
`;

const SearchWrapper = styled.div`
  border: 1px solid ${({ isSearchFocused, theme }) => isSearchFocused ? theme.orange : fontColor};
  border-radius: 5px;
  padding: 8px 8px 8px 16px;
  width: calc(100% - 88px);
  height: 36px;
  box-sizing: border-box;
  color: rgba(255, 255, 255, 0.5);
  transition: all 0.25s ease-in-out;

  &:hover {
    cursor: text;
  }
`;

const Search = styled.input.attrs({
  name: 'search',
  autoComplete: 'off',
  value: ({ userInput }) => userInput
})`
  border: none;
  outline: none;
  width: calc(100% - 36px);
  font-size: 16px;

  &::placeholder {
    color: ${fontColor};
  }
`;

class FileBrowserList extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      isSearchFocused: false
    };

    this.onSearchFocus = this.onSearchFocus.bind(this);
    this.onSearchBlur = this.onSearchBlur.bind(this);
  }

  onSearchFocus(e) {
    e.preventDefault();
    this.setState({ isSearchFocused: true }, this.search.focus.bind(this.search));
  }

  onSearchBlur(e) {
    e.preventDefault();
    this.setState({ isSearchFocused: false }, this.search.blur.bind(this.search));
  }
  
  render() {
    const { 
      isPlayerEnabled,
      fileBrowser,
      isVisible,
      userInput,
      onSearchChange,
      onDoubleClickDirectory,
      onDoubleClickFile,
      toggleFileBrowserDialog,
      navigateUpDir
    } = this.props;
    const { isSearchFocused } = this.state;

    return (
      <Container className='flex-center relative' isVisible={isVisible} >
        <Main className='flex no-select absolute' isPlayerEnabled={isPlayerEnabled}>
          <Nav className='flex flex-align-center flex-space-between'>
            <SearchWrapper className='flex flex-center' 
              onMouseOver={this.onSearchFocus}
              onMouseLeave={this.onSearchBlur}
              isSearchFocused={isSearchFocused}
            >
              <Search
                className='ellipsis no-background white-font'
                focus={isSearchFocused}
                placeholder={isSearchFocused ? '' : fileBrowser.directory}
                onChange={onSearchChange}
                userInput={userInput}
                innerRef={el => this.search = el}
              >
              </Search>
              <FileBrowserButton
                icon={['fas', 'search']} 
                background={{ normal: 'transparent', hover: 'transparent' }}
                color={{ normal: isSearchFocused ? 'rgba(255,255,255,0.94)' : 'inherit' }}
                size={'22px'}
                style={{ cursor: 'text' }}
              />
            </SearchWrapper>
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

export default FileBrowserList;