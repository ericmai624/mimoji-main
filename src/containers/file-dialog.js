import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { toggleFileDialog } from '../actions/file-dialog';

const Wrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100vh;
  left: 0;
  top: 0;
  align-items: center;
  justify-content: center;
`;

const Dialog = styled.div`
  display: grid;
  grid-template-columns: 2fr 4fr;
  grid-template-rows: auto;
  width: 850px;
  height: 80%;
  max-height: 600px;
  background: lightgray;
`;

const DialogSidebar = styled.div`
  grid-column: 1;
  background: lightcoral;
`;

const Main = styled.div`
  grid-column: 2;
  background: lightcyan;
  padding: 1.8em;
`;

const Close = styled.div`
  display: inline-block;
  width: 40px;
  height: 40px;
  cursor: pointer;
`;

class FileDialog extends Component {
  render() {
    const { showFileDialog, toggleFileDialog } = this.props;

    return (
      <Wrapper style={{ display: showFileDialog ? 'flex' : 'none' }}>
        <Dialog>
          <DialogSidebar></DialogSidebar>
          <Main>
            <Close onClick={toggleFileDialog}>
              <i className='fa fa-times fa-lg' aria-hidden='true'></i>
            </Close>
          </Main>
        </Dialog>
      </Wrapper>
    );
  }
}

const mapStateToProps = (state) => ({ showFileDialog: state.showFileDialog });

const mapDispatchToProps = (dispatch) => ({ toggleFileDialog: bindActionCreators(toggleFileDialog, dispatch) });

export default connect(mapStateToProps, mapDispatchToProps)(FileDialog);