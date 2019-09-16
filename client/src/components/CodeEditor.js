import React, { Component } from 'react';
import {Controlled as CodeMirror} from 'react-codemirror2';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import './CodeEditor.css'

require('codemirror/mode/javascript/javascript');

class CodeEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: `console.log('Hello World!');`
    }
  }

  render() {
    return (
      <CodeMirror
        className='CodeEditor'
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
          console.log('controlled', {value});
        }}
      />
    );
  }
}

export default CodeEditor;
