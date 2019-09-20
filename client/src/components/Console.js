import React, { Component } from 'react';
import { Button } from 'reactstrap';
import './Console.css';

class Console extends Component {


  clearConcole = () => {};
  render() {
    return (
      <React.Fragment>
        <Button onClick={this.clearConcole}>Clear Concole</Button>
        <textarea
          className='Console'
          readOnly
          value={this.props.messages}
        />     
        </React.Fragment>
    );
  }
}

export default Console;
