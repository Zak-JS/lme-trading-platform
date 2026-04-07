import { z } from "zod";

export const metalSymbolSchema = z.enum(["CU", "AL", "ZN", "PB", "NI", "SN"]);

export const tradeSideSchema = z.enum(["BUY", "SELL"]);

export const orderTypeSchema = z.enum(["MARKET", "LIMIT"]);

export const tradeStatusSchema = z.enum([
  "PENDING",
  "FILLED",
  "REJECTED",
  "CANCELLED",
]);

export const createTradeSchema = z
  .object({
    symbol: metalSymbolSchema,
    side: tradeSideSchema,
    orderType: orderTypeSchema,
    quantity: z
      .number()
      .positive("Quantity must be positive")
      .max(10000, "Quantity cannot exceed 10,000 tonnes"),
    limitPrice: z.number().positive("Limit price must be positive").optional(),
  })
  .refine(
    (data) => data.orderType !== "LIMIT" || data.limitPrice !== undefined,
    {
      message: "Limit price is required for LIMIT orders",
      path: ["limitPrice"],
    },
  );

export type CreateTradeInput = z.infer<typeof createTradeSchema>;
