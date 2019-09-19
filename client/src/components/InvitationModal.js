import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';

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

          <Modal.Body>
            <p>Modal body text goes here.</p>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="primary">Save changes</Button>
            <Button onClick={this.props.onClose} variant="secondary">Cancel</Button>
          </Modal.Footer>
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