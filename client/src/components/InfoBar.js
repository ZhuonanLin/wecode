import React, { Component } from 'react';
import './InfoBar.css';

class InfoBar extends Component {
  render() {
    return (
      <div className='InfoBar'>
        {this.props.children}
      </div>
    );
  }
}

export default InfoBar;
