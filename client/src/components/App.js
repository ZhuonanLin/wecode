import React, { Component } from 'react';
import io from 'socket.io-client';

import Layout from './Layout';

const serverURL = 'http://localhost:3001'
const socket = io(serverURL)

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: 'Welcome to WeCode!\n'
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
  }

  componentDidMount() {
    this.checkServerConnection();
  }

  render() {
    return (
      <Layout
        messages={this.state.messages}
      />
    );
  }
}

export default App;
