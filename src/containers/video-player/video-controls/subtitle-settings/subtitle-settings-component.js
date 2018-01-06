import React, { Component, Fragment } from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import {
  ContainerR,
  ContainerS,
  Preference,
  Option,
  StyledDiv,
  StyledSpan,
  Btns,
  Wrapper
} from './subtitle-settings-styles';

class SubSettings extends Component {
  render() {
    const { toggleFileBrowserDialog, toggleSubSettings } = this.props;
    const addSub = (<FontAwesomeIcon icon={['fas', 'ellipsis-h']} size='2x'/>);

    return (
      <Fragment>
        <ContainerS className='flex flex-center absolute'>
          <StyledDiv>
            <h2>Language</h2>
            <br/>
            <StyledSpan onClick={toggleFileBrowserDialog}>{addSub}</StyledSpan>
          </StyledDiv>
        </ContainerS>
        <ContainerR className='absolute white-font'>
          <Preference>
            <Option className='ellipsis'>
              <span>Encoding: </span>
            </Option>
            <Option className='ellipsis'>
              <span>Offset: </span>
            </Option>
          </Preference>
          <Btns className='flex' onClick={toggleSubSettings}>
            <Wrapper className='flex flex-center transition-color'>
              <FontAwesomeIcon icon={['fas', 'times']}/>
            </Wrapper>
            <Wrapper className='flex flex-center transition-color'>
              <FontAwesomeIcon icon={['fas', 'check']}/>
            </Wrapper>
          </Btns>
        </ContainerR>
      </Fragment>
    );
  }
}

export default SubSettings;