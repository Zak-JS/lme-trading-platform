import { FastifyInstance } from "fastify";
import { WebSocket, type RawData } from "ws";
import { priceService } from "../services/index.js";
import type { ServerMessage, ClientMessage } from "@lme/shared";

const clients = new Set<WebSocket>();

export async function websocketHandler(fastify: FastifyInstance) {
  fastify.get("/ws", { websocket: true }, (socket) => {
    clients.add(socket);

    const snapshot: ServerMessage = {
      type: "PRICE_SNAPSHOT",
      data: priceService.getAllPrices(),
    };
    socket.send(JSON.stringify(snapshot));

    socket.on("message", (rawMessage: RawData) => {
      try {
        const message: ClientMessage = JSON.parse(rawMessage.toString());

        if (message.type === "PING") {
          const pong: ServerMessage = { type: "PONG" };
          socket.send(JSON.stringify(pong));
        }
      } catch {
        const error: ServerMessage = {
          type: "ERROR",
          message: "Invalid message format",
        };
        socket.send(JSON.stringify(error));
      }
    });

    socket.on("close", () => {
      clients.delete(socket);
    });
  });
}

export function broadcastPriceUpdate(price: ServerMessage) {
  const message = JSON.stringify(price);
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}

export function getConnectedClientsCount(): number {
  return clients.size;
}
