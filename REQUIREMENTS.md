# Requirements & Decision Making: LME Trading Platform

This document demonstrates consultative requirements gathering and technical decision-making for a bespoke London Metal Exchange trading platform.

---

## 1. Domain Research

### 1.1 Metals Traded

| Metal     | Symbol | Lot Size  | Typical Price (USD/tonne) |
| --------- | ------ | --------- | ------------------------- |
| Copper    | CU     | 25 tonnes | ~$8,500                   |
| Aluminium | AL     | 25 tonnes | ~$2,300                   |
| Zinc      | ZN     | 25 tonnes | ~$2,800                   |
| Lead      | PB     | 25 tonnes | ~$2,100                   |
| Nickel    | NI     | 6 tonnes  | ~$16,000                  |
| Tin       | SN     | 5 tonnes  | ~$25,000                  |

### 1.2 User Flows

#### Flow 1: Monitor Prices

```
1. User opens Trading page
2. PriceTable displays all 6 metals with real-time data
3. WebSocket streams price updates from server
4. Rows flash green/red on price changes (throttled to 3s cooldown)
5. User can sort by any column (price, change, volume)
6. Sparklines show 20-point price trend at a glance
7. Range bars indicate current price within day's high/low
```

#### Flow 2: Execute Trade

```
1. User clicks a row in PriceTable to select metal
2. TradePanel updates to show selected metal's current price
3. User enters quantity (metric tonnes)
4. User clicks BUY or SELL button
5. Trade executes at current market price
6. Position updates immediately in Holdings table
7. Trade appears in Recent Trades feed
```

#### Flow 3: Review Portfolio

```
1. User views Holdings table showing all positions
2. Each position shows: quantity, avg cost, current price, P&L
3. Unrealized P&L updates in real-time as prices change
4. Allocation pie chart shows portfolio breakdown by metal
5. Total portfolio value displayed at top
```

#### Flow 4: Manage Pending Orders

```
1. User creates limit order via TradePanel
2. Order appears in Pending Orders list with status
3. User can cancel pending orders
4. When price hits limit, order executes automatically
5. Position and trades update accordingly
```

---

## 2. User Research

### 2.1 User Personas

#### Persona A: Desk Trader

> "I need to react to price movements in seconds. Every click costs money."

| Attribute       | Detail                                                     |
| --------------- | ---------------------------------------------------------- |
| **Goal**        | Execute trades quickly based on real-time price movements  |
| **Environment** | Multiple monitors, high-pressure, time-sensitive           |
| **Pain Points** | Latency, too many clicks, unclear price changes            |
| **Needs**       | Real-time updates, minimal UI friction, keyboard shortcuts |

#### Persona B: Portfolio Manager

> "I need to understand our overall exposure and P&L at a glance."

| Attribute       | Detail                                                   |
| --------------- | -------------------------------------------------------- |
| **Goal**        | Monitor positions, assess risk, report to stakeholders   |
| **Environment** | Less time pressure, analytical focus                     |
| **Pain Points** | Scattered data, manual calculations, poor visualizations |
| **Needs**       | Aggregated views, charts, export capabilities            |

### 2.2 Stakeholder Discovery Questions

In a real engagement, I would ask:

**For Traders:**

1. What information do you look at most frequently?
2. Walk me through a typical trade execution - what steps do you take?
3. What's the most frustrating part of your current platform?
4. Do you use keyboard shortcuts? Which actions need them?

**For Portfolio Managers:**

1. What reports do you generate daily/weekly?
2. How do you currently calculate P&L and exposure?
3. What visualizations would help you most?

**For IT/Compliance:**

1. What audit trail requirements exist?
2. What are the latency requirements?
3. What systems does this need to integrate with?

---

## 3. Functional Requirements

### 3.1 Core Features (MVP)

| Feature                        | Requirements                                   | Acceptance Criteria                                           |
| ------------------------------ | ---------------------------------------------- | ------------------------------------------------------------- |
| **F1: Live Price Dashboard**   | Display real-time prices for all 6 base metals | Prices update without page refresh; visual flash on change    |
| **F2: Trade Execution**        | Quick trade panel (metal, quantity, buy/sell)  | Trade executes at current price; position updates immediately |
| **F3: Recent Trades Feed**     | Live feed of executed trades                   | Shows time, metal, side, quantity, price; filterable          |
| **F4: Portfolio Holdings**     | Table of current positions with P&L            | Sortable columns; total portfolio value displayed             |
| **F5: Allocation Overview**    | Pie chart showing portfolio allocation         | Percentage breakdown by metal                                 |
| **F6: Price Trend Sparklines** | Mini charts showing recent price history       | 20-point history; color indicates positive/negative trend     |
| **F7: Day Range Indicator**    | Visual bar showing price within day's range    | Shows current price position between day low and high         |
| **F8: Bid/Ask Spread**         | Display bid price with spread below            | Spread calculated as ask - bid                                |

