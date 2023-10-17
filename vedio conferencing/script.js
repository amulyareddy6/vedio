
const localVideo = document.getElementById('local-video');
const remoteVideos = document.getElementById('remote-videos');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');
const startCallButton = document.getElementById('start-call-button');
const stopCallButton = document.getElementById('stop-call-button');
const recordButton = document.getElementById('record-button');
const downloadLink = document.getElementById('download-link');

let localStream;
let peerConnection;
let mediaRecorder;
let recordedChunks = [];

async function startLocalVideo() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = localStream;
  } catch (error) {
    console.error('Error accessing media:', error);
  }
}

function createPeerConnection() {
  peerConnection = new RTCPeerConnection();

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  peerConnection.ontrack = (event) => {
    const remoteVideo = document.createElement('video');
    remoteVideo.srcObject = event.streams[0];
    remoteVideos.appendChild(remoteVideo);
  };

}

sendButton.addEventListener('click', () => {
  const message = chatInput.value;
  chatInput.value = '';
});

startCallButton.addEventListener('click', () => {
  createPeerConnection();
});

stopCallButton.addEventListener('click', () => {
  peerConnection.close();
  remoteVideos.innerHTML = '';
});

recordButton.addEventListener('click', () => {
  mediaRecorder = new MediaRecorder(localStream);

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };

  mediaRecorder.onstop = () => {
    const recordedBlob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(recordedBlob);
    downloadLink.href = url;
    downloadLink.style.display = 'block';
  };

  mediaRecorder.start();
});

stopCallButton.addEventListener('click', () => {
  mediaRecorder.stop();
});

startLocalVideo();
