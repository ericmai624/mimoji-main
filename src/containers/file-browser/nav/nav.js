import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import { Flex } from 'shared/components';

const Container = Flex.extend`
  position: absolute;
  width: 100%;
  height: 80px;
  left: 0;
  user-select: none;
  color: #FFF;
  padding: 15px 25px;
  font-size: 32px;
  box-sizing: border-box;
  background: #2c3e50;
  transition: all 0.5s ease-in-out;
`;

const YouAreHere = Flex.extend`
  position: absolute;
  top: 0;
  left: 25px;
  width: 280px;
  height: 32px;
  border-radius: 16px;
  transform: translateY(-50%);
  color: #2c3e50;
  font-size: 15px;
  font-weight: bold;
  user-select: none;
  background: #FFF;
`;

const IconWrapper = Flex.extend`
  width: 30px;
  height: 17px;
  font-size: 15px;
`;

class Nav extends Component {

  static propTypes = {
    location: PropTypes.string.isRequired,
    isVisible: PropTypes.bool.isRequired
  }

  render() {
    const { location, isVisible } = this.props;
    return (
      <Container align='center' justify='flex-start' style={{ bottom: isVisible ? '0' : '-112px' }}>
        <YouAreHere align='center' justify='center'>
          <IconWrapper align='center' justify='flex-start'>
            <FontAwesomeIcon icon={['fas', 'map-marker-alt']} />
          </IconWrapper>
          <span>You are here</span>
        </YouAreHere>
        {location}
      </Container>
    );
  }
}

export default Nav;