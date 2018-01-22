import React from 'react';
import styled from 'styled-components';

import FileBrowserButton from '../button/button';

const white = 'rgb(255, 255, 255)';
const orange = 'rgba(228, 75, 54, 0.9)';
const height = 150;
const boxShadow = '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)';
const lightgray = 'rgba(219, 219, 219, 0.5)';

const Container = styled.div`
  visibility: ${({ isVisible }) => isVisible ? 'visible' : 'hidden'};
  opacity : ${({ isVisible }) => isVisible ? 1 : 0};
  width: 360px;
  height: ${height}px;
  left: calc(50% - 180px);
  top: calc(50% - ${height / 2}px);
  background: ${white};
  box-shadow: ${boxShadow};
  transition: opacity 0.2s ease-in-out;
`;

const Title = styled.div`
  width: 100%;
  height: 50px;
  padding: 0 10px;
  font-size: 18px;
  box-sizing: border-box;
  color: ${white};
  background: ${orange};
`;

const Options = styled.ul`
  width: 100%;
  height: ${height - 50}px;
  box-sizing: border-box;
`;

const Option = styled.li`
  width: 100%;
  height: ${(height - 50) / 2}px;
  padding: 0 10px;
  box-sizing: border-box;
  transition: background 0.2s ease-in-out;

  &:hover {
    background: ${lightgray};
  }
`;
const CastOptions = ({ isVisible, cast, setPlayerType, toggleCastOptions }) => {
  return (
    <Container className='absolute' isVisible={isVisible}>
      <Title className='flex flex-align-center flex-space-between no-select'>
        <span>Stream Options</span>
        <FileBrowserButton
          onClick={toggleCastOptions}
          icon={['fas', 'times']}
          color={{ normal: 'rgb(255, 255, 255)', hover: 'rgb(233, 63, 60)'}}
        />
      </Title>
      <Options className='no-list-style'>
        <Option onClick={e => setPlayerType(true)} className='flex flex-align-center pointer'>
          Play on Chromecast
        </Option>
        <Option onClick={e => setPlayerType(false)} className='flex flex-align-center pointer'>
          Play in the browser
        </Option>
      </Options>
    </Container>
  );
};

export default CastOptions;