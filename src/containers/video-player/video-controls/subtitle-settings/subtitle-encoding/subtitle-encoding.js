import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { changeTextTrackEncoding } from 'src/stores/text-track';

import { Flex, Button } from 'src/shared/components';

const Container = Flex.extend`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;
`;

const Text = styled.span`
  display: inline-block;
  width: calc(100% - 15px);
  font-size: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Select = styled.select`
  width: 100%;
  height: 100%;
  left: 0;
  font-size: 10px;
  opacity: 0;
  outline: none;
  background: transparent;
  border: none;
  position: absolute;
  z-index:10;
  cursor: pointer;
`;

const CaretDown = Button.extend`
  position: absolute;
  top: 0;
  right: 0;
  font-size: 40px;
  box-sizing: border-box;
  cursor: pointer;
  color: #fff;
  background: ${({ theme }) => theme['wet_asphalt']};
  transition: color 0.25s ease-in-out;

  ${Container}:hover & {
    color: ${({ theme }) => theme['turquoise']};
    background: ${({ theme }) => theme['midnight_blue']};
  }
`;

class SubtitleEncoding extends PureComponent {
  static propTypes = {
    encoding: PropTypes.string.isRequired,
    changeTextTrackEncoding: PropTypes.func.isRequired
  }

  static defaultProps = {
    encodingOptions: [
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
    ]
  }

  state = {
    currentEncoding: 'Auto-Detect'
  };
  
  onSelectionChange = (e) => {
    this.setState({ currentEncoding: e.target.value }, this.updateTextTrackEncoding);
  }

  updateTextTrackEncoding = () => {
    const { currentEncoding } = this.state;
    const { changeTextTrackEncoding } = this.props;
    const encoding = this.encodingParser(currentEncoding);

    changeTextTrackEncoding(encoding);
  }

  encodingParser = (encoding) => {
    if ((/auto-detect/i).test(encoding)) return encoding;
    const start = encoding.indexOf('(') + 1; // + 1 to exclude '('
    const end = encoding.length - 1;

    return encoding.substring(start, end);
  }

  renderEncodingOptions = (opt, i) => {
    return (
      <optgroup label={opt.language} key={i}>
        {opt.encodings.map((encoding, i) => (
          <option value={`${opt.language} (${encoding})`} key={i}>
            {`${opt.language} (${encoding})`}
          </option>
        ))}
      </optgroup>
    );
  }

  render() {
    const { currentEncoding } = this.state;
    const { encodingOptions } = this.props;

    return (
      <Container align='center' justify='space-between'>
        <Text>{currentEncoding}</Text>
        <Select onChange={this.onSelectionChange}>
          <optgroup label='Default'>
            <option value='Auto-Detect'>Auto-Detect</option>
          </optgroup>
          {encodingOptions.map(this.renderEncodingOptions)}
        </Select>
        <CaretDown size='48px'>
          <FontAwesomeIcon icon={['fas', 'caret-down']} />
        </CaretDown>
      </Container>
    );
  }
}

const mapStateToProps = state => ({ encoding: state.textTrack.encoding });

const mapDispatchToProps = dispatch => ({
  changeTextTrackEncoding: bindActionCreators(changeTextTrackEncoding, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SubtitleEncoding);