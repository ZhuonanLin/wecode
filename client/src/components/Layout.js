import React, { Component } from 'react';
import './Layout.css';
import io from 'socket.io-client';
import {
  Button,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
} from 'reactstrap';

import CodeEditor from './CodeEditor';
import Console from './Console';
import InvitationModal from './InvitationModal';

export const socket = io()

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: 'Welcome to WeCode!\n',
      isOpen: false
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

  openModal = () => {
    this.setState({
      isOpen: true
    });
  }

  closeModal = () => {
    this.setState({
      isOpen: false
    });
  }

  render() {
    console.log(this.state.isOpen);
    return (
      <div className='Layout'>
        <div className='TopArea'>
          <Navbar color="light" light expand="md">
            <NavbarBrand href="/">WeCode</NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <Button onClick={this.openModal} color="primary">Send Invitation</Button>
                </NavItem>
              </Nav>
            </Collapse>
          </Navbar>
        </div>
        <div className='LeftArea'>
          <CodeEditor mode='javascript' />
        </div>
        <div className='RightArea'>
          <Console messages={this.state.messages} />
        </div>
        <div>
        <InvitationModal show={this.state.isOpen}
          onClose={this.closeModal}
          word="Send Interview Invitation" 
        />
        </div>
      </div>
    );
  }
}

export default Layout;
