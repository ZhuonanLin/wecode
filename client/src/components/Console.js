import React, { Component } from 'react';
import { Button } from 'reactstrap';
import styled from 'styled-components';

const StyledConsole = styled.div`
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

const TextArea = styled.textarea`
  padding: 0;
  border-style: solid;
  border-color: black;
  border-width: 1px;
  height: 100%;
  width: 100%;
  outline: none;
  overflow: auto;
  resize: none;
`

class Console extends Component {
  constructor(props) {
    super(props);
    this.textLog = React.createRef();
  }

  clearConcole = () => {};

  componentDidUpdate() {
    this.textLog.current.scrollTop = this.textLog.current.scrollHeight;
  }

  render() {
    return (
      <StyledConsole>
        <Top>
          <TextArea
            ref={this.textLog}
            readOnly
            value={this.props.messages}
          />
        </Top>
        <Bottom>
          <div className="d-flex flex-row justify-content-end">
            <Button onClick={this.clearConcole}>Clear Concole</Button>
          </div>
        </Bottom>
      </StyledConsole>
    );
  }
}

export default Console;
