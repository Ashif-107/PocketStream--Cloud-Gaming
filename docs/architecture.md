# PocketStream Architecture

## MVP Flow

The MVP avoids heavy native video encoding inside Unity. Instead, the host browser uses `getDisplayMedia` to capture the Unity game window or screen and sends that stream to the mobile browser through WebRTC.

Mobile input goes to the Node.js server with Socket.IO. The server forwards compact JSON input packets to Unity over UDP on `127.0.0.1:7777`.

## Why This Works On A Low-End Laptop

- The game remains a normal Unity desktop build/editor session.
- Browser WebRTC handles encoding and network transport.
- The Unity integration only receives input, so it is lightweight.
- The game can be tuned to 720p or 480p for stable demos.

## Components

- `server`: Socket.IO rooms, WebRTC signaling, and UDP input relay.
- `web-client /host`: Laptop page that captures Unity and creates the WebRTC offer.
- `web-client /player`: Mobile page that receives the stream and renders touch controls.
- `unity-bridge`: C# scripts to receive input packets from the Node server.

## Stretch Features

- DataChannel input path for direct browser-to-browser input.
- Adaptive capture constraints for 480p/720p modes.
- Latency pings and overlay charts.
- Session IDs and QR code join flow.
- Dockerized signaling server.
