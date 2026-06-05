# Unity Bridge

Copy `Assets/CloudGamingBridge` into your Unity project's `Assets` folder.

## Scene Setup

1. Create an empty GameObject named `PocketStreamInput`.
2. Add `CloudInputReceiver` to it.
3. Keep the default UDP port `7777`.
4. Connect your player controller to `CloudInputReceiver.LatestInput`.

`SamplePlatformerInputAdapter` is optional. It shows a simple Rigidbody2D mapping:

- `moveX` controls horizontal velocity.
- `jump` applies an impulse when grounded.
- `attack` is left as a hook for your own combat/interact mechanic.

For your existing controller, prefer adding a small method like:

```csharp
public void ApplyCloudInput(float moveX, bool jump, bool attack)
{
    // Feed these values into your existing movement code.
}
```

Then call it from a short adapter script.
