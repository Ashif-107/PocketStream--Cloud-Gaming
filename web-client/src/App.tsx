import { GameLibrary } from "./components/GameLibrary";
import { HostScreen } from "./components/HostScreen";
import { LaunchScreen } from "./components/LaunchScreen";
import { PlayerScreen } from "./components/PlayerScreen";

function getSessionId() {
  const url = new URL(window.location.href);
  return url.searchParams.get("session") ?? "platformer";
}

export default function App() {
  const path = window.location.pathname;
  const sessionId = getSessionId();

  if (path.startsWith("/host")) {
    return <HostScreen sessionId={sessionId} />;
  }

  if (path.startsWith("/launch")) {
    return <LaunchScreen />;
  }

  if (path.startsWith("/player")) {
    return <PlayerScreen sessionId={sessionId} />;
  }

  return <GameLibrary />;
}
