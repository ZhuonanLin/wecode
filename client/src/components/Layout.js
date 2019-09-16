import React, { Component } from 'react';
import './Layout.css';

import ChatWindow from './ChatWindow';
import CodeEditor from './CodeEditor';
import Console from './Console';
import InfoBar from './InfoBar';

class Layout extends Component {
  render() {
    return (
      <div className='Layout'>
        <div className='TopArea'>
          <InfoBar />
        </div>
        <div className='LeftArea'>
          <CodeEditor mode='javascript' />
        </div>
        <div className='RightTop'>
          <ChatWindow />
        </div>
        <div className='RightBottom'>
          <Console messages={this.props.messages} />
        </div>
      </div>
    );
  }
}

export default Layout;
