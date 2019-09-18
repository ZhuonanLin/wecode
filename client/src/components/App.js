import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import io from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: 'Welcome to WeCode!\n',
      redirect: false
    };
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
