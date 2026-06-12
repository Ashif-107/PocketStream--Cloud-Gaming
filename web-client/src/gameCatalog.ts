export interface GameCatalogItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  sessionId: string;
  status: "ready" | "offline";
  accent: string;
}

export const games: GameCatalogItem[] = [
  {
    id: "jelloman",
    title: "JELLO MAN",
    subtitle: "2D action platformer",
    description: "Stream the laptop-hosted Unity build and control the player from this phone.",
    sessionId: "jelloman",
    status: "ready",
    accent: "#20d36b"
  }
];

export function getGameById(id: string | null) {
  return games.find((game) => game.id === id) ?? games[0];
}
