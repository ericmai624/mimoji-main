import React, { Component } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  z-index: 5000;
  width: 40px;
  height: 40px;
  top: 20px;
  left: 20px;
  background: transparent;
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
    // style.zIndex = '10000';
    document.getElementById('cast-wrapper').appendChild(castBtn);

    let script = document.createElement('script');
    script.src = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1';
    script.type = 'text/javascript';
    // script.crossorigin = 'anonymous';
    document.getElementById('cast-wrapper').insertAdjacentElement('beforeend', script);
  }

  render() {
    return (
      <Wrapper id='cast-wrapper'
        className='flex flex-center absolute'>
      </Wrapper>
    );
  }
}

export default Cast;