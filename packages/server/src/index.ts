import Fastify from "fastify";
import cors from "@fastify/cors";
import websocket from "@fastify/websocket";
import fastifyStatic from "@fastify/static";
import path from "path";
import { fileURLToPath } from "url";
import { registerRoutes } from "./routes/index.js";
import { websocketHandler, broadcastPriceUpdate } from "./websocket/index.js";
import { priceService } from "./services/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
const HOST = process.env.HOST || "0.0.0.0";

async function main() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, {
    origin: true,
    credentials: true,
  });

  await fastify.register(websocket);

  await registerRoutes(fastify);
  await fastify.register(websocketHandler);

  priceService.onPriceUpdate((price) => {
    broadcastPriceUpdate({ type: "PRICE_UPDATE", data: price });
  });

  priceService.startSimulation(1500);

  fastify.get("/health", async () => {
    return { status: "ok", timestamp: new Date().toISOString() };
  });

  // Serve static client files in production
  const clientDistPath = path.join(__dirname, "../../client/dist");
  await fastify.register(fastifyStatic, {
    root: clientDistPath,
    prefix: "/",
    decorateReply: false,
  });

  // SPA fallback - serve index.html for non-API routes
  fastify.setNotFoundHandler(async (request, reply) => {
    if (!request.url.startsWith("/api") && !request.url.startsWith("/ws")) {
      return reply.sendFile("index.html");
    }
    return reply.status(404).send({ error: "Not found" });
  });

  try {
    await fastify.listen({ port: PORT, host: HOST });
    console.log(`🚀 Server running at http://${HOST}:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

main();
