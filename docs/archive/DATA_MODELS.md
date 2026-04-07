# LME Trading Platform - Data Models

## Overview

This document defines the data models used throughout the application. These types are defined in the `@lme/shared` package and used by both client and server.

---

## 1. Metal Constants

### 1.1 Supported Metals

```typescript
export const METALS = [
  { symbol: 'CU', name: 'Copper', lotSize: 25 },
  { symbol: 'AL', name: 'Aluminium', lotSize: 25 },
  { symbol: 'ZN', name: 'Zinc', lotSize: 25 },
  { symbol: 'PB', name: 'Lead', lotSize: 25 },
  { symbol: 'NI', name: 'Nickel', lotSize: 6 },
  { symbol: 'SN', name: 'Tin', lotSize: 5 },
] as const;

export type MetalSymbol = typeof METALS[number]['symbol'];
// Results in: 'CU' | 'AL' | 'ZN' | 'PB' | 'NI' | 'SN'
```

### 1.2 Base Prices (USD per Metric Ton)

These are approximate real-world prices used for simulation:

| Metal | Symbol | Base Price | Typical Daily Range |
|-------|--------|------------|---------------------|
| Copper | CU | $8,500 | ±$100 |
| Aluminium | AL | $2,300 | ±$30 |
| Zinc | ZN | $2,800 | ±$40 |
| Lead | PB | $2,100 | ±$25 |
| Nickel | NI | $16,000 | ±$200 |
| Tin | SN | $25,000 | ±$300 |

---

## 2. Core Types

### 2.1 MetalPrice

Represents the current market price for a metal.

```typescript
export interface MetalPrice {
  /** Metal symbol (e.g., 'CU' for Copper) */
  symbol: MetalSymbol;
  
  /** Human-readable name */
  name: string;
  
  /** Current price in USD per metric ton */
  price: number;
  
  /** Absolute change from previous close */
  change: number;
  
  /** Percentage change from previous close */
  changePercent: number;
  
  /** Day's high price */
  high: number;
  
  /** Day's low price */
  low: number;
  
  /** Previous day's closing price */
  previousClose: number;
  
  /** Timestamp of last update (ISO 8601) */
  updatedAt: string;
}
```

**Example:**
```json
{
  "symbol": "CU",
  "name": "Copper",
  "price": 8523.50,
  "change": 23.50,
  "changePercent": 0.28,
  "high": 8545.00,
  "low": 8480.00,
  "previousClose": 8500.00,
  "updatedAt": "2026-04-05T18:30:00.000Z"
}
```

### 2.2 Position

Represents a user's holding in a specific metal.

```typescript
export interface Position {
  /** Unique position ID */
  id: string;
  
  /** Metal symbol */
  symbol: MetalSymbol;
  
  /** Quantity in metric tons (negative for short positions) */
  quantity: number;
  
  /** Average cost per metric ton */
  avgCost: number;
  
  /** Current market price */
  currentPrice: number;
  
  /** Current market value (quantity × currentPrice) */
  marketValue: number;
  
  /** Unrealized profit/loss in USD */
  unrealizedPnL: number;
  
  /** Unrealized P&L as percentage */
  unrealizedPnLPercent: number;
  
  /** When position was opened */
  createdAt: string;
  
  /** Last update timestamp */
  updatedAt: string;
}
```

**Example:**
```json
{
  "id": "pos_abc123",
  "symbol": "CU",
  "quantity": 100,
  "avgCost": 8400.00,
  "currentPrice": 8523.50,
  "marketValue": 852350.00,
  "unrealizedPnL": 12350.00,
  "unrealizedPnLPercent": 1.47,
  "createdAt": "2026-04-01T09:00:00.000Z",
  "updatedAt": "2026-04-05T18:30:00.000Z"
}
```

### 2.3 Trade

Represents an executed trade.

```typescript
export type TradeSide = 'BUY' | 'SELL';
export type TradeStatus = 'PENDING' | 'FILLED' | 'REJECTED' | 'CANCELLED';

export interface Trade {
  /** Unique trade ID */
  id: string;
  
  /** Metal symbol */
  symbol: MetalSymbol;
  
  /** Buy or sell */
  side: TradeSide;
  
  /** Quantity in metric tons */
  quantity: number;
  
  /** Execution price per metric ton */
  price: number;
  
  /** Total trade value (quantity × price) */
  total: number;
  
  /** Trade status */
  status: TradeStatus;
  
  /** Execution timestamp */
  executedAt: string;
  
  /** Creation timestamp */
  createdAt: string;
}
```

**Example:**
```json
{
  "id": "trd_xyz789",
  "symbol": "AL",
  "side": "BUY",
  "quantity": 50,
  "price": 2315.00,
  "total": 115750.00,
  "status": "FILLED",
  "executedAt": "2026-04-05T14:22:15.000Z",
  "createdAt": "2026-04-05T14:22:15.000Z"
}
```