### 3.2 Feature Prioritization (MoSCoW)

| Priority             | Features                                                   |
| -------------------- | ---------------------------------------------------------- |
| **Must Have**        | Live prices, trade execution, position view, sparklines    |
| **Should Have**      | Recent trades feed, allocation chart, range indicators     |
| **Could Have**       | Price alerts, historical charts, pending orders management |
| **Won't Have (MVP)** | Authentication, order book, multiple prompt dates          |

---

## 4. Non-Functional Requirements

### 4.1 Performance

| Requirement              | Target          | Rationale                                |
| ------------------------ | --------------- | ---------------------------------------- |
| Price update latency     | < 100ms         | Traders need real-time data              |
| UI responsiveness        | 60fps           | Smooth interactions during rapid updates |
| Initial load time        | < 3s            | Fast startup for trading sessions        |
| WebSocket reconnection   | Automatic, < 5s | Reliability during network blips         |
| Client-side processing   | Minimal         | Server computes direction, history, etc. |
| Animation flash cooldown | 3 seconds       | Prevents visual overload                 |

### 4.2 Usability

| Decision                            | Rationale                                        |
| ----------------------------------- | ------------------------------------------------ |
| **Dark theme default**              | Reduces eye strain for all-day trading use       |
| **High information density**        | Traders prefer more data, less whitespace        |
| **Clear visual hierarchy**          | Most important data (price, P&L) most prominent  |
| **Consistent interaction patterns** | Reduces cognitive load across features           |
| **Throttled animations**            | Prevents visual overload during volatile markets |
| **Row-level price flash**           | Draws attention to changed instruments           |
| **Sparkline trends**                | Quick visual of recent price movement            |
| **Range indicators**                | Shows current price within day's high/low        |

### 4.3 Reliability

- Graceful degradation if WebSocket disconnects
- Clear error states with recovery actions
- No data loss on network interruption

### 4.4 Front-End Performance Considerations

| Consideration                  | Implementation                                    | Impact                                    |
| ------------------------------ | ------------------------------------------------- | ----------------------------------------- |
| **Memoized data arrays**       | `useMemo` wrapping `Array.from()` in hooks        | Prevents infinite re-render loops         |
| **Server-computed direction**  | `direction` field sent from server                | Eliminates client-side price comparison   |
| **Server-computed history**    | `priceHistory` array maintained server-side       | No client-side array manipulation         |
| **Direct DOM manipulation**    | `classList.add/remove` for flash animations       | Bypasses React render cycle               |
| **Throttled animations**       | 3-second cooldown per symbol                      | Reduces visual noise and DOM operations   |
| **Stable callback references** | `useCallback` with empty/minimal dependencies     | Prevents unnecessary effect re-runs       |
| **Ref-based timers**           | `useRef` for flash timers instead of state        | No re-renders on timer updates            |
| **AG-Grid row ID**             | `getRowId` returns symbol for stable row identity | Efficient row updates without full redraw |
| **Minimal extended state**     | Only add `ask` field client-side                  | Reduces data transformation overhead      |

**Key Principle:** Push computation to the server. The client should receive pre-computed data and focus solely on presentation. This reduces CPU usage on trader workstations and ensures consistency across all connected clients.

---

## 5. Technical Decisions & Trade-offs

### 5.1 Real-Time Updates: WebSocket vs Polling

| Approach        | Pros                          | Cons                                     |
| --------------- | ----------------------------- | ---------------------------------------- |
| **WebSocket** ✓ | Sub-second latency, efficient | Connection management complexity         |
| Polling         | Simple implementation         | High latency, server load, battery drain |

**Decision:** WebSocket with automatic reconnection. Trading platforms require real-time data; polling would create unacceptable latency.

### 5.2 State Management: Zustand + React Query

| Approach          | Pros                                                     | Cons                                 |
| ----------------- | -------------------------------------------------------- | ------------------------------------ |
| **Zustand** ✓     | Minimal boilerplate, TypeScript-first, no providers      | Less ecosystem than Redux            |
| **React Query** ✓ | Built-in caching, background refetch, optimistic updates | Learning curve                       |
| Redux             | Familiar, predictable                                    | Boilerplate, manual cache management |

**Decision:** Hybrid approach using both:

- **Zustand** for client-side UI state (selected symbol, panel states, user preferences)
- **React Query** for server state (trades, positions, API data)
- **WebSocket** for real-time price updates (bypasses React Query for lowest latency)

This separation keeps concerns clear and avoids mixing transient UI state with cached server data.

### 5.3 Database: SQLite vs PostgreSQL

| Approach     | Pros                                       | Cons                              |
| ------------ | ------------------------------------------ | --------------------------------- |
| **SQLite** ✓ | Zero config, portable, sufficient for demo | Not suitable for production scale |
| PostgreSQL   | Production-ready, scalable                 | Requires setup, overkill for demo |

