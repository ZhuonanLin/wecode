import React, { Component } from 'react';

import Layout from './Layout';

const serverURL = 'http://localhost:3001'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: 'Welcome to WeCode!\n'
    };
  }

  checkServerConnection() {
    fetch(`${serverURL}/check`)
      .then(res => res.text())
      .then(text => this.setState({ messages: this.state.messages + text + '\n' }))
      .catch(err => err);
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
