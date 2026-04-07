import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema.js";

const sqlite = new Database("data.db");
export const db = drizzle(sqlite, { schema });

// Create tables if they don't exist
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS positions (
    id TEXT PRIMARY KEY,
    symbol TEXT NOT NULL,
    side TEXT NOT NULL,
    quantity REAL NOT NULL,
    avg_cost REAL NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS trades (
    id TEXT PRIMARY KEY,
    symbol TEXT NOT NULL,
    side TEXT NOT NULL,
    order_type TEXT NOT NULL,
    quantity REAL NOT NULL,
    price REAL NOT NULL,
    limit_price REAL,
    total REAL NOT NULL,
    status TEXT NOT NULL,
    executed_at INTEGER,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS price_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    symbol TEXT NOT NULL,
    open REAL NOT NULL,
    high REAL NOT NULL,
    low REAL NOT NULL,
    close REAL NOT NULL,
    timestamp INTEGER NOT NULL
  );
`);

// Seed initial data if positions table is empty
const positionCount = sqlite
  .prepare("SELECT COUNT(*) as count FROM positions")
  .get() as { count: number };
if (positionCount.count === 0) {
  console.log("🌱 Seeding initial data...");
  const now = Date.now();

  // Seed positions
  const insertPosition = sqlite.prepare(`
    INSERT INTO positions (id, symbol, side, quantity, avg_cost, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const positions = [
    { symbol: "CU", side: "LONG", quantity: 100, avgCost: 8400 },
    { symbol: "AL", side: "LONG", quantity: 250, avgCost: 2280 },
    { symbol: "NI", side: "LONG", quantity: 50, avgCost: 15800 },
    { symbol: "ZN", side: "SHORT", quantity: 75, avgCost: 2500 },
    { symbol: "PB", side: "SHORT", quantity: 30, avgCost: 2150 },
  ];

  for (let i = 0; i < positions.length; i++) {
    const pos = positions[i];
    insertPosition.run(
      `pos_${i + 1}`,
      pos.symbol,
      pos.side,
      pos.quantity,
      pos.avgCost,
      now,
      now,
    );
  }

  console.log(`✅ Seeded ${positions.length} positions`);
}

export * from "./schema.js";
