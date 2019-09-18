import React, { Component } from 'react';
import './Layout.css';
import io from 'socket.io-client';

import ChatWindow from './ChatWindow';
import CodeEditor from './CodeEditor';
import Console from './Console';
import InfoBar from './InfoBar';

const serverURL = 'http://localhost:3001'
export const socket = io(serverURL)

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: 'Welcome to WeCode!\n',
    };
  }
  
  appendMessage(newMessage) {
    this.setState({ messages: this.state.messages + newMessage + '\n'});
  }

  checkServerConnection() {
    fetch(`${serverURL}/check`)
      .then(res => res.text())
      .then(text => this.appendMessage(text))
      .catch(err => err);

    socket.on('server message', msg => {
      this.appendMessage(msg);
    });

    socket.on('run out', msg => {
      this.appendMessage(msg);
    });
  }

  componentDidMount() {
    this.checkServerConnection();
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
