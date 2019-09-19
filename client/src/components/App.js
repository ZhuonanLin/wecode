import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { Jumbotron, Container } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import footer from './footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from './Footer';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: 'Welcome to WeCode!\n',
      redirect: false
    };
  }

  jumbotronStyle = {
    height: "100vh",
    backgroundImage: 'url(https://images.unsplash.com/photo-1491237596458-ccbf4462e884?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80)',
    backgroundColor: "transparent"
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
        <Jumbotron className="mb-0 d-flex flex-column align-items-center justify-content-center"
          style={this.jumbotronStyle} 
          fluid
        >
          <div style={{fontSize: 72, color: "white"}}>
            Welcome to WeCode
          </div>
          <div>
          {this.renderRedirect()}
            <Button color='primary' onClick={this.setRedirect}>
              Start a New Interview
            </Button>
          </div>
          <Footer />
        </Jumbotron>
      </React.Fragment>

    );
  }
}

export default App;
