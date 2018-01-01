import React, { Component, Fragment } from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { toggleFileBrowserDialog } from '../../actions/file-browser';
import { togglePlayerProps } from '../../actions/player';

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
    const { toggleFileBrowserDialog, togglePlayerProps, stream } = this.props;
    const addSub = (<FontAwesomeIcon icon={['fas', 'ellipsis-h']} size='2x'/>);
    const title = (<StyledSpan>{stream.subtitle.title}</StyledSpan>);

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
          <Btns className='flex' onClick={(e) => togglePlayerProps('SUBSETTINGS')}>
            <Wrapper className='flex flex-center'>
              <FontAwesomeIcon icon={['fas', 'times']}/>
            </Wrapper>
            <Wrapper className='flex flex-center'>
              <FontAwesomeIcon icon={['fas', 'check']}/>
            </Wrapper>
          </Btns>
        </ContainerR>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({ stream: state.stream });

const mapDispatchToProps = (dispatch) => ({
  toggleFileBrowserDialog: bindActionCreators(toggleFileBrowserDialog, dispatch),
  togglePlayerProps: bindActionCreators(togglePlayerProps, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SubSettings);