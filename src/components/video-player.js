import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: block;
  width: 800px;
  height: 450px;
  position: fixed;
  left: 50%;
  top: 50%;
  margin-left: -400px;
  margin-top: -225px;
  z-index: 100;
  background: black;
`;

const VideoPlayer = ({ video }) => {
  return (
    <Wrapper>
      <video controls autoPlay width='100%' height='100%' playsInline={true}>
        <source src={video.path} type='video/mp4'></source>
      </video>
    </Wrapper>
  );
};

export default VideoPlayer;