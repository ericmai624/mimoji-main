import React from 'react';
import styled, { withTheme } from 'styled-components';

import { Flex } from 'src/shared/components';

import FileBrowserButton from '../button/button';

const white = 'rgb(255, 255, 255)';
const height = 150;
const boxShadow = '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)';
const lightgray = 'rgba(219, 219, 219, 0.5)';

const Container = styled.div`
  position: absolute;
  visibility: ${({ isVisible }) => isVisible ? 'visible' : 'hidden'};
  opacity : ${({ isVisible }) => isVisible ? 1 : 0};
  width: 360px;
  height: ${height}px;
  left: calc(50% - 180px);
  top: calc(50% - ${height / 2}px);
  background: ${white};
  box-shadow: ${boxShadow};
  transition: opacity 0.25s ease-in-out;
`;

const Title = Flex.extend`
  width: 100%;
  height: 50px;
  padding: 0 10px;
  font-size: 18px;
  font-weight: bold;
  box-sizing: border-box;
  color: ${white};
  user-select: none;
  background: ${({ theme }) => theme['wet_asphalt']};
`;

const Options = styled.ul`
  list-style: none;
  width: 100%;
  height: ${height - 50}px;
  box-sizing: border-box;
`;

const Option = styled.li`
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 100%;
  height: ${(height - 50) / 2}px;
  padding: 0 10px;
  box-sizing: border-box;
  transition: background 0.2s ease-in-out;

  &:hover {
    background: ${lightgray};
  }
`;
const CastOptions = ({ theme, isVisible, cast, setPlayerType, toggleCastOptions }) => {
  return (
    <Container isVisible={isVisible}>
      <Title align='center' justify='space-between'>
        <span>Stream Options</span>
        <FileBrowserButton
          onClick={toggleCastOptions}
          icon={['fas', 'times']}
          color={{ normal: '#fff', hover: theme['turquoise'] }}
        />
      </Title>
      <Options>
        <Option onClick={e => setPlayerType(e, true)}>
          Play on Chromecast
        </Option>
        <Option onClick={e => setPlayerType(e, false)}>
          Play in the browser
        </Option>
      </Options>
    </Container>
  );
};

export default withTheme(CastOptions);