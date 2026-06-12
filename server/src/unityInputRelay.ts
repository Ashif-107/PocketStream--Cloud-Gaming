import dgram from "node:dgram";
import type { CloudInputPacket } from "./types.js";

export class UnityInputRelay {
  private readonly socket = dgram.createSocket("udp4");

  constructor(
    private readonly host: string,
    private readonly port: number
  ) { }

  send(packet: CloudInputPacket) {
    console.log(
      `[UDP] move=${packet.moveX} jump=${packet.jump} attack=${packet.attack}`
    );

    const message = Buffer.from(JSON.stringify(packet));

    this.socket.send(message, this.port, this.host, (error) => {
      if (error) {
        console.error("[unity-input] failed to relay packet", error);
      }
    });
  }
}
