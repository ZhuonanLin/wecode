import React, { Component } from 'react';

import Layout from './Layout';

const serverURL = 'http://localhost:3001'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serverResponse: null
    };
  }

  callServer() {
    fetch(`${serverURL}/`)
      .then(res => res.text())
      .then(text => this.setState({ serverResponse: text }))
      .catch(err => err);
  }

  componentDidMount() {
    this.callServer();
  }

  render() {
    return (
      <Layout
        serverMessage={this.state.serverResponse}
      />
    );
  }
}

export default App;
