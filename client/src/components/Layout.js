import React, { Component } from 'react';
import {
  Button,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
} from 'reactstrap';
import styled from 'styled-components';

import { socket } from './App';

import CodeEditor from './CodeEditor';
import Console from './Console';
import InvitationModal from './InvitationModal';
import VideoChat from './VideoChat';

const StyledLayout = styled.div`
  height: 100vh;
  width: 100vw;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 3.5rem 1fr 1fr;
  grid-template-areas:
    "top top"
    "left right-top"
    "left right-bottom";
`

const Top = styled.div`
  grid-area: top;
`

const Left = styled.div`
  grid-area: left;
`

const RightTop = styled.div`
  grid-area: right-top;
`

const RightBottom = styled.div`
  grid-area: right-bottom;
`

const VideoChatPlaceholder = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
`
const VideoWindowPlaceholder = styled.div`
  width: 50%;
  border-style: solid;
  border-color: black;
  border-width: 1px;
`

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: 'Welcome to WeCode!\n',
      isOpen: false,
      isVideoChatOpen: false
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

  toggleVideoChat = () => {
    this.setState({
      isVideoChatOpen: 
        !this.state.isVideoChatOpen
    });
  }

  render() {
    return (
      <StyledLayout>
        <Top>
          <Navbar color="light" light expand="md">
            <NavbarBrand href="/">WeCode</NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  {this.state.isVideoChatOpen ? (
                    <Button onClick={this.toggleVideoChat} color="danger">End Video Chat</Button>
                  ) : (
                    <Button onClick={this.toggleVideoChat} color="warning">Begin Video Chat</Button>
                  )}
                </NavItem>
                <NavItem className="ml-3">
                  <Button onClick={this.openModal} color="primary">Send Invitation</Button>
                </NavItem>
              </Nav>
            </Collapse>
          </Navbar>
        </Top>
        <Left>
          <CodeEditor />
        </Left>
        <RightTop>
            {this.state.isVideoChatOpen ? (
              <VideoChat />
            ) : (
              <VideoChatPlaceholder>
                <VideoWindowPlaceholder></VideoWindowPlaceholder>
                <VideoWindowPlaceholder></VideoWindowPlaceholder>
              </VideoChatPlaceholder>
            )}
        </RightTop>
        <RightBottom>
          <Console messages={this.state.messages} />
        </RightBottom>
        <div>
          <InvitationModal show={this.state.isOpen}
            onClose={this.closeModal}
            word="Send Interview Invitation"
          />
        </div>
      </StyledLayout>
    );
  }
}

export default Layout;
