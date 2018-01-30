import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import FileBrowserButton from 'containers/file-browser/button/button';

import { modifyDisplayedContent } from 'stores/file-browser';

import { Flex } from 'shared/components';

const SearchWrapper = Flex.extend`
  position: absolute;
  right: 50px;
  bottom: 0;
  padding: 0 15px;
  height: 40px;
  border: none;
  border-radius: 20px;
  transform: translateY(50%);
  vertical-align: middle;
  box-sizing: border-box;
  background: #fff;
  caret-color: #34495e;
  box-shadow: 1px 1px 1px 1px rgba(0,0,0,0.25), -1px 1px 1px 1px rgba(0,0,0,0.25);
  z-index: 50;
  transition: all 0.25s ease-in-out;

  &:hover {
    cursor: text; /* change cursor to text as long as the curor is over SearchWrapper */
  }
`;

const SearchInput = styled.input.attrs({
  name: 'search',
  autoComplete: 'off',
})`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  font-size: 16px;
  font-weight: bold;
  color: #34495e;
  background: transparent;
  box-sizing: content-box;
  overflow: hidden;
  text-overflow: ellipsis;

  &::placeholder {
    color: #bdc3c7;
  }
`;

const Shadow = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  font-size: 16px;
  font-weight: bold;
  white-space: pre;
  visibility: hidden;
  height: 0;
`;

class Search extends Component {

  static propTypes = {
    content: PropTypes.array.isRequired,
    modifyDisplayedContent: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    
    this.state = {
      userInput: '',
      inputWidth: 150
    };

    this.focusInput = this.focusInput.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.filterContent = this.filterContent.bind(this);
    this.resizeInputIfNeeded = this.resizeInputIfNeeded.bind(this);
    this.resetSearchInput = this.resetSearchInput.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.directory !== this.props.directory) this.resetSearchInput();
  }

  focusInput(e) {
    e.preventDefault();
    if (!this.search) return; // input is not mounted

    this.search.focus();
  }

  onSearchChange(e) {
    this.setState({ userInput: e.target.value }, () => {
      this.filterContent();
      this.resizeInputIfNeeded();
    });
  }

  filterContent() {
    const { modifyDisplayedContent, content } = this.props;
    const { userInput } = this.state;
    const regex = new RegExp(escape(userInput), 'i');
    const newContent = content.filter(item => regex.test(item.name));
    
    modifyDisplayedContent(newContent);
  }

  resizeInputIfNeeded() {
    if (!this.search || !this.shadow) return;

    let shadowWidth = this.shadow.clientWidth + 32; // one character extra width
    let searchWidth = this.search.clientWidth;
    if (shadowWidth >= searchWidth) this.setState({ inputWidth: shadowWidth + 66 }); // extra 66px because of padding and search icon
  }

  resetSearchInput() {
    this.setState({ userInput: '' });
  }
  
  render() {
    const { userInput, inputWidth } = this.state;

    return (
      <SearchWrapper 
        align='center'
        justify='center'
        onClick={this.focusInput}
        style={{ width: `${inputWidth}px` }}
      >
        <SearchInput
          placeholder='Search'
          onChange={this.onSearchChange}
          value={userInput}
          innerRef={el => this.search = el}
        >
        </SearchInput>
        <FileBrowserButton
          icon={['fas', 'search']} 
          background={{ normal: 'transparent', hover: 'transparent' }}
          color={{ normal: '#4c6275' }}
          size={'12px'}
          style={{ cursor: 'text' }}
        />
        <Shadow innerRef={el => this.shadow = el}>{userInput}</Shadow>
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