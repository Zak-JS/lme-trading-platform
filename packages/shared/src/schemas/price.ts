import { z } from "zod";
import { metalSymbolSchema } from "./trade.js";

export const priceHistoryIntervalSchema = z.enum([
  "1m",
  "5m",
  "15m",
  "1h",
  "1d",
]);

export const priceHistoryParamsSchema = z.object({
  symbol: metalSymbolSchema,
  interval: priceHistoryIntervalSchema,
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  limit: z.number().int().min(1).max(1000).default(100),
});

export type PriceHistoryInput = z.infer<typeof priceHistoryParamsSchema>;
