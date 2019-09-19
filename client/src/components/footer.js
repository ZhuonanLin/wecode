import React from 'react';

const style = {
  textAlign: "center",
  padding: "20px",
  position: "fixed",
  left: "0",
  bottom: "0",
  height: "60px",
  width: "100%",
}

class Footer extends React.Component {
  render() {
    return (
        <div>
            <div style={style}>
                { this.props.children }
            </div>
        </div>
    );
  }
}

export default Footer