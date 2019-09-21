import React, { Component } from 'react';
import { Button, ButtonGroup } from 'reactstrap';
import { Jumbotron } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';

import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from './Footer';

// Set socket
import io from 'socket.io-client';
export const socket = io();

const StyledJumbotron = styled(Jumbotron)`
  height: 100vh;
  width: 100vw;
  background-image: url("https://images.unsplash.com/photo-1491237596458-ccbf4462e884?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80");
  background-color: transparent;
`

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
      <React.Fragment>
        <StyledJumbotron
          className="mb-0 d-flex flex-column align-items-center justify-content-center"
          fluid
        >
          <div style={{fontSize: 72, color: "white"}}>
            Welcome to WeCode
          </div>
          <div>
          {this.renderRedirect()}
            <ButtonGroup>
              {/* <Button color='danger'>
                Log In or Sign up
              </Button> */}
              <Button color='primary' onClick={this.setRedirect} className='ml-4'>
                Start an Interview as Guest
              </Button>
            </ButtonGroup>
          </div>
          <Footer />
        </StyledJumbotron>
      </React.Fragment>
    );
  }
}

export default App;
