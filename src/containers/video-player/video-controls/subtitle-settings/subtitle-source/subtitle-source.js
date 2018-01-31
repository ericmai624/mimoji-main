import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import { Flex, Button } from 'shared/components';

const Container = Flex.extend`
  width: 100%;
  height: 100%;
  position: relative;
  box-sizing: border-box;
  font-size: 18px;
`;

const Select = Button.extend`
  position: absolute;
  top: 0;
  right: 0;
  font-size: 28px;
  box-sizing: border-box;
  cursor: pointer;
  color: #fff;
  background: ${({ theme }) => theme['wet_asphalt']};
  transition: color 0.25s ease-in-out;

  &:hover {
    color: ${({ theme }) => theme['turquoise']};
    background: ${({ theme }) => theme['midnight_blue']};
  }
`;

const SubtitleSource = ({ title, toggleFileBrowserDialog }) => {
  return (
    <Container align='center' justify='space-between'>
      <span>{title}</span>
      <Select size='48px' onClick={toggleFileBrowserDialog}>
        <FontAwesomeIcon icon={['fas', 'arrow-right']} />
      </Select>
    </Container>
  );
};

SubtitleSource.propTypes = {
  title: PropTypes.string.isRequired,
  toggleFileBrowserDialog: PropTypes.func.isRequired
};

export default SubtitleSource;