import React, { Component } from 'react';
import './Layout.css';

import CodeEditor from './CodeEditor';

class LeftColumn extends Component {
  render() {
    return (
      <div className='LeftColumn'>
        {this.props.children}
      </div>
    );
  }
}

class RightColumn extends Component {
  render() {
    return (
      <div className='RightColumn'>
        {this.props.children}
      </div>
    );
  }
}

class Layout extends Component {
  render() {
    return (
      <div className='Layout'>
        <LeftColumn>
          <CodeEditor mode='javascript' />
        </LeftColumn>
        <RightColumn>
          <p>Hello World from client!</p>
          <p>{this.props.serverMessage}</p>
        </RightColumn>
      </div>
    );
  }
}

export default Layout;
