import { useEffect, type CSSProperties } from "react";
import { games } from "../gameCatalog";
import { launchGame } from "../networking/game";
import { socket } from "../networking/socket";


export function GameLibrary() {

  useEffect(() => {
    socket.connect();
    console.log("Library socket connected");

    return () => {
      socket.disconnect();
    };
  }, []);

  const handlePlay = (gameId: string) => {
    launchGame(gameId);

    setTimeout(() => {
      window.location.href = "/player";
    }, 1500);
  };

  return (
    <main className="screen library-screen">
      <section className="library-hero">
        <div>
          <p className="eyebrow">PocketStream</p>
          <h1>Game Library</h1>
          <p className="library-subtitle">Choose a hosted Unity game and start playing from your phone.</p>
        </div>
      </section>

      <section className="library-grid" aria-label="Available games">
        {games.map((game) => (
          <article className="game-card" key={game.id} style={{ "--accent": game.accent } as CSSProperties}>
            <div className="game-art">
              <img src={`../dist/assets/jelloman.png`} alt={`${game.title} cover art`} className="game-poster" />
            </div>
            <div className="game-copy">
              <div>
                <p className="game-status">{game.status === "ready" ? "Ready to stream" : "Offline"}</p>
                <h2>{game.title}</h2>
                <p>{game.subtitle}</p>
              </div>
              <p className="game-description">{game.description}</p>
              <button className="primary-button play-button" onClick={() => handlePlay(game.id)} disabled={game.status !== "ready"}>
                Play
              </button>
            </div>
          </article>
        ))}
      </section>

      <section className="library-hero">
        <div>
          <p className="library-subtitle">©️  Made by Ashif</p>
          <p className="library-subtitle">Github: Ashif-107</p>
        </div>
      </section>
    </main>
  );
}
