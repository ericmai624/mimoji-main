import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { changeTextTrackOffset } from 'stores/text-track';
 
const OffsetInputWrapper = styled.div`
  flex-direction: row;
`;

const OffsetInput = styled.input.attrs({
  name: 'offset',
  autoComplete: 'off',
})`
  display: inline-block;
  width: 50px;
  outline: none;
  border: none;
  border-bottom: 1px solid rgba(255,255,255,0.8);
  padding: 0 2px;
  color: rgba(255,255,255,0.8);
  background: transparent;
  box-sizing: border-box;
  transition: width 0.25s ease-in-out;
  -moz-appearance: textfield;

  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }
`;

const Steps = styled.div`
  flex-direction: column;
`;

class SubtitleOffset extends Component {

  static propTypes = {
    offset: PropTypes.number.isRequired,
    changeTextTrackOffset: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.onInputChange = this.onInputChange.bind(this);
  }

  onInputChange(e) {
    e.preventDefault();
    const input = e.target.value;
    const offset = parseFloat(input);

  }
  
  render() {
    const { offset } = this.props;

    return (
      <OffsetInputWrapper className='flex flex-align-center'>
        <span>Offset&nbsp;<span>(seconds)</span>:&nbsp;</span>
        <OffsetInput
          placeholder={offset.toFixed(3)}
          value={offset}
          onChange={this.onInputChange}
          innerRef={el => this.offsetInput = el}
        />
        <Steps className='flex flex-align-center flex-space-around'>
        
        </Steps>
      </OffsetInputWrapper>
    );
  }
}

const mapStateToProps = state => ({ offset: state.textTrack.offset });

const mapDispatchToProps = dispatch => ({
  changeTextTrackOffset: bindActionCreators(changeTextTrackOffset, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SubtitleOffset);