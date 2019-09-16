import React, { Component } from 'react';
import './App.css';

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
      <div className="App">
        <p>Hello World from client!</p>
        <p>{this.state.serverResponse}</p>
      </div>
    );
  }
}

export default App;
