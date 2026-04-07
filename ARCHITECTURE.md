# LME Trading Platform - Architecture Document

## Overview

This document explains the technical architecture, technology choices, and reasoning behind each decision.

**🚀 Live Demo:** https://trading-platform-production-3db5.up.railway.app

**Related Documentation:**
- [REQUIREMENTS.md](./REQUIREMENTS.md) - Business requirements & user flows
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Folder structure & conventions

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DEPLOYED APPLICATION                            │
│                 https://trading-platform-production-3db5.up.railway.app      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                         Browser (Client)                                │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────────────┐ │ │
│  │  │   React 18  │  │  TanStack   │  │         AG Grid                 │ │ │
│  │  │   + Vite    │  │   Query     │  │   (Real-time price table)       │ │ │
│  │  └──────┬──────┘  └──────┬──────┘  └───────────────┬─────────────────┘ │ │
│  │         │                │                         │                    │ │
│  │         └────────────────┼─────────────────────────┘                    │ │
│  │                          │                                              │ │
│  │                    ┌─────┴─────┐                                        │ │
│  │                    │  API Layer │                                       │ │
│  │                    │ REST + WS  │                                       │ │
│  │                    └─────┬─────┘                                        │ │
│  └──────────────────────────┼──────────────────────────────────────────────┘ │
│                             │                                                │
│               ┌─────────────┴─────────────┐                                  │
│               │    HTTPS / WSS (Railway)   │                                 │
│               └─────────────┬─────────────┘                                  │
│                             │                                                │
│  ┌──────────────────────────┼──────────────────────────────────────────────┐ │
│  │                     Server (Node.js)                                    │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────────────┐ │ │
│  │  │   Fastify   │  │  WebSocket  │  │      Price Simulator            │ │ │
│  │  │   (REST)    │  │  (Real-time)│  │   (Mock market data)            │ │ │
│  │  └──────┬──────┘  └──────┬──────┘  └───────────────┬─────────────────┘ │ │
│  │         │                │                         │                    │ │
│  │         └────────────────┼─────────────────────────┘                    │ │
│  │                          │                                              │ │
│  │                    ┌─────┴─────┐                                        │ │
│  │                    │  Drizzle  │                                        │ │
│  │                    │   ORM     │                                        │ │
│  │                    └─────┬─────┘                                        │ │
│  │                          │                                              │ │
│  │                    ┌─────┴─────┐                                        │ │
│  │                    │  SQLite   │                                        │ │
│  │                    │ (in-memory│                                        │ │
│  │                    │  on deploy)│                                       │ │
│  │                    └───────────┘                                        │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Railway Platform                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    Docker Container                         │ │
│  │                                                             │ │
│  │  ┌─────────────────────────────────────────────────────┐   │ │
│  │  │              Node.js Server (Fastify)                │   │ │
│  │  │                                                      │   │ │
│  │  │  • Serves static React build from /client/dist      │   │ │
│  │  │  • REST API at /api/*                               │   │ │
│  │  │  • WebSocket at /ws                                 │   │ │
│  │  │  • Health check at /health                          │   │ │
│  │  │                                                      │   │ │
│  │  └─────────────────────────────────────────────────────┘   │ │
│  │                                                             │ │
│  │  Build Process:                                             │ │
│  │  1. Install pnpm + build tools                              │ │
│  │  2. Build @lme/shared (TypeScript)                          │ │
│  │  3. Build @lme/client (Vite → static files)                 │ │
│  │  4. Build @lme/server (TypeScript)                          │ │
│  │  5. Rebuild better-sqlite3 native module                    │ │
│  │  6. Run server (serves everything)                          │ │
│  │                                                             │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  URL: https://trading-platform-production-3db5.up.railway.app   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack

### 3.1 Monorepo Structure

| Choice | Technology | Reasoning |
|--------|------------|-----------|
| **Package Manager** | pnpm | Faster than npm/yarn, efficient disk usage, workspace support |
| **Monorepo Tool** | pnpm workspaces | Native, no additional tooling needed |
| **Shared Types** | TypeScript package | Single source of truth for API contracts |

### 3.2 Frontend

| Layer | Technology | Reasoning |
|-------|------------|-----------|
| **Framework** | React 18 | Industry standard, excellent ecosystem |
| **Build Tool** | Vite | Fast HMR, modern ESM-first approach |
| **Server State** | TanStack Query | Caching, background refetching, devtools |
| **Styling** | Tailwind CSS | Utility-first, fast iteration |
| **Components** | shadcn/ui | Accessible, customizable, code ownership |
| **Data Grid** | AG Grid Community | Industry standard for trading platforms |
| **Charts** | Recharts | Composable, React-native charts |

### 3.3 Backend

| Layer | Technology | Reasoning |
|-------|------------|-----------|
| **Runtime** | Node.js 20 | Same language as frontend, excellent async I/O |
| **Framework** | Fastify | Faster than Express, first-class TypeScript |
| **WebSocket** | @fastify/websocket | Native Fastify integration |
| **Static Files** | @fastify/static | Serves React build in production |
| **Database** | SQLite + Drizzle | Zero configuration, type-safe ORM |

### 3.4 Deployment

| Component | Technology | Reasoning |
|-----------|------------|-----------|
| **Platform** | Railway | Simple Docker deployment, free tier |
| **Build** | Dockerfile | Full control over build process |
| **Static Serving** | Fastify | Single deployment serves everything |

---

## 4. Data Flow Architecture

### 4.1 Real-Time Price Updates

```
┌─────────────────────────────────────────────────────────────────┐
│                     WebSocket Data Flow                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  SERVER                                                          │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  PriceService                                            │    │
│  │  • Simulates price movements every 1.5s                  │    │
│  │  • Computes: direction, change, changePercent            │    │
│  │  • Maintains: priceHistory (last 20 points)              │    │
│  │  • Broadcasts: PRICE_UPDATE to all connected clients     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                          │                                       │
│                          ▼                                       │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  WebSocket Handler                                       │    │
│  │  • On connect: Send PRICE_SNAPSHOT (all prices)          │    │
│  │  • On update: Broadcast PRICE_UPDATE (single price)      │    │
│  └─────────────────────────────────────────────────────────┘    │
│                          │                                       │
│                          ▼                                       │
│  CLIENT                                                          │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  usePriceUpdates Hook                                    │    │
│  │  • Connects to wss://[host]/ws                           │    │
│  │  • Updates Map<symbol, MetalPrice>                       │    │
│  │  • Returns memoized prices array                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                          │                                       │
│                          ▼                                       │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  PriceTable (AG Grid)                                    │    │
│  │  • Receives prices as rowData                            │    │
│  │  • Flashes rows on price change (3s cooldown)            │    │
│  │  • Renders sparklines, range bars, bid/ask               │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Trade Execution Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     Trade Execution Flow                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. User clicks BUY/SELL in TradePanel                          │
│                          │                                       │
│                          ▼                                       │
│  2. POST /api/trades { symbol, side, quantity, orderType }      │
│                          │                                       │
│                          ▼                                       │
│  3. TradeService validates and executes                         │
│     • Gets current price from PriceService                      │
│     • Creates trade record                                      │
│     • Updates position (create or modify)                       │
│                          │                                       │
│                          ▼                                       │
│  4. Response: { trade, position }                               │
│                          │                                       │
│                          ▼                                       │
│  5. Client updates UI                                           │
│     • Trade appears in Recent Trades                            │
│     • Position updates in Holdings                              │
│     • React Query cache invalidated                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Database Schema

```
┌─────────────────────────────────────────────────────────────────┐
│                        SQLite Schema                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  positions                                               │    │
│  │  ├── id: TEXT PRIMARY KEY                                │    │
│  │  ├── symbol: TEXT (CU, AL, ZN, PB, NI, SN)              │    │
│  │  ├── side: TEXT (LONG, SHORT)                           │    │
│  │  ├── quantity: REAL                                      │    │
│  │  ├── avg_cost: REAL                                      │    │
│  │  ├── created_at: INTEGER (timestamp)                     │    │
│  │  └── updated_at: INTEGER (timestamp)                     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  trades                                                  │    │
│  │  ├── id: TEXT PRIMARY KEY                                │    │
│  │  ├── symbol: TEXT                                        │    │
│  │  ├── side: TEXT (BUY, SELL)                             │    │
│  │  ├── order_type: TEXT (MARKET, LIMIT)                   │    │
│  │  ├── quantity: REAL                                      │    │
│  │  ├── price: REAL                                         │    │
│  │  ├── limit_price: REAL (nullable)                        │    │
│  │  ├── total: REAL                                         │    │
│  │  ├── status: TEXT (FILLED, PENDING, CANCELLED)          │    │
│  │  ├── executed_at: INTEGER (nullable)                     │    │
│  │  └── created_at: INTEGER                                 │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  price_history                                           │    │
│  │  ├── id: INTEGER PRIMARY KEY AUTOINCREMENT               │    │
│  │  ├── symbol: TEXT                                        │    │
│  │  ├── open: REAL                                          │    │
│  │  ├── high: REAL                                          │    │
│  │  ├── low: REAL                                           │    │
│  │  ├── close: REAL                                         │    │
│  │  └── timestamp: INTEGER                                  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Performance Optimizations

### 6.1 Frontend Performance

| Technique | Implementation |
|-----------|----------------|
| **Memoized arrays** | `useMemo` wrapping `Array.from()` prevents infinite loops |
| **Server-computed direction** | Eliminates client-side price comparison |
| **Direct DOM manipulation** | `classList.add/remove` for flash animations |
| **Throttled animations** | 3-second cooldown per symbol |
| **AG-Grid row ID** | Stable row identity for efficient updates |

### 6.2 Backend Performance

| Technique | Implementation |
|-----------|----------------|
| **Single broadcast** | One price calculation, broadcast to all clients |
| **In-memory prices** | Price state held in memory, not DB |
| **Auto-seeding** | Tables created and seeded on startup |

---

## 7. Security Considerations

For production, would implement:

| Concern | Solution |
|---------|----------|
| **Authentication** | JWT tokens |
| **Authorization** | Role-based access |
| **Input Validation** | Zod schemas on both ends |
| **Rate Limiting** | Fastify rate-limit plugin |
| **CORS** | Strict origin whitelist |

*Note: Not implemented in demo.*

---

## 8. Future Improvements

1. **Authentication & Authorization**
2. **PostgreSQL for production**
3. **Redis for WebSocket scaling**
4. **Error tracking (Sentry)**
5. **Performance monitoring**
6. **Comprehensive test coverage**
7. **Real LME API integration**

---

*Document Version: 2.0*  
*Last Updated: April 2026*
