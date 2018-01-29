import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from 'styled-components';

import FileBrowserListEntry from './file-list-entry/file-list-entry';

import { Flex } from 'shared/components';

const Main = Flex.extend`
  width: 50%;
  height: 100%;
  padding: 10px 0 25px 25px;
  color: #2c3e50;
  background: inherit;
  box-sizing: border-box;
  overflow: hidden;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  transition: right 0.5s ease-in-out;
`;

class FileBrowserList extends Component {

  static propTypes = {
    fileBrowser: PropTypes.object.isRequired,
    isVisible: PropTypes.bool.isRequired,
    onDoubleClickDirectory: PropTypes.func.isRequired,
    onDoubleClickFile: PropTypes.func.isRequired,
    toggleFileBrowserDialog: PropTypes.func.isRequired,
    navigateUpDir: PropTypes.func.isRequired
  }

  render() {
    const { 
      fileBrowser,
      isVisible,
      onDoubleClickDirectory,
      onDoubleClickFile,
      navigateUpDir
    } = this.props;

    return (
      <Main column justify='center' style={{ right: fileBrowser.isVisible ? '50px' : '-50%' }}>
        <FileBrowserListEntry
          content={fileBrowser.displayedContent}
          isPending={fileBrowser.isPending}
          onDoubleClickDirectory={onDoubleClickDirectory} 
          onDoubleClickFile={onDoubleClickFile}
          navigateUpDir={navigateUpDir}
        />
      </Main>
    );
  }
}

export default withTheme(FileBrowserList);