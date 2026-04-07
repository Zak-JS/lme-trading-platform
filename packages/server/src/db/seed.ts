import { db, positions, priceHistory } from "./index";
import { METALS } from "@lme/shared";
import { nanoid } from "nanoid";

async function seed() {
  console.log("🌱 Seeding database...");

  const now = new Date();

  // Seed initial positions (LONG and SHORT)
  const initialPositions = [
    { symbol: "CU", side: "LONG", quantity: 100, avgCost: 8400 },
    { symbol: "AL", side: "LONG", quantity: 250, avgCost: 2280 },
    { symbol: "NI", side: "LONG", quantity: 50, avgCost: 15800 },
    { symbol: "ZN", side: "SHORT", quantity: -75, avgCost: 2500 },
    { symbol: "PB", side: "SHORT", quantity: -30, avgCost: 2150 },
  ];

  for (const pos of initialPositions) {
    await db.insert(positions).values({
      id: `pos_${nanoid(10)}`,
      symbol: pos.symbol,
      side: pos.side,
      quantity: pos.quantity,
      avgCost: pos.avgCost,
      createdAt: now,
      updatedAt: now,
    });
  }

  console.log(`✅ Inserted ${initialPositions.length} positions`);

  // Seed price history (last 30 days of daily candles)
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  for (const metal of METALS) {
    let price: number = metal.basePrice;
    const candles = [];

    for (let i = 0; i < 30; i++) {
      const timestamp = new Date(
        thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000,
      );
      const volatility = metal.basePrice * 0.02; // 2% daily volatility
      const change = (Math.random() - 0.5) * volatility;

      const open = price;
      const close = price + change;
      const high = Math.max(open, close) + Math.random() * volatility * 0.5;
      const low = Math.min(open, close) - Math.random() * volatility * 0.5;

      candles.push({
        symbol: metal.symbol,
        open,
        high,
        low,
        close,
        timestamp,
      });

      price = close;
    }

    await db.insert(priceHistory).values(candles);
    console.log(`✅ Inserted ${candles.length} candles for ${metal.symbol}`);
  }

  console.log("🎉 Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
