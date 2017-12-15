import React, { Component } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  grid-row: 1;
`;

class Cast extends Component {
  componentDidMount() {
    this.renderCastButton();
  }
  
  renderCastButton() {
    const castBtn = document.createElement('button', 'google-cast-button');
    const { style } = castBtn;
    style.width = '40px';
    style.height = '40px';
    style.display = 'inline-block';
    style.border = '0';
    style.outline = 'none';
    style.cursor = 'pointer';
    style.background = 'transparent';
    document.querySelector('#cast').appendChild(castBtn);
  }

  render() {
    return (
      <Wrapper id='cast'>
        
      </Wrapper>
    );
  }
}

export default Cast;