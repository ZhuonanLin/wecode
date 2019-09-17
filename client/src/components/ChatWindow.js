import React, { Component } from 'react';
import './ChatWindow.css';

class ChatWindow extends Component {
  render() {
    return (
      <div className='ChatWindow'>
        {this.props.children}
      </div>
    );
  }
}

export default ChatWindow;