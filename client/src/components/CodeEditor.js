import React, { Component } from 'react';
import {Controlled as CodeMirror} from 'react-codemirror2';
import { Button, ButtonGroup } from 'reactstrap';
import styled from 'styled-components';

import { socket } from './App';
import Select from 'react-select'


import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import './CodeEditor.css'
require('codemirror/mode/javascript/javascript');
require('codemirror/mode/python/python');



const StyledCodeEditor = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: 1fr 2.5rem;
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
      javascriptValue: "console.log('Hello, world!');",
      pythonValue: "print('Hello, world')",
      language: 'javascript'
    };
  }

  languageOptions = {
    'javascript': { value: 'javascript', label: 'JavaScript'},
    'python': { value: 'python', label: 'Python3' }
  };


  clear = () => {
    socket.emit('clear', this.state.language);
  };

  componentDidMount() {
    socket.emit('request code', this.state.language);

    socket.on('edit', (language, value) => {
      if (language === 'javascript') {
        this.setState({javascriptValue: value});
      } else if (language === 'python') {
        this.setState({pythonValue: value});
      };
    });
  }

  render() {
    return (
      <StyledCodeEditor>
        <Top>
          {this.state.language === 'javascript' ? (
          <StyledCodeMirror
            value={this.state.javascriptValue}
            options={{
              mode: this.state.language,
              theme: 'material',
              lineNumbers: true
            }}
            onBeforeChange={(editor, data, value) => {
              this.setState({ javascriptValue: value });
            }}
            onChange={(editor, data, value) => {
              socket.emit('edit', value);
            }}
          />
          ) : (
          <StyledCodeMirror
            value={this.state.pythonValue}
            options={{
              mode: this.state.language,
              theme: 'material',
              lineNumbers: true
            }}
            onBeforeChange={(editor, data, value) => {
              this.setState({ pythonValue: value });
            }}
            onChange={(editor, data, value) => {
              socket.emit('edit', value);
            }}
          />

          )}
        </Top>
        <Bottom>
          <div className='d-flex flex-row bd-highlight'>
            <span className="align-self-center">Program Language:</span>
            <span className="mr-auto col-3">
            <Select
              menuPlacement="top"
              isSearchable={false}
              isClearable={false}
              options={
                [{value: 'javascript', label: 'JavaScript'},
                {value: 'python', label: 'Python3'}
                ]}
              defaultValue={this.languageOptions[this.state.language]}
              onChange={(e) => {
                this.setState({
                  language: e.value
                });
              }}
            />
            </span>
            <Button className="mr-1" color="danger" onClick={this.clear}>Clear</Button>
            <Button color="primary" onClick={() => {
              if (this.state.language === 'javascript') {
                socket.emit('run request', this.state.language, this.state.javascriptValue);
              } else if (this.state.language === 'python') {
                socket.emit('run request', this.state.language, this.state.pythonValue);   
              }
            }}>
              Run
            </Button>
          </div>
        </Bottom>
      </StyledCodeEditor>
    );
  }
}

export default CodeEditor;
