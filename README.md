# PocketStream

PocketStream is a resume-focused cloud gaming prototype: a Unity PC game runs on a laptop, streams to a mobile web browser with WebRTC, and receives mobile touch controls through a Node.js TypeScript signaling/input server.

## Stack

- Unity + C# for the game and input bridge
- Node.js + TypeScript + Socket.IO for signaling and input routing
- React + TypeScript for the host and mobile browser apps
- WebRTC for low-latency video streaming

## Architecture

```text
Laptop
  Unity 2D game
    ^
    | UDP input on localhost:7777
    |
  Node.js server
    ^
    | Socket.IO signaling + mobile input
    |
  Host browser captures Unity window/screen with WebRTC
    ^
    | WebRTC media stream
    |
Mobile browser
```

## First Milestone

1. Copy the scripts in `unity-bridge/Assets/CloudGamingBridge` into your Unity game's `Assets/CloudGamingBridge` folder.
2. Add `CloudInputReceiver` to a persistent GameObject in your first scene.
3. Connect your player controller to `CloudInputReceiver.LatestInput`.
4. Run the server and web client.
5. Open `/host` on the laptop, start capture, then open `/player` on your phone.

## Development

Install dependencies once:

```bash
npm install
```

Run server and web client:

```bash
npm run dev
```

Default URLs:

- Web client: `http://localhost:5173`
- Server: `http://localhost:3001`

For phone testing, use your laptop's LAN IP instead of `localhost`, for example:

```text
http://192.168.1.10:5173/player
```

## Resume Angle

This project is strongest when you document measurable engineering work:

- WebRTC connection setup and signaling
- Mobile touch input mapped into a Unity game loop
- Latency, FPS, and bitrate measurements
- Low-end hardware constraints and adaptive quality choices
- LAN and optional remote access demo path
