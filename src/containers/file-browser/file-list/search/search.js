import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import FileBrowserButton from 'containers/file-browser/button/button';

import { modifyDisplayedContent } from 'stores/file-browser';

import { Flex } from 'shared/components';

const SearchWrapper = Flex.extend`
  border-width: 1px;
  border-style: solid;
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

const SearchInput = styled.input.attrs({
  name: 'search',
  autoComplete: 'off',
})`
  border: none;
  outline: none;
  width: calc(100% - 36px);
  font-size: 16px;
  color: #fff;
  background: transparent;
  overflow: hidden;
  text-overflow: ellipsis;

  &::placeholder {
    color: rgba(255,255,255,0.8);
  }
`;

class Search extends Component {

  static propTypes = {
    directory: PropTypes.string.isRequired,
    content: PropTypes.array.isRequired,
    modifyDisplayedContent: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    
    this.state = {
      userInput: '',
      isSearchFocused: false
    };

    this.onSearchFocus = this.onSearchFocus.bind(this);
    this.onSearchBlur = this.onSearchBlur.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.filterContent = this.filterContent.bind(this);
    this.resetSearchInput = this.resetSearchInput.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.directory !== this.props.directory) this.resetSearchInput();
  }
  

  onSearchFocus(e) {
    e.preventDefault();
    this.setState({ isSearchFocused: true }, this.search.focus.bind(this.search));
  }

  onSearchBlur(e) {
    e.preventDefault();
    this.setState({ isSearchFocused: false }, this.search.blur.bind(this.search));
  }

  onSearchChange(e) {
    this.setState({ userInput: e.target.value }, this.filterContent);
  }

  filterContent() {
    const { modifyDisplayedContent, content } = this.props;
    const { userInput } = this.state;
    const regex = new RegExp(userInput, 'i');
    const newContent = content.filter(item => item.name.match(regex));
    
    modifyDisplayedContent(newContent);
  }

  resetSearchInput() {
    this.setState({ userInput: '' });
  }
  
  render() {
    const { theme, directory } = this.props;
    const { userInput, isSearchFocused } = this.state;

    return (
      <SearchWrapper 
        align='center'
        justify='center'
        onMouseOver={this.onSearchFocus}
        onMouseLeave={this.onSearchBlur}
        style={{ borderColor: isSearchFocused ? theme.orange : 'rgba(255,255,255,0.8)' }}
      >
        <SearchInput
          placeholder={isSearchFocused ? '' : directory}
          onChange={this.onSearchChange}
          value={userInput}
          innerRef={el => this.search = el}
        >
        </SearchInput>
        <FileBrowserButton
          icon={['fas', 'search']} 
          background={{ normal: 'transparent', hover: 'transparent' }}
          color={{ normal: isSearchFocused ? 'rgba(255,255,255,0.94)' : 'inherit' }}
          size={'22px'}
          style={{ cursor: 'text' }}
        />
      </SearchWrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  directory: state.fileBrowser.directory,
  content: state.fileBrowser.content
});

const mapDispatchToProps = (dispatch) => ({
  modifyDisplayedContent: bindActionCreators(modifyDisplayedContent, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Search));