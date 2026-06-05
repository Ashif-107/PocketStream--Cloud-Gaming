import { HostScreen } from "./components/HostScreen";
import { PlayerScreen } from "./components/PlayerScreen";

function getSessionId() {
  const url = new URL(window.location.href);
  return url.searchParams.get("session") ?? "demo";
}

export default function App() {
  const path = window.location.pathname;
  const sessionId = getSessionId();

  if (path.startsWith("/host")) {
    return <HostScreen sessionId={sessionId} />;
  }

  return <PlayerScreen sessionId={sessionId} />;
}
