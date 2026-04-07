# LME Trading Platform - Requirements Document

## Overview

This document outlines the requirements for a bespoke trading platform for the London Metal Exchange (LME). It serves as a demonstration of consultative requirements gathering and UX-driven development.

---

## 1. Domain Research

### 1.1 What is the London Metal Exchange?

The **London Metal Exchange (LME)** is the world's largest marketplace for trading base metals futures and options. Key facts:

- **Founded:** 1877
- **Acquired by:** Hong Kong Exchanges and Clearing (2012)
- **Annual Volume:** ~176 million lots (~$13.5 trillion)
- **Global Impact:** LME prices serve as the global benchmark for industrial metals

### 1.2 Trading Venues

The LME operates three trading venues:

| Venue | Description |
|-------|-------------|
| **The Ring** | Traditional open-outcry trading floor. 5-minute sessions per metal. |
| **LMEselect** | Electronic trading platform. Low-latency, FIX API integration. |
| **Telephone** | 24-hour inter-office telephone market. |

### 1.3 Metals Traded

#### Base Metals (Primary Focus)
| Metal | Symbol | Lot Size |
|-------|--------|----------|
| Copper | CU | 25 tonnes |
| Aluminium | AL | 25 tonnes |
| Zinc | ZN | 25 tonnes |
| Lead | PB | 25 tonnes |
| Nickel | NI | 6 tonnes |
| Tin | SN | 5 tonnes |

#### Also Traded (Out of Scope for MVP)
- Cobalt, Aluminium Alloys, Steel, Precious Metals (Gold, Silver, Platinum, Palladium)

### 1.4 Contract Types

| Type | Description |
|------|-------------|
| **Futures** | Obligation to buy/sell at fixed price on future date |
| **Options** | Right (not obligation) to buy/sell |
| **TAPOs** | Based on monthly average settlement price |
| **LMEminis** | Smaller lots, cash-settled |

### 1.5 Key Trading Concepts

- **Prompt Date Structure:** Traders can hedge to the exact day (up to 123 months out)
- **Ring Sessions:** 5-minute windows per metal in specific order
- **Official Settlement Price:** Last cash offer price, published 12:30-13:25 GMT
- **LME Warrants:** Digital documents representing entitlement to specific metal lots

---

## 2. User Research

### 2.1 User Personas

#### Persona A: Desk Trader
> "I need to react to price movements in seconds. Every click costs money."

| Attribute | Detail |
|-----------|--------|
| **Goal** | Execute trades quickly based on real-time price movements |
| **Environment** | Multiple monitors, high-pressure, time-sensitive |
| **Pain Points** | Latency, too many clicks, unclear price changes |
| **Needs** | Real-time updates, minimal UI friction, keyboard shortcuts |

#### Persona B: Portfolio Manager
> "I need to understand our overall exposure and P&L at a glance."

| Attribute | Detail |
|-----------|--------|
| **Goal** | Monitor positions, assess risk, report to stakeholders |
| **Environment** | Less time pressure, analytical focus |
| **Pain Points** | Scattered data, manual calculations, poor visualizations |
| **Needs** | Aggregated views, charts, export capabilities |

### 2.2 Questions for Stakeholder Discovery

If this were a real project, these are questions we would ask:

**For Traders:**
1. What information do you look at most frequently?
2. Walk me through a typical trade execution - what steps do you take?
3. What's the most frustrating part of your current platform?
4. Do you use keyboard shortcuts? Which actions need them?
5. How do you handle multiple metals simultaneously?

**For Portfolio Managers:**
1. What reports do you generate daily/weekly?
2. How do you currently calculate P&L and exposure?
3. What visualizations would help you most?
4. Do you need to drill down from summary to individual trades?

**For IT/Compliance:**
1. What audit trail requirements exist?
2. What are the latency requirements?
3. What systems does this need to integrate with?
4. What are the security/authentication requirements?

---

## 3. Functional Requirements

### 3.1 Core Features (MVP)

#### F1: Live Price Dashboard
- Display real-time prices for all 6 base metals
- Show price, change, change %, day high/low
- Visual indicators for price direction (green/red)
- Cell flashing on price updates
- Connection status indicator

