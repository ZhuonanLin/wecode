import React, { Component } from 'react';
import styled from 'styled-components';

import { socket, peer } from './App';

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

navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;

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
  }

  render() {
    return (
      <StyledVideoChat>
        <Video id='video-me'></Video>
        <Video id='video-you'></Video>
      </StyledVideoChat>
    );
  }
}

export default VideoChat;