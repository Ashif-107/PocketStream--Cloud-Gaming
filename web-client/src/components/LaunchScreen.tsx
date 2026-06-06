import { useEffect, useMemo, useState } from "react";
import { getGameById } from "../gameCatalog";

export function LaunchScreen() {
  const [step, setStep] = useState("Preparing session");
  const game = useMemo(() => {
    const url = new URL(window.location.href);
    return getGameById(url.searchParams.get("game"));
  }, []);

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setStep("Finding host"), 700),
      window.setTimeout(() => setStep("Connecting stream"), 1400),
      window.setTimeout(() => {
        window.location.href = `/player?session=${encodeURIComponent(game.sessionId)}&game=${encodeURIComponent(game.id)}`;
      }, 2100)
    ];

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [game]);

  return (
    <main className="screen launch-screen">
      <section className="launch-panel">
        <p className="eyebrow">Launching</p>
        <h1>{game.title}</h1>
        <div className="loading-bar" aria-hidden="true">
          <span />
        </div>
        <strong>{step}</strong>
      </section>
    </main>
  );
}
