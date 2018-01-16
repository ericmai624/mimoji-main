import React, { Component } from 'react';

import Loader from 'components/loader/loader-component';

import { Container } from './loading-screen-styles';

class Loading extends Component {
  render() {
    const { isInitializing } = this.props;
    return (
      <Container 
        id='loading' className='flex flex-center absolute full-size no-select' isVisible={isInitializing}>
        <Loader size={42} />
      </Container>
    );
  }
}

export default Loading;