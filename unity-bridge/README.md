# Unity Bridge

The Unity bridge contains the C# scripts that let PocketStream control a Unity game from the mobile browser.

## Files

| File | Purpose |
| --- | --- |
| `Assets/CloudGamingBridge/CloudInputReceiver.cs` | Listens for mobile input packets from the Node.js server over UDP. |
| `Assets/CloudGamingBridge/CloudInputState.cs` | Stores one frame of cloud input: movement, jump, attack, timestamp, and sequence. |
| `Assets/CloudGamingBridge/SamplePlatformerInputAdapter.cs` | Example adapter for applying cloud input to a Rigidbody2D platformer. |

## Unity Setup

Copy `Assets/CloudGamingBridge` into your Unity project's `Assets` folder.

In your Unity scene:

1. Create an empty GameObject named `PocketStreamInput`.
2. Add the `CloudInputReceiver` component to it.
3. Keep the default UDP port as `7777`.
4. Drag `PocketStreamInput` into your player movement script's cloud input field.

`CloudInputState` is a data class and should not be attached to a GameObject.

## Runtime Flow

```text
Phone controls
  -> Socket.IO
  -> Node.js server
  -> UDP 127.0.0.1:7777
  -> CloudInputReceiver
  -> PlayerMovement
```
