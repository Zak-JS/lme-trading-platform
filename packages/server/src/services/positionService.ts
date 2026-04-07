import { db, positions } from "../db";
import { priceService } from "./priceService";
import type {
  Position,
  PositionSide,
  PortfolioSummary,
  MetalSymbol,
} from "@lme/shared";

class PositionService {
  async getAllPositions(): Promise<Position[]> {
    const results = await db.select().from(positions);

    return results.map((pos) => {
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
        costBasis !== 0 ? (unrealizedPnL / costBasis) * 100 : 0;

      return {
        id: pos.id,
        symbol: pos.symbol as MetalSymbol,
        side: pos.side as PositionSide,
        quantity: absQuantity,
        avgCost: Math.round(pos.avgCost * 100) / 100,
        currentPrice: Math.round(currentPrice * 100) / 100,
        marketValue: Math.round(marketValue * 100) / 100,
        unrealizedPnL: Math.round(unrealizedPnL * 100) / 100,
        unrealizedPnLPercent: Math.round(unrealizedPnLPercent * 100) / 100,
        createdAt: pos.createdAt.toISOString(),
        updatedAt: pos.updatedAt.toISOString(),
      };
    });
  }

  async getPortfolioSummary(): Promise<PortfolioSummary> {
    const allPositions = await this.getAllPositions();

    const totalValue = allPositions.reduce(
      (sum, pos) => sum + pos.marketValue,
      0,
    );
    const totalCost = allPositions.reduce(
      (sum, pos) => sum + pos.quantity * pos.avgCost,
      0,
    );
    const totalPnL = totalValue - totalCost;
    const totalPnLPercent = totalCost !== 0 ? (totalPnL / totalCost) * 100 : 0;

    const allocation = allPositions.map((pos) => ({
      symbol: pos.symbol,
      value: pos.marketValue,
      percentage: totalValue !== 0 ? (pos.marketValue / totalValue) * 100 : 0,
    }));

    return {
      totalValue: Math.round(totalValue * 100) / 100,
      totalPnL: Math.round(totalPnL * 100) / 100,
      totalPnLPercent: Math.round(totalPnLPercent * 100) / 100,
      positionCount: allPositions.length,
      allocation,
    };
  }
}

export const positionService = new PositionService();
