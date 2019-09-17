import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import io from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';

const serverURL = 'http://localhost:3001'
export const socket = io(serverURL)

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: 'Welcome to WeCode!\n',
      redirect: false
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

  setRedirect = () => {
    this.setState({
      redirect: true
    })
  }

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect push to='/interview' />
    }
  }

  render() {
    return (
      <div>
        {this.renderRedirect()}
        <Button color='primary' onClick={this.setRedirect}>
          Start a New Interview
        </Button>
      </div>

    );
  }
}

export default App;