**Decision:** SQLite for demo simplicity. Architecture allows easy swap to PostgreSQL for production.

### 5.4 Monorepo vs Separate Repos

| Approach       | Pros                                    | Cons                              |
| -------------- | --------------------------------------- | --------------------------------- |
| **Monorepo** ✓ | Shared types, atomic changes, single PR | Tooling complexity                |
| Separate repos | Clear boundaries                        | Type drift, coordination overhead |

**Decision:** Monorepo with shared package. Eliminates API contract drift between frontend and backend.

### 5.5 Price Simulation Strategy

| Approach          | Pros                        | Cons                         |
| ----------------- | --------------------------- | ---------------------------- |
| **Random walk** ✓ | Realistic-looking movements | Not actual market data       |
| Static prices     | Simple                      | Unrealistic, no demo value   |
| Historical replay | Realistic patterns          | Complex, time-syncing issues |

**Decision:** Random walk with configurable volatility. Demonstrates real-time capability without external dependencies.

### 5.6 Server-Side vs Client-Side Processing

| Processing Task        | Location     | Rationale                                  |
| ---------------------- | ------------ | ------------------------------------------ |
| Price direction        | **Server** ✓ | Minimize client computation, single source |
| Price history          | **Server** ✓ | Avoid client-side array manipulation       |
| Change calculations    | **Server** ✓ | Consistent calculations across all clients |
| Flash animation timing | **Client**   | UI concern, needs DOM access               |
| Flash throttling       | **Client**   | Per-client UX preference                   |

**Decision:** Maximize server-side processing. The server computes `direction`, `change`, `changePercent`, and maintains `priceHistory`. Client receives pre-computed data and only handles visual presentation. This reduces client CPU usage and ensures consistency.

### 5.7 Data Grid: AG-Grid

| Approach       | Pros                                         | Cons                    |
| -------------- | -------------------------------------------- | ----------------------- |
| **AG-Grid** ✓  | Enterprise features, sorting, virtualization | Bundle size, complexity |
| Native table   | Simple, lightweight                          | No virtualization       |
| TanStack Table | Headless, flexible                           | More setup required     |

**Decision:** AG-Grid for the price table. Provides built-in sorting, row animations, and handles high-frequency updates efficiently. Cell renderers are extracted to `components/tables/trading/cells/` for reusability.

### 5.8 Animation Strategy: Direct DOM Manipulation

| Approach           | Pros                        | Cons                           |
| ------------------ | --------------------------- | ------------------------------ |
| **Direct DOM** ✓   | Bypasses React render cycle | Less "React-like"              |
| AG-Grid flashCells | Built-in                    | Limited to cell-level          |
| React state-driven | Declarative                 | Causes re-renders, performance |

**Decision:** Direct DOM manipulation for row flash animations. AG-Grid's built-in flash only works at cell level. Using `classList.add/remove` with CSS animations provides row-level flashes without triggering React re-renders. Throttled to 3-second cooldown per symbol to reduce visual noise.

---

## 6. Component Architecture

### 6.1 Project Structure

```
packages/
├── shared/           # Shared types, constants, schemas
│   └── src/
│       ├── types/    # MetalPrice, Trade, Position, etc.
│       ├── constants/# METALS array, symbols
│       └── schemas/  # Zod validation schemas
├── server/           # Express + WebSocket backend
│   └── src/
│       ├── services/ # priceService, tradeService
│       └── routes/   # REST API endpoints
└── client/           # React + Vite frontend
    └── src/
        ├── features/trading/
        │   ├── components/   # PriceTable, TradePanel, etc.
        │   ├── hooks/        # usePriceUpdates, useTrades
        │   └── stores/       # Zustand stores
        └── components/
            ├── ui/           # Reusable UI primitives
            └── tables/trading/cells/  # AG-Grid cell renderers
```

### 6.2 Cell Renderer Components

Extracted to `components/tables/trading/cells/` for reusability:

| Component               | Purpose                                    |
| ----------------------- | ------------------------------------------ |
| `MetalCellRenderer`     | Metal icon + symbol + name                 |
| `BidCellRenderer`       | Bid price with spread below                |
| `AskCellRenderer`       | Ask price display                          |
| `ChangeCellRenderer`    | Change amount + percentage with color      |
| `SparklineCellRenderer` | Mini line chart of price history           |
| `RangeCellRenderer`     | Day range bar with current price indicator |
| `VolumeCellRenderer`    | Formatted volume number                    |

