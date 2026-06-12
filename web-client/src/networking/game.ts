import { socket } from "./socket";

export function launchGame(gameId: string) {
  console.log("Launching", gameId);
  console.log("Socket connected?", socket.connected);

  socket.emit("game:launch", {
    gameId
  });
}

export function stopGame() {
  socket.emit("game:stop");
}