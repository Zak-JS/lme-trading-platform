import { sqliteTable, text, real, integer } from "drizzle-orm/sqlite-core";

export const positions = sqliteTable("positions", {
  id: text("id").primaryKey(),
  symbol: text("symbol").notNull(),
  side: text("side").notNull(), // 'LONG' | 'SHORT'
  quantity: real("quantity").notNull(),
  avgCost: real("avg_cost").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const trades = sqliteTable("trades", {
  id: text("id").primaryKey(),
  symbol: text("symbol").notNull(),
  side: text("side").notNull(), // 'BUY' | 'SELL'
  orderType: text("order_type").notNull(), // 'MARKET' | 'LIMIT'
  quantity: real("quantity").notNull(),
  price: real("price").notNull(),
  limitPrice: real("limit_price"),
  total: real("total").notNull(),
  status: text("status").notNull(),
  executedAt: integer("executed_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const priceHistory = sqliteTable("price_history", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  symbol: text("symbol").notNull(),
  open: real("open").notNull(),
  high: real("high").notNull(),
  low: real("low").notNull(),
  close: real("close").notNull(),
  timestamp: integer("timestamp", { mode: "timestamp" }).notNull(),
});
