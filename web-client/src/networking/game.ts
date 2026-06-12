import { socket } from "./socket";

export function launchGame(gameId: string) {
  socket.emit("game:launch", {
    gameId
  });
}

export function stopGame() {
  socket.emit("game:stop");
}