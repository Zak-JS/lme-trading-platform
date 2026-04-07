import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { db, trades, positions } from "../db";
import { priceService } from "./priceService";
import type {
  Trade,
  Position,
  PositionSide,
  CreateTradeRequest,
  MetalSymbol,
  OrderType,
} from "@lme/shared";

class TradeService {
  async executeTrade(
    request: CreateTradeRequest,
  ): Promise<{ trade: Trade; updatedPosition: Position | null }> {
    const { symbol, side, orderType, quantity, limitPrice } = request;
    const currentPrice = priceService.getCurrentPrice(symbol);
    const now = new Date();

    // For LIMIT orders, check if the price condition is met
    let executionPrice = currentPrice;
    let status: Trade["status"] = "FILLED";
    let executedAt: Date | null = now;

    if (orderType === "LIMIT" && limitPrice) {
      // BUY LIMIT: only execute if current price <= limit price
      // SELL LIMIT: only execute if current price >= limit price
      const canExecute =
        side === "BUY"
          ? currentPrice <= limitPrice
          : currentPrice >= limitPrice;

      if (!canExecute) {
        status = "PENDING";
        executedAt = null;
        executionPrice = 0; // Not executed yet
      } else {
        executionPrice = limitPrice;
      }
    }

    const total = status === "FILLED" ? executionPrice * quantity : 0;

    const trade: Trade = {
      id: `trd_${nanoid(10)}`,
      symbol,
      side,
      orderType,
      quantity,
      price: executionPrice,
      limitPrice: limitPrice ?? null,
      total,
      status,
      executedAt: executedAt?.toISOString() ?? null,
      createdAt: now.toISOString(),
    };

    await db.insert(trades).values({
      id: trade.id,
      symbol: trade.symbol,
      side: trade.side,
      orderType: trade.orderType,
      quantity: trade.quantity,
      price: trade.price,
      limitPrice: trade.limitPrice,
      total: trade.total,
      status: trade.status,
      executedAt: executedAt,
      createdAt: now,
    });

    // Only update position if trade was filled
    let updatedPosition: Position | null = null;
    if (status === "FILLED") {
      updatedPosition = await this.updatePosition(
        symbol,
        side,
        quantity,
        executionPrice,
      );
    }

    return { trade, updatedPosition };
  }

  private async updatePosition(
    symbol: MetalSymbol,
    tradeSide: "BUY" | "SELL",
    quantity: number,
    price: number,
  ): Promise<Position | null> {
    const now = new Date();
    const existingPositions = await db
      .select()
      .from(positions)
      .where(eq(positions.symbol, symbol));

    const existing = existingPositions[0];

    // Determine position side: BUY creates LONG, SELL creates SHORT
    const positionSide: PositionSide = tradeSide === "BUY" ? "LONG" : "SHORT";
    const quantityDelta = tradeSide === "BUY" ? quantity : -quantity;

    if (existing) {
      const newQuantity = existing.quantity + quantityDelta;

      // Position closed
      if (Math.abs(newQuantity) < 0.0001) {
        await db.delete(positions).where(eq(positions.id, existing.id));
        return null;
      }

      // Determine new side based on quantity sign
      const newSide: PositionSide = newQuantity > 0 ? "LONG" : "SHORT";

      let newAvgCost = existing.avgCost;
      // Only recalculate avg cost when adding to position in same direction
      if (
        (tradeSide === "BUY" && existing.quantity > 0) ||
        (tradeSide === "SELL" && existing.quantity < 0)
      ) {
        const totalCost =
          Math.abs(existing.quantity) * existing.avgCost + quantity * price;
        newAvgCost = totalCost / Math.abs(newQuantity);
      }

      await db
        .update(positions)
        .set({
          quantity: newQuantity,
          side: newSide,
          avgCost: newAvgCost,
          updatedAt: now,
        })
        .where(eq(positions.id, existing.id));

      return this.getPositionById(existing.id);
    } else {
      // Create new position
      const newPosition = {
        id: `pos_${nanoid(10)}`,
        symbol,
        side: positionSide,
        quantity: quantityDelta,
        avgCost: price,
        createdAt: now,
        updatedAt: now,
      };

      await db.insert(positions).values(newPosition);
      return this.getPositionById(newPosition.id);
    }
  }

  private async getPositionById(id: string): Promise<Position | null> {
    const results = await db
      .select()
      .from(positions)
      .where(eq(positions.id, id));
    const pos = results[0];
    if (!pos) return null;

    const currentPrice = priceService.getCurrentPrice(
      pos.symbol as MetalSymbol,
    );
    const absQuantity = Math.abs(pos.quantity);
    const marketValue = absQuantity * currentPrice;
    const costBasis = absQuantity * pos.avgCost;

    // For SHORT positions, P&L is inverted
    const isLong = pos.side === "LONG";
    const unrealizedPnL = isLong
      ? marketValue - costBasis
      : costBasis - marketValue;
    const unrealizedPnLPercent =
      costBasis > 0 ? (unrealizedPnL / costBasis) * 100 : 0;

    return {
      id: pos.id,
      symbol: pos.symbol as MetalSymbol,
      side: pos.side as PositionSide,
      quantity: absQuantity,
      avgCost: pos.avgCost,
      currentPrice,
      marketValue,
      unrealizedPnL,
      unrealizedPnLPercent,
      createdAt: pos.createdAt.toISOString(),
      updatedAt: pos.updatedAt.toISOString(),
    };
  }

  async getAllTrades(): Promise<Trade[]> {
    const results = await db.select().from(trades).orderBy(trades.createdAt);

    return results.map((t) => ({
      id: t.id,
      symbol: t.symbol as MetalSymbol,
      side: t.side as "BUY" | "SELL",
      orderType: t.orderType as OrderType,
      quantity: t.quantity,
      price: t.price,
      limitPrice: t.limitPrice,
      total: t.total,
      status: t.status as Trade["status"],
      executedAt: t.executedAt?.toISOString() ?? null,
      createdAt: t.createdAt.toISOString(),
    }));
  }

  async getRecentTrades(limit: number = 20): Promise<Trade[]> {
    const all = await this.getAllTrades();
    // Only return filled trades
    const filledTrades = all.filter((t) => t.status === "FILLED");
    return filledTrades.slice(-limit).reverse();
  }

  async getPendingOrders(): Promise<Trade[]> {
    const all = await this.getAllTrades();
    return all.filter((t) => t.status === "PENDING").reverse();
  }

  async cancelOrder(orderId: string): Promise<Trade | null> {
    const results = await db
      .select()
      .from(trades)
      .where(eq(trades.id, orderId));
    const order = results[0];

    if (!order || order.status !== "PENDING") {
      return null;
    }

    await db
      .update(trades)
      .set({ status: "CANCELLED" })
      .where(eq(trades.id, orderId));

    return {
      id: order.id,
      symbol: order.symbol as MetalSymbol,
      side: order.side as "BUY" | "SELL",
      orderType: order.orderType as OrderType,
      quantity: order.quantity,
      price: order.price,
      limitPrice: order.limitPrice,
      total: order.total,
      status: "CANCELLED",
      executedAt: null,
      createdAt: order.createdAt.toISOString(),
    };
  }
}

export const tradeService = new TradeService();
