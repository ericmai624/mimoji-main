import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import { Flex } from 'shared/components';

const Container = Flex.extend`
  position: absolute;
  width: 100%;
  height: 80px;
  padding-right: 25px;
  left: 0;
  bottom: 0;
  user-select: none;
  color: #FFF;
  font-size: 32px;
  box-sizing: border-box;
  background: #34495e;
  transition: transform 0.5s ease-in-out;
`;

const YouAreHere = Flex.extend`
  position: absolute;
  top: 0;
  left: 25px;
  width: 250px;
  height: 32px;
  border-radius: 16px;
  transform: translateY(-50%);
  color: #34495e;
  font-size: 15px;
  font-weight: bold;
  user-select: none;
  background: #FFF;
  box-shadow: 1px 1px 1px 1px rgba(0,0,0,0.25), -1px 1px 1px 1px rgba(0,0,0,0.25);
`;

const IconWrapper = Flex.extend`
  width: 28px;
  height: 17px;
  font-size: 15px;
`;

const Text = styled.div`
  width: calc(100% - 40px);
  height: 100%;
  line-height: 50px;
  vertical-align: middle;
  padding: 15px 25px;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const GPS = styled.span`
  cursor: pointer;
  transition: color 0.25s ease-in-out;

  &:hover {
    color: #1abc9c;
  }
`;

const CloseWrapper = Flex.extend`
  font-size: 40px;
  width: 40px;
  height: 40px;
  box-sizing: border-box;
  cursor: pointer;
  transition: color 0.25s ease-in-out;

  &:hover {
    color: #1abc9c;
  }
`;

class Nav extends Component {

  static propTypes = {
    directory: PropTypes.object,
    isVisible: PropTypes.bool.isRequired,
    toggleFileBrowserDialog: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    
    this.navigate = this.navigate.bind(this);
  }
  
  navigate(e, index) {
    const { io } = window;
    const { directory } = this.props;
    const dir = directory.folders.slice(0, index + 1).join(directory.sep);

    io.emit('request content', dir);
  } 

  render() {
    const { directory, isVisible, toggleFileBrowserDialog } = this.props;
    let location;
    if (directory) {
      location = directory.folders.map((folder, i) => {
        return (
          <span key={i}>
            <GPS onClick={e => this.navigate(e, i)}>
              {folder}
            </GPS>
            {directory.sep}
          </span>
        );
      });
    } else {
      location = '';
    }

    return (
      <Container align='center' justify='flex-start' style={{ transform: isVisible ? 'none' : 'translateY(112px)' }}>
        <YouAreHere align='center' justify='center'>
          <IconWrapper align='center' justify='flex-start'>
            <FontAwesomeIcon icon={['fas', 'map-marker-alt']} />
          </IconWrapper>
          <span>You are here</span>
        </YouAreHere>
        <Text>{location}</Text>
        <CloseWrapper align='center' justify='center' onClick={toggleFileBrowserDialog}>
          <FontAwesomeIcon icon={['fas', 'times']} />
        </CloseWrapper>
      </Container>
    );
  }
}

export default Nav;