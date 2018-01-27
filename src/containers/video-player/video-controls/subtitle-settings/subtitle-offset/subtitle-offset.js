import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { changeTextTrackOffset } from 'stores/text-track';

import { Flex, Button } from 'shared/components';
 
const OffsetInputWrapper = Flex.extend`
  width: 100%;
  height: 100%;
  position: relative;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(255,255,255,0.8);
`;

const Steps = Flex.extend`
  width: 15px;
`;

const StepWrapper = Button.extend`
  color: rgba(255,255,255,0.94);
  transition: color 0.25s ease-in-out;

  &:hover {
    color: ${({ theme }) => theme.orange};
  }
`;

const OffsetInput = styled.input.attrs({
  name: 'offset',
  autoComplete: 'off',
})`
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(100% - 15px);
  font-size: 12px;
  outline: none;
  border: none;
  color: rgba(255,255,255,0.94);
  background: transparent;
  box-sizing: border-box;

  &::placeholder {
    color: rgba(255,255,255,0.94);
  }
`;

const Warning = Flex.extend`
  text-align: center;
  vertical-align: middle;
  font-size: 13px;
  line-height: 13px;
  color: #D8000C;
  background: #FFD2D2;
  position: absolute;
  transform: translateX(-50%);
  bottom: -40px;
  padding: 10px 10px;
  border-radius: 5px;
  box-sizing: content-box;
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
  white-space: nowrap;
  transition: opacity 0.25s ease-in-out;

  &::before {
    content: '';
    position: absolute;
    left: calc(50% - 5px);
    top: calc(-5px * 0.866);
    border-width: 0 5px 5px 5px;
    border-style: solid;
    border-color: transparent transparent #FFD2D2 transparent;
  }
`;

class SubtitleOffset extends Component {

  static propTypes = {
    offset: PropTypes.number.isRequired,
    changeTextTrackOffset: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      input: '',
      isInputNaN: false,
      caretPos: '3px'
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.onInputMouseOver = this.onInputMouseOver.bind(this);
    this.onInputMouseLeave = this.onInputMouseLeave.bind(this);
    this.increaseOffset = this.increaseOffset.bind(this);
    this.decreaseOffset = this.decreaseOffset.bind(this);
  }

  onInputChange(e) {
    e.preventDefault();
    const input = e.target.value;
    const offset = parseFloat(input);
    const isInputNaN = isNaN(offset);
    const caretPos = e.target.selectionStart * 3 + 'px';

    this.setState({ input, isInputNaN, caretPos }, this.updateTextTrackOffset.bind(this, offset));
  }

  onInputMouseOver(e) {
    this.setState({ input: '' }, this.offsetInput.focus.bind(this.offsetInput));
  }

  onInputMouseLeave(e) {
    this.setState({ input: '' }, this.offsetInput.blur.bind(this.offsetInput));
  }

  updateTextTrackOffset(offset) {
    const { changeTextTrackOffset } = this.props;

    if (!isNaN(offset)) return changeTextTrackOffset(parseFloat(offset.toFixed(3)));
  }

  increaseOffset(e) {
    const { offset, changeTextTrackOffset } = this.props;
    changeTextTrackOffset(offset + 0.005);
  }

  decreaseOffset(e) {
    const { offset, changeTextTrackOffset } = this.props;
    changeTextTrackOffset(offset - 0.005);
  }
  
  render() {
    const { offset } = this.props;
    const { input, isInputNaN, caretPos } = this.state;
    const isWarningVisible = input !== '' && isInputNaN;

    return (
      <OffsetInputWrapper align='center' justify='space-between'>
        <OffsetInput
          placeholder={offset.toFixed(3)}
          value={input}
          onChange={this.onInputChange}
          innerRef={el => this.offsetInput = el}
          onMouseOver={this.onInputMouseOver}
          onMouseLeave={this.onInputMouseLeave}
        />
        <Steps column align='center'>
          <StepWrapper size='12px' onClick={this.increaseOffset} style={{ marginTop: '-2px'}}>
            <FontAwesomeIcon icon={['fas', 'caret-up']}/>
          </StepWrapper>
          <StepWrapper size='12px' onClick={this.decreaseOffset} style={{ marginTop: '-6px'}}>
            <FontAwesomeIcon icon={['fas', 'caret-down']}/>
          </StepWrapper>
        </Steps>
        <Warning
          align='center'
          justify='center'
          style={{ opacity: isWarningVisible ? 1 : 0, left: caretPos }}
        >
          <span>Offset must be a number</span>
        </Warning>
      </OffsetInputWrapper>
    );
  }
}

const mapStateToProps = state => ({ offset: state.textTrack.offset });

const mapDispatchToProps = dispatch => ({
  changeTextTrackOffset: bindActionCreators(changeTextTrackOffset, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SubtitleOffset);