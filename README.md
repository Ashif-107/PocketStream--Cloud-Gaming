# PocketStream

PocketStream is a working MVP cloud gaming prototype that streams a Unity 2D platformer from a laptop to a mobile web browser. The game runs on the laptop, the phone receives the live WebRTC video stream, and mobile touch controls are sent back to Unity in real time.

The goal of the project is to demonstrate a practical, low-latency game streaming pipeline on low-end hardware using game development, real-time networking, browser APIs, and backend systems.

## MVP Status

PocketStream currently supports:

- Unity game streaming from laptop to mobile browser
- WebRTC-based live video delivery
- Mobile browser touch controls
- Node.js signaling server
- Unity C# input receiver
- UDP input relay from server to Unity
- Laptop host page for capture
- Mobile player page for gameplay
- LAN-based testing on a phone and laptop

This MVP proves the full gameplay loop:

```text
Mobile browser controls
  -> Node.js TypeScript server
  -> UDP input relay
  -> Unity CloudInputReceiver
  -> PlayerMovement
  -> Unity game window
  -> WebRTC stream
  -> Mobile browser video
```

## Tech Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| Game | Unity + C# | Runs the 2D platformer and applies remote input |
| Backend | Node.js + TypeScript | Handles signaling, sessions, and input relay |
| Realtime transport | Socket.IO | Sends WebRTC signaling and mobile input packets |
| Streaming | WebRTC | Streams the Unity game window to the phone |
| Frontend | React + TypeScript + Vite | Provides host and player browser interfaces |
| Unity input bridge | UDP + C# | Receives mobile input inside the Unity game loop |

## Architecture

```text
Laptop
  +--------------------------+
  | Unity 2D Platformer      |
  | CloudInputReceiver.cs    |
  +------------^-------------+
               |
               | UDP 127.0.0.1:7777
               |
  +------------+-------------+
  | Node.js TypeScript Server|
  | Socket.IO + UDP relay    |
  +------------^-------------+
               |
               | Socket.IO input and WebRTC signaling
               |
  +------------+-------------+
  | Host Browser             |
  | Captures Unity window    |
  +------------+-------------+
               |
               | WebRTC media stream
               v
Mobile Browser
  +--------------------------+
  | Player UI + Touch Input  |
  | Live streamed gameplay   |
  +--------------------------+
```

## Project Structure

```text
PocketStream/
  server/
    src/
      index.ts
      sessionStore.ts
      types.ts
      unityInputRelay.ts

  web-client/
    src/
      App.tsx
      main.tsx
      components/
        HostScreen.tsx
        PlayerScreen.tsx
        TouchControls.tsx
      networking/
        socket.ts
        webrtc.ts

  unity-bridge/
    Assets/
      CloudGamingBridge/
        CloudInputReceiver.cs
        CloudInputState.cs
        SamplePlatformerInputAdapter.cs

  docs/
    architecture.md
    latency-testing.md
```

## Important Files

| File | Role |
| --- | --- |
| `server/src/index.ts` | Starts the Express and Socket.IO server, handles session joins, WebRTC signaling, ping checks, and mobile input events. |
| `server/src/sessionStore.ts` | Tracks which socket is the host and which socket is the player for each game session. |
| `server/src/unityInputRelay.ts` | Converts mobile input packets into UDP messages and sends them to Unity on `127.0.0.1:7777`. |
| `server/src/types.ts` | Defines shared server-side packet types for roles, signaling, and input. |
| `web-client/src/App.tsx` | Routes the browser to either the laptop host page or the mobile player page. |
| `web-client/src/components/HostScreen.tsx` | Laptop-side page that captures the Unity window with `getDisplayMedia`, creates the WebRTC offer, and shows input diagnostics. |
| `web-client/src/components/PlayerScreen.tsx` | Phone-side page that receives the WebRTC stream, answers the host offer, and displays connection status. |
| `web-client/src/components/TouchControls.tsx` | Sends left, right, jump, and attack input from the mobile browser at a steady update rate. |
| `web-client/src/networking/socket.ts` | Configures the Socket.IO client connection to the local signaling server. |
| `web-client/src/networking/webrtc.ts` | Creates WebRTC peer connections and attaches incoming media streams to video elements. |
| `unity-bridge/Assets/CloudGamingBridge/CloudInputReceiver.cs` | Unity component that listens for UDP input packets from the Node.js server. |
| `unity-bridge/Assets/CloudGamingBridge/CloudInputState.cs` | Unity data model for one frame of mobile input. |
| `unity-bridge/Assets/CloudGamingBridge/SamplePlatformerInputAdapter.cs` | Reference adapter showing how cloud input can drive a Rigidbody2D platformer. |
| `docs/architecture.md` | Explains the system design and why this approach works on low-end hardware. |
| `docs/latency-testing.md` | Notes for measuring ping, FPS, bitrate, and demo performance. |

## Running The MVP

Install dependencies:

```bash
npm install
```

Start the backend and web client:

```bash
npm run dev
```

Open the host page on the laptop:

```text
http://localhost:5173/host
```

Open the player page on the phone using the laptop LAN IP:

```text
http://192.168.x.x:5173/player
```

The host page must be opened on `localhost` in Chrome or Edge because browser screen capture requires a secure development context. The phone should use the LAN URL shown by Vite in the terminal.

## Demo Flow

1. Start the Node.js server and React client with `npm run dev`.
2. Open the Unity platformer and press Play.
3. Open `/host` on the laptop.
4. Click `Start capture` and select the Unity Game window.
5. Open `/player` on the phone.
6. Use the mobile controls to move, jump, and attack in Unity.

## Current MVP Limitations

- The host browser currently captures the Unity window manually.
- The game must already be running in Unity or as a desktop build.
- The current version is optimized for local Wi-Fi/LAN testing.
- Mobile controls are simple buttons, not yet a polished virtual joystick.
- The mobile app does not yet include a game library or launch screen.

## Planned Product Upgrades

The MVP is designed so the next layer can feel like a real cloud gaming platform:

- Mobile game library screen
- Game launch and loading state
- Server-managed Unity executable process
- Session QR code for quick phone pairing
- 480p / 720p stream quality modes
- FPS, bitrate, ping, and packet-loss overlay
- Improved virtual joystick and control layouts
- Game session status: offline, launching, running, connected
- Optional remote access with Tailscale or a TURN server

## Resume Summary

PocketStream demonstrates end-to-end cloud gaming fundamentals:

- Built a browser-based cloud gaming MVP for streaming a Unity 2D platformer from a laptop to a mobile browser.
- Implemented WebRTC video streaming, Socket.IO signaling, mobile touch input, and UDP-based Unity input relay.
- Designed a low-end-hardware-friendly architecture that separates game execution, browser streaming, backend signaling, and Unity input handling.

Example resume bullet:

```text
Built PocketStream, a Unity cloud gaming MVP that streams a PC-hosted 2D platformer to mobile browsers using WebRTC, React, Node.js, TypeScript, Socket.IO, and C#, with real-time touch input relayed into Unity over UDP.
```
