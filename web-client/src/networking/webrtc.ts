export function createPeerConnection() {
  return new RTCPeerConnection({
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" }
    ]
  });
}

export function attachStream(video: HTMLVideoElement | null, stream: MediaStream) {
  if (!video) return;
  video.srcObject = stream;
  void video.play();
}
