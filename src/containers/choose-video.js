import React, { Component } from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { toggleFileDialog } from '../actions/file-dialog';

const Wrapper = styled.div`
  height: 100%;
  grid-row: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2em;
  cursor: pointer;
`;

const Label = styled.label`
  user-select: none;
  color: #fefefe;
  background-color: #3f51b5;
  outline: none;
  border: none;
  border-radius: 2px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  padding: 0.6em 0.8em;
  margin: 0;
  cursor: pointer;
`;

class ChooseVideo extends Component {
  render() {
    const { toggleFileDialog } = this.props;

    return (
      <Wrapper>
        <Label onClick={toggleFileDialog}>Choose a Video</Label>
      </Wrapper>
    );
  }
}

const mapStateToProps = (state) => ({ cast: state.cast });

const mapDispatchToProps = (dispatch) => ({ toggleFileDialog: bindActionCreators(toggleFileDialog, dispatch) });

export default connect(mapStateToProps, mapDispatchToProps)(ChooseVideo);