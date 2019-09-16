import React, { Component } from 'react';
import './Console.css';

class Console extends Component {
  render() {
    return (
      <textarea
        className='Console'
        readOnly
        value={this.props.messages}
      />
    );
  }
}

export default Console;
