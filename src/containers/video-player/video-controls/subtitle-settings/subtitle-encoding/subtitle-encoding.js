import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { changeTextTrackEncoding } from 'stores/text-track';

import { Flex } from 'shared/components';

const Container = Flex.extend`
  width: 100%;
  height: 20px;
  box-sizing: border-box;
  position: relative;
  border-bottom: 1px solid rgb(255,255,255);
`;

const Select = styled.select`
  width: 100%;
  height: 100%;
  left: 0;
  font-size: 10px;
  opacity: 0;
  color: rgb(255,255,255);
  outline: none;
  background: transparent;
  border: none;
  position: absolute;
`;

const CaretWrapper = Flex.extend`
  width: 16px;
  height: 16px;
  font-size: 16px;
  box-sizing: border-box;
`;

const encodingOptions = [
  {
    language: 'Unicode',
    encodings: ['UTF-8', 'UTF-16', 'UTF-16 LE', 'UTF-16 BE']
  },
  {
    language: 'Chinese Simplfied',
    encodings: ['GB2312', 'GBK', 'GB18030', 'Windows-936']
  },
  {
    language: 'Chinese Traditional',
    encodings: ['BIG5']
  },
  {
    language: 'Japanese',
    encodings: ['Shift_JIS', 'EUC-JP']
  }
];

class SubtitleEncoding extends Component {

  static propTypes = {
    encoding: PropTypes.string.isRequired,
    changeTextTrackEncoding: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    
    this.state = {
      currentEncoding: 'Auto-Detect'
    };

    this.onSelectionChange = this.onSelectionChange.bind(this);
  }
  
  onSelectionChange(e) {
    this.setState({ currentEncoding: e.target.value }, this.updateTextTrackEncoding);
  }

  updateTextTrackEncoding() {
    const { currentEncoding } = this.state;
    const { changeTextTrackEncoding } = this.props;

    changeTextTrackEncoding(currentEncoding);
  }

  render() {
    const { currentEncoding } = this.state;

    return (
      <Container align='center' justify='space-between'>
        <span style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>{currentEncoding}</span>
        <Select onChange={this.onSelectionChange}>
          <optgroup label='Default'>
            <option value='Auto-Detect'>Auto-Detect</option>
          </optgroup>
          {encodingOptions.map((option, i) => (
            <optgroup label={option.language} key={i}>
              {option.encodings.map((encoding, i) => (
                <option value={encoding} key={i}>
                  {`${option.language} (${encoding})`}
                </option>
              ))}
            </optgroup>
          ))}
        </Select>
        <CaretWrapper align='center' justify='center'>
          <FontAwesomeIcon icon={['fas', 'caret-down']} />
        </CaretWrapper>
      </Container>
    );
  }
}

const mapStateToProps = state => ({ encoding: state.textTrack.encoding });

const mapDispatchToProps = dispatch => ({
  changeTextTrackEncoding: bindActionCreators(changeTextTrackEncoding, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SubtitleEncoding);