#### F2: Trade Execution
- Quick trade panel (select metal, quantity, buy/sell)
- Trade confirmation dialog with price summary
- Immediate feedback on trade success/failure
- Trade appears in recent trades feed

#### F3: Recent Trades Feed
- Live feed of executed trades
- Show: time, metal, side, quantity, price
- Filterable by metal

#### F4: Portfolio Holdings View
- Table of current positions
- Show: metal, quantity, avg cost, current value, P&L
- Sortable columns
- Total portfolio value and P&L

#### F5: Price Chart
- Historical price visualization for selected metal
- Candlestick or line chart
- Selectable time ranges (1D, 1W, 1M, 3M)

#### F6: Allocation Overview
- Pie or bar chart showing portfolio allocation by metal
- Percentage breakdown

### 3.2 Future Features (Out of Scope)

- Price alerts with notifications
- Order book visualization
- Multiple prompt dates (futures expiry)
- User authentication
- Trade blotter export
- Watchlists
- Keyboard shortcuts

---

## 4. Non-Functional Requirements

### 4.1 Performance

| Requirement | Target | Rationale |
|-------------|--------|-----------|
| Price update latency | < 100ms | Traders need real-time data |
| UI responsiveness | 60fps | Smooth interactions |
| Initial load time | < 3s | Fast startup |
| WebSocket reconnection | Automatic, < 5s | Reliability |

### 4.2 Usability

- **Dark theme** by default (reduces eye strain for all-day use)
- **Information density** - show more data, less whitespace
- **Clear visual hierarchy** - most important data most prominent
- **Consistent patterns** - same interactions across features

### 4.3 Reliability

- Graceful degradation if WebSocket disconnects
- Clear error states with recovery actions
- No data loss on network interruption

---

## 5. Data Models

### 5.1 Metal Price

```typescript
interface MetalPrice {
  symbol: string;        // "CU", "AL", "ZN", "PB", "NI", "SN"
  name: string;          // "Copper", "Aluminium", etc.
  price: number;         // USD per metric ton
  change: number;        // Absolute change vs previous close
  changePercent: number; // Percentage change
  high: number;          // Day high
  low: number;           // Day low
  timestamp: Date;       // Last update time
}
```

### 5.2 Position

```typescript
interface Position {
  id: string;
  symbol: string;
  quantity: number;      // Metric tons (can be negative for short)
  avgCost: number;       // Average purchase price
  currentPrice: number;  // Latest market price
  currentValue: number;  // quantity * currentPrice
  pnl: number;           // Unrealized profit/loss
  pnlPercent: number;    // P&L as percentage
}
```

### 5.3 Trade

```typescript
interface Trade {
  id: string;
  symbol: string;
  side: "BUY" | "SELL";
  quantity: number;
  price: number;
  total: number;         // quantity * price
  timestamp: Date;
  status: "FILLED" | "PENDING" | "REJECTED";
}
```

### 5.4 Price History (for charts)

```typescript
interface PriceCandle {
  symbol: string;
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
}
```

---

## 6. Success Metrics

If this were a production platform, we would measure:

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Trade execution time | < 2 clicks from decision | User testing |
| Time to first meaningful paint | < 2s | Lighthouse |
| Error rate | < 0.1% | Monitoring |
| User satisfaction | > 4/5 | Surveys |

---

## 7. Assumptions & Constraints

### Assumptions
- Users have modern browsers (Chrome, Firefox, Edge)
- Users have stable internet connections
- Single user per session (no multi-user collaboration)
- USD as base currency

### Constraints
- 2-day development timeline
- Mock data (no real LME API access)
- No authentication required for demo
- Single timezone (London/GMT)

---

## 8. Open Questions

These would be resolved through stakeholder conversations:

1. Should traders see other traders' activity?
2. What's the maximum number of metals displayed simultaneously?
3. Are there compliance requirements for trade confirmations?
4. Should the platform support multiple languages?
5. What's the expected concurrent user count?

---

*Document Version: 1.0*  
*Last Updated: April 2026*
