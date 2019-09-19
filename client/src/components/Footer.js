import React from 'react';
import { Alert } from 'reactstrap';

const style = {
  textAlign: "center",
  padding: "0px",
  position: "fixed",
  left: "0",
  bottom: "0",
  height: "8vh",
  width: "100%",
}

class Footer extends React.Component {
  message = "Author: Bili Dong \& Zhuonan Lin"

  render() {
    return (
        <div>
            <div style={style}>
              <Alert color="light" style={{width: "100%"}}>
                <div style={{ color: "black" }}>
                  {this.message}
                </div>
              </Alert>
            </div>
        </div>
    );
  }
}

export default Footer