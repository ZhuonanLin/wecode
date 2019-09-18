import React, { Component } from 'react';
import './Layout.css';
import io from 'socket.io-client';

import ChatWindow from './ChatWindow';
import CodeEditor from './CodeEditor';
import Console from './Console';
import InfoBar from './InfoBar';

export const socket = io()

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: 'Welcome to WeCode!\n',
    };
  }

  appendMessage(newMessage) {
    this.setState({ messages: this.state.messages + newMessage});
  }

  checkServerConnection() {
    fetch('/api/check')
      .then(res => res.text())
      .then(text => this.appendMessage(text + '\n'))
      .catch(err => err);
  }

  componentDidMount() {
    // This is problematic when client is built and served as static.
    // I have no idea what the problem is, so comment it out for now.
    // this.checkServerConnection();

    socket.on('server message', msg => {
      this.appendMessage(`Server: ${msg}\n`);
    });

    socket.on('console output', msg => {
      this.appendMessage(`${msg}`);
    });
  }

  render() {
    return (
      <div className='Layout'>
        <div className='TopArea'>
          <InfoBar />
        </div>
        <div className='LeftArea'>
          <CodeEditor mode='javascript' />
        </div>
        <div className='RightTop'>
          <ChatWindow />
        </div>
        <div className='RightBottom'>
          <Console messages={this.state.messages} />
        </div>
      </div>
    );
  }
}

export default Layout;