### 6.3 State Management Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Client                              │
├─────────────────────────────────────────────────────────┤
│  Zustand Store (tradingStore)                           │
│  └── selectedSymbol, UI preferences                     │
├─────────────────────────────────────────────────────────┤
│  React Query                                             │
│  └── trades, positions, API data                        │
├─────────────────────────────────────────────────────────┤
│  WebSocket (usePriceUpdates)                            │
│  └── Real-time prices with server-computed direction    │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                      Server                              │
├─────────────────────────────────────────────────────────┤
│  PriceService                                            │
│  └── Computes: direction, change, priceHistory          │
│  └── Broadcasts: PRICE_UPDATE, PRICE_SNAPSHOT           │
└─────────────────────────────────────────────────────────┘
```

---

## 7. Data Models

### 7.1 MetalPrice

```typescript
type PriceDirection = "up" | "down" | "neutral";

interface MetalPrice {
  symbol: MetalSymbol; // "CU", "AL", "ZN", "PB", "NI", "SN"
  name: string; // "Copper", "Aluminium", etc.
  price: number; // USD per metric ton
  change: number; // Absolute change vs previous close
  changePercent: number; // Percentage change
  high: number; // Day high
  low: number; // Day low
  previousClose: number; // Yesterday's closing price
  volume: number; // Daily trading volume
  updatedAt: string; // ISO timestamp
  priceHistory: number[]; // Last 20 price points for sparkline
  direction: PriceDirection; // Server-computed tick direction
}
```

### 7.2 Trade

```typescript
interface Trade {
  id: string;
  symbol: string;
  side: "BUY" | "SELL";
  quantity: number; // Metric tonnes
  price: number; // Execution price
  total: number; // quantity * price
  status: "FILLED" | "PENDING" | "REJECTED";
  createdAt: string;
  executedAt: string;
}
```

### 7.3 Position

```typescript
interface Position {
  id: string;
  symbol: string;
  quantity: number; // Metric tonnes held
  avgCost: number; // Average purchase price
  currentPrice: number; // Latest market price
  marketValue: number; // quantity * currentPrice
  unrealizedPnL: number; // marketValue - (quantity * avgCost)
  unrealizedPnLPercent: number;
}
```

---

## 8. Assumptions & Constraints

### Assumptions Made

| Assumption                             | Rationale                           |
| -------------------------------------- | ----------------------------------- |
| Modern browser (Chrome, Firefox, Edge) | Target professional trading desks   |
| Stable internet connection             | Trading floor infrastructure        |
| Single user per session                | Demo scope                          |
| USD as base currency                   | LME standard                        |
| Instant trade execution                | Simplified from order book matching |

### Constraints

| Constraint             | Impact                        |
| ---------------------- | ----------------------------- |
| Demo timeline          | Focused on core features only |
| No real LME API access | Simulated price data          |
| No authentication      | Single-user demo              |

---

## 9. Open Questions (For Real Engagement)

These would be resolved through stakeholder conversations:

1. Should traders see other traders' activity?
2. What's the maximum position size per metal?
3. Are there compliance requirements for trade confirmations?
4. What audit trail is required?
5. Should the platform support multiple languages?
6. What's the expected concurrent user count?

---

## 10. Success Metrics

| Metric                  | Target                    | Measurement                |
| ----------------------- | ------------------------- | -------------------------- |
| Trade execution         | < 2 clicks from decision  | User testing               |
| Price update visibility | < 100ms latency           | Performance monitoring     |
| Portfolio accuracy      | P&L matches trade history | Automated tests            |
| UI responsiveness       | No jank during updates    | Lighthouse, manual testing |

---

## 11. Risk Assessment

| Risk                     | Likelihood | Impact | Mitigation                                   |
| ------------------------ | ---------- | ------ | -------------------------------------------- |
| WebSocket disconnection  | Medium     | High   | Auto-reconnect with exponential backoff      |
| Price data staleness     | Low        | High   | Visual "stale" indicator, timestamp display  |
| Trade execution failure  | Low        | High   | Clear error messaging, retry capability      |
| Browser compatibility    | Low        | Medium | Target modern evergreen browsers only        |
| Infinite re-render loops | Medium     | High   | Memoize arrays, avoid new objects in render  |
| Animation overload       | Medium     | Medium | Throttle flashes with 3s cooldown per symbol |

---

## 12. Lessons Learned

| Issue                           | Root Cause                                    | Solution                                    |
| ------------------------------- | --------------------------------------------- | ------------------------------------------- |
| Maximum update depth exceeded   | `Array.from()` in hook return created new ref | Memoize with `useMemo` keyed on source Map  |
| Flash animations too frequent   | Every price tick triggered animation          | 3-second cooldown + server-side direction   |
| Client CPU usage high           | Direction calculation on every update         | Move computation to server                  |
| AG-Grid cell flash insufficient | Built-in flash only works at cell level       | Direct DOM manipulation for row-level flash |

---

_This document demonstrates the ability to research a domain, gather requirements consultatively, make and justify technical decisions, and communicate clearly with stakeholders._