### 2.4 PriceCandle

Represents OHLC data for charting.

```typescript
export interface PriceCandle {
  /** Metal symbol */
  symbol: MetalSymbol;
  
  /** Candle timestamp (start of period) */
  timestamp: string;
  
  /** Opening price */
  open: number;
  
  /** Highest price in period */
  high: number;
  
  /** Lowest price in period */
  low: number;
  
  /** Closing price */
  close: number;
  
  /** Trading volume (optional) */
  volume?: number;
}
```

---

## 3. API Request/Response Types

### 3.1 Trade Execution

```typescript
// Request
export interface CreateTradeRequest {
  symbol: MetalSymbol;
  side: TradeSide;
  quantity: number;
}

// Response
export interface CreateTradeResponse {
  trade: Trade;
  updatedPosition: Position;
}
```

### 3.2 Price History

```typescript
// Request (query params)
export interface PriceHistoryParams {
  symbol: MetalSymbol;
  interval: '1m' | '5m' | '15m' | '1h' | '1d';
  from?: string;  // ISO 8601
  to?: string;    // ISO 8601
  limit?: number; // Default 100, max 1000
}

// Response
export interface PriceHistoryResponse {
  symbol: MetalSymbol;
  interval: string;
  candles: PriceCandle[];
}
```

### 3.3 Portfolio Summary

```typescript
export interface PortfolioSummary {
  /** Total market value of all positions */
  totalValue: number;
  
  /** Total unrealized P&L */
  totalPnL: number;
  
  /** Total P&L as percentage */
  totalPnLPercent: number;
  
  /** Number of open positions */
  positionCount: number;
  
  /** Breakdown by metal */
  allocation: {
    symbol: MetalSymbol;
    value: number;
    percentage: number;
  }[];
}
```

---

## 4. WebSocket Message Types

### 4.1 Client → Server

```typescript
export type ClientMessage = 
  | { type: 'SUBSCRIBE'; symbols: MetalSymbol[] }
  | { type: 'UNSUBSCRIBE'; symbols: MetalSymbol[] }
  | { type: 'PING' };
```

### 4.2 Server → Client

```typescript
export type ServerMessage =
  | { type: 'PRICE_UPDATE'; data: MetalPrice }
  | { type: 'PRICE_SNAPSHOT'; data: MetalPrice[] }
  | { type: 'TRADE_EXECUTED'; data: Trade }
  | { type: 'POSITION_UPDATED'; data: Position }
  | { type: 'PONG' }
  | { type: 'ERROR'; message: string };
```

---

## 5. Validation Schemas (Zod)

```typescript
import { z } from 'zod';

export const metalSymbolSchema = z.enum(['CU', 'AL', 'ZN', 'PB', 'NI', 'SN']);

export const tradeSideSchema = z.enum(['BUY', 'SELL']);

export const createTradeSchema = z.object({
  symbol: metalSymbolSchema,
  side: tradeSideSchema,
  quantity: z.number().positive().max(10000),
});

export const priceHistoryParamsSchema = z.object({
  symbol: metalSymbolSchema,
  interval: z.enum(['1m', '5m', '15m', '1h', '1d']),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  limit: z.number().int().min(1).max(1000).default(100),
});
```

---

## 6. Database Schema (Drizzle)

```typescript
import { sqliteTable, text, real, integer } from 'drizzle-orm/sqlite-core';

export const positions = sqliteTable('positions', {
  id: text('id').primaryKey(),
  symbol: text('symbol').notNull(),
  quantity: real('quantity').notNull(),
  avgCost: real('avg_cost').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const trades = sqliteTable('trades', {
  id: text('id').primaryKey(),
  symbol: text('symbol').notNull(),
  side: text('side').notNull(), // 'BUY' | 'SELL'
  quantity: real('quantity').notNull(),
  price: real('price').notNull(),
  total: real('total').notNull(),
  status: text('status').notNull(), // 'PENDING' | 'FILLED' | 'REJECTED'
  executedAt: integer('executed_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const priceHistory = sqliteTable('price_history', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  symbol: text('symbol').notNull(),
  open: real('open').notNull(),
  high: real('high').notNull(),
  low: real('low').notNull(),
  close: real('close').notNull(),
  timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
});
```

---

## 7. Type Exports

All types are exported from the shared package:

```typescript
// packages/shared/src/index.ts
export * from './types/metals';
export * from './types/trading';
export * from './types/api';
export * from './types/websocket';
export * from './constants/metals';
export * from './schemas/validation';
```

Usage in client/server:

```typescript
import { 
  MetalPrice, 
  Trade, 
  Position,
  CreateTradeRequest,
  METALS,
  createTradeSchema 
} from '@lme/shared';
```

---

*Document Version: 1.0*  
*Last Updated: April 2026*
