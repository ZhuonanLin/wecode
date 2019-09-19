import React, { Component } from 'react';
import {Controlled as CodeMirror} from 'react-codemirror2';
import { ButtonGroup, Button } from 'reactstrap';

import { socket } from './Layout'

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import './CodeEditor.css'

require('codemirror/mode/javascript/javascript');

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
      <div className='CodeEditor'>
        <div className='TextArea'>
          <CodeMirror
            className='FullHeight'
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
        </div>
        <div className="ButtonArea d-flex flex-row justify-content-end">
          <Button className="mr-1" color="danger" onClick={this.clear}>Clear</Button>
          <Button color="primary" onClick={() => {
            socket.emit('run request', this.state.value);
          }}>
            Run
          </Button>
        </div>
      </div>
    );
  }
}

export default CodeEditor;
