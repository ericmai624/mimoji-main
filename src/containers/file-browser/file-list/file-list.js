import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from 'styled-components';

import FileBrowserListEntry from './file-list-entry/file-list-entry';

import { Flex } from 'shared/components';

const Main = Flex.extend`
  width: calc(61.8% - 75px);
  height: 100%;
  padding: 12px 0;
  background: inherit;
  box-sizing: border-box;
  overflow: hidden;
  position: absolute;
  top: 50%;
  right: 75px;
  transform: translateY(-50%);
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
      <Main column justify='center'>
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