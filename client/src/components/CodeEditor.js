import React, { Component } from 'react';
import {Controlled as CodeMirror} from 'react-codemirror2';
import { Button } from 'reactstrap';
import styled from 'styled-components';

import { socket } from './App';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import './CodeEditor.css'

require('codemirror/mode/javascript/javascript');

const StyledCodeEditor = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: 1fr auto;
  grid-template-areas:
    "top"
    "bottom";
`

const Top = styled.div`
  grid-area: top;
`

const Bottom = styled.div`
  grid-area: bottom;
`

const StyledCodeMirror = styled(CodeMirror)`
  height: 100%;
`

class CodeEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ""
    };
  }

  clear = () => {
    socket.emit('clear');
  };

  componentDidMount() {
    socket.emit('request code');

    socket.on('edit', value => {
      this.setState({value});
    });
  }

  render() {
    return (
      <StyledCodeEditor>
        <Top>
          <StyledCodeMirror
            value={this.state.value}
            options={{
              mode: this.props.mode,
              theme: 'material',
              lineNumbers: true
            }}
            onBeforeChange={(editor, data, value) => {
              this.setState({value});
            }}
            onChange={(editor, data, value) => {
              socket.emit('edit', value);
            }}
          />
        </Top>
        <Bottom className="flex-row justify-content-end">
          <Button className="mr-1" color="danger" onClick={this.clear}>Clear</Button>
          <Button color="primary" onClick={() => {
            socket.emit('run request', this.state.value);
          }}>
            Run
          </Button>
        </Bottom>
      </StyledCodeEditor>
    );
  }
}

export default CodeEditor;
