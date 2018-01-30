import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from 'styled-components';

import FileBrowserListEntry from './file-list-entry/file-list-entry';

import { Flex } from 'shared/components';

const Main = Flex.extend`
  width: 66.667%;
  height: 100%;
  padding: 10px 0 25px 25px;
  background: inherit;
  box-sizing: border-box;
  overflow: hidden;
  position: absolute;
  top: 50%;
  right: 75px;
  transform: translateY(-50%);
  transition: transform 0.5s ease-in-out;
`;

class FileBrowserList extends Component {

  static propTypes = {
    fileBrowser: PropTypes.object.isRequired,
    onDoubleClickDirectory: PropTypes.func.isRequired,
    onDoubleClickFile: PropTypes.func.isRequired,
    navigateUpDir: PropTypes.func.isRequired
  }

  render() {
    const { 
      fileBrowser,
      onDoubleClickDirectory,
      onDoubleClickFile,
      navigateUpDir
    } = this.props;
    const { displayedContent, isVisible, isPending } = fileBrowser;

    return (
      <Main column justify='center' style={{ transform: isVisible ? 'translate(0, -50%)' : 'translate(calc(100% + 75px), -50%)' }}>
        <FileBrowserListEntry
          content={displayedContent}
          isPending={isPending}
          onDoubleClickDirectory={onDoubleClickDirectory} 
          onDoubleClickFile={onDoubleClickFile}
          navigateUpDir={navigateUpDir}
        />
      </Main>
    );
  }
}

export default withTheme(FileBrowserList);