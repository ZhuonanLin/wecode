import React, { Component } from 'react';
import Peer from 'peerjs';

import { socket } from './Layout';

export const peer = new Peer({
  host: 'localhost',
  port: process.env.PORT || 3001,
  path: '/peerjs'
});

// let videoMe = document.getElementById('video-me');
// let videoYou = document.getElementById('video-you');
let streamMe;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

class VideoChat extends Component {
  stream = null;

  componentDidMount() {
    let videoMe = document.getElementById('video-me');
    let videoYou = document.getElementById('video-you');

    navigator.getUserMedia({video: true, audio: true}, (stream) => {
      videoMe.srcObject = stream;
      videoMe.play();
      this.stream = stream;
    });

    peer.on('open', (peer_id)=> {
      socket.emit('peer', peer_id);
    });

    peer.on('call', (call) => {
      call.answer(this.stream);
      this.peer_connections.add(call);

      call.on('stream', (stream) => {
        videoYou.srcObject = stream;
        videoYou.play();
      });
    });

    socket.on('call', (peer_id) => {
      let call = peer.call(peer_id, this.stream);
      this.peer_connections.add(call);

      call.on('stream', (stream) => {
        videoYou.srcObject = stream;
        videoYou.play();
      });
    });
  }

  render() {
    return (
      <div>
        <video id='video-me'></video>
        <video id='video-you'></video>
      </div>
    );
  }
}

export default VideoChat;
