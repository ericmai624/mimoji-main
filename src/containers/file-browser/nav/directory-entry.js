import React, { PureComponent } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const GPS = styled.span`
  cursor: pointer;
  transition: color 0.25s ease-in-out;

  &:hover {
    color: ${({ theme }) => theme['turquoise']};
  }
`;

class DirectoryEntry extends PureComponent {
  handleClick = (e) => {
    const { onClick, index } = this.props;

    onClick(index);
  }

  render() {
    const { folder, sep } = this.props;

    return (
      <span>
        <GPS onClick={this.handleClick}>
          {folder}
        </GPS>
        {sep}
      </span>
    );
  }
}

export default DirectoryEntry;
