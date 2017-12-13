import React, { Component } from 'react';
import { Provider } from 'react-redux';
import styled from 'styled-components';

import { store } from './reducers';

const Root = styled.div``;

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Root>
          Hello!
        </Root>
      </Provider>
    );
  }
}

export default App;
