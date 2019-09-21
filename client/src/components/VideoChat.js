import React, { Component } from 'react';
import styled from 'styled-components';
import Peer from 'peerjs';

import { socket } from './App';

const StyledVideoChat = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
`

const Video = styled.video`
  width: 50%;
  border-style: solid;
  border-color: black;
  border-width: 1px;
`

class VideoChat extends Component {
  stream = null;

  componentDidMount() {
    let videoMe = document.getElementById('video-me');
    let videoYou = document.getElementById('video-you');

    navigator.mediaDevices.getUserMedia({video: true, audio: true})
      .then((stream) => {
        videoMe.srcObject = stream;
        videoMe.play();
        this.stream = stream;
      });

    socket.emit('chat window ready');

    socket.on('peer create', (port) => {
      const peer = new Peer({
        host: 'localhost',
        port: port,
        path: '/peerjs'
      });
      console.log('WebRTC peer: ', peer);

      peer.on('open', (peer_id)=> {
        socket.emit('peer open', peer_id);
      });

      // Answer call
      peer.on('call', (call) => {
        call.answer(this.stream);

        call.on('stream', (stream) => {
          videoYou.srcObject = stream;
          videoYou.play();
        });
      });

      // Make call
      socket.on('peer call', (peer_id) => {
        let call = peer.call(peer_id, this.stream);

        call.on('stream', (stream) => {
          videoYou.srcObject = stream;
          videoYou.play();
        });
      });
    });
  }

  render() {
    return (
      <StyledVideoChat>
        <Video id='video-me' muted></Video>
        <Video id='video-you'></Video>
      </StyledVideoChat>
    );
  }
}

export default VideoChat;
