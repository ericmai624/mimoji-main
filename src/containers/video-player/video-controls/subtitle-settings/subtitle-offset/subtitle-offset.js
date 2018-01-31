import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { changeTextTrackOffset } from 'stores/text-track';

import { Flex, Button } from 'shared/components';
 
const Container = Flex.extend`
  width: 100%;
  height: 100%;
  position: relative;
  box-sizing: border-box;
`;

const StepsContainer = Flex.extend`
  position: absolute;
  top: 0;
  right: 0;
  width: 96px;
  height: 100%;
  box-sizing: border-box;
`;

const StepWrapper = Button.extend`
  font-size: 28px;
  color: #fff;
  background: ${({ theme }) => theme['wet_asphalt']};
  transition: color 0.25s ease-in-out;

  &:hover {
    color: ${({ theme }) => theme['turquoise']};
    background: ${({ theme }) => theme['midnight_blue']};
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
  font-size: 18px;
  outline: none;
  border: none;
  color: #000;
  background: transparent;
  box-sizing: border-box;

  &::placeholder {
    color: #000;
  }
`;

const Warning = Flex.extend`
  text-align: center;
  vertical-align: middle;
  font-size: 14px;
  line-height: 20px;
  color: #fff;
  background: ${({ theme }) => theme['alizarin']};
  position: absolute;
  transform: translateX(-50%);
  bottom: -50px;
  padding: 10px 10px;
  box-sizing: content-box;
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
  white-space: nowrap;
  transition: opacity 0.25s ease-in-out;

  ${'' /* &::before {
    content: '';
    position: absolute;
    left: calc(50% - 10px);
    top: calc(-10px * 0.866);
    border-width: 0 10px 10px 10px;
    border-style: solid;
    border-color: transparent transparent ${({ theme }) => theme['alizarin']} transparent;
  } */}
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
      <Container align='center' justify='space-between'>
        <OffsetInput
          placeholder={offset.toFixed(3)}
          value={input}
          onChange={this.onInputChange}
          innerRef={el => this.offsetInput = el}
          onMouseOver={this.onInputMouseOver}
          onMouseLeave={this.onInputMouseLeave}
        />
        <StepsContainer align='center' justify='center'>
          <StepWrapper size='48px' onClick={this.decreaseOffset}>
            <FontAwesomeIcon icon={['fas', 'minus']}/>
          </StepWrapper>
          <StepWrapper size='48px' onClick={this.increaseOffset}>
            <FontAwesomeIcon icon={['fas', 'plus']}/>
          </StepWrapper>
        </StepsContainer>
        <Warning
          align='center'
          justify='center'
          style={{ opacity: isWarningVisible ? 1 : 0, left: caretPos }}
        >
          <span>Offset must be a number</span>
        </Warning>
      </Container>
    );
  }
}

const mapStateToProps = state => ({ offset: state.textTrack.offset });

const mapDispatchToProps = dispatch => ({
  changeTextTrackOffset: bindActionCreators(changeTextTrackOffset, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SubtitleOffset);