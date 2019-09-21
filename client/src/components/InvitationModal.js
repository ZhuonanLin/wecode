import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import { Button, Form, Label, Input } from 'reactstrap';

class InvitationModal extends React.Component {
    // The gray background
    backdropStyle = {
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.3)',
      padding: 50
    };

    // The modal "window"
    modalStyle = {
      backgroundColor: '#fff',
      borderRadius: 5,
      maxWidth: 500,
      minHeight: 300,
      margin: '0 auto',
      padding: 30
    };
  
  render() {
    return (
    <div>
      {!this.props.show ? (
        null
      ) : (
        <div style={this.backdropStyle}>
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Title>Send Interview Invitaion</Modal.Title>
          </Modal.Header>

          <Form action="/send-invitation-email" method="post">
              <Modal.Body>
                <Label for="interviewername">Your name:</Label>
                <Input type="text" name="interviewerName" placeholder="Enter your name"></Input>
                <Label for="exampleEmail">Send invitation to (email):</Label>
                <Input type="email" name="email" placeholder="Send invitation the email address" />
              </Modal.Body>
              <Modal.Footer>
                <Button color="primary" type="submit">Send Invitaion</Button>
                <Button onClick={this.props.onClose} color="danger">Cancel</Button>
              </Modal.Footer>
          </Form>
        </Modal.Dialog>
        </div>
      )}
    </div>
    );
  }
}

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
  children: PropTypes.node
};

export default InvitationModal;