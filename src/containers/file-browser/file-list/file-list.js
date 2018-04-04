import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from 'styled-components';

import FileBrowserListEntry from './file-list-entry/file-list-entry';

import { Flex } from 'src/shared/components';

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

const FileBrowserList = ({
  fileBrowser: { displayedContent, isPending },
  onDoubleClickDirectory, onDoubleClickFile,
  navigateUpDir 
}) => (
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

FileBrowserList.propTypes = {
  fileBrowser: PropTypes.object.isRequired,
  onDoubleClickDirectory: PropTypes.func.isRequired,
  onDoubleClickFile: PropTypes.func.isRequired,
  navigateUpDir: PropTypes.func.isRequired
};

export default withTheme(FileBrowserList);