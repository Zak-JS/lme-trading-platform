# LME Trading Platform - Architecture Document

## Overview

This document explains the technical architecture, technology choices, and reasoning behind each decision. It serves as both a reference and a demonstration of thoughtful technical decision-making.

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client (Browser)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   React     │  │  TanStack   │  │      AG Grid            │  │
│  │   + Router  │  │   Query     │  │  (Real-time tables)     │  │
│  └──────┬──────┘  └──────┬──────┘  └───────────┬─────────────┘  │
│         │                │                     │                 │
│         └────────────────┼─────────────────────┘                 │
│                          │                                       │
│                    ┌─────┴─────┐                                 │
│                    │  API Layer │                                │
│                    │  (REST +   │                                │
│                    │  WebSocket)│                                │
│                    └─────┬─────┘                                 │
└──────────────────────────┼───────────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              │      HTTP / WS          │
              └────────────┬────────────┘
                           │
┌──────────────────────────┼───────────────────────────────────────┐
│                     Server (Node.js)                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Fastify   │  │  WebSocket  │  │    Price Simulator      │  │
│  │   (REST)    │  │  (Real-time)│  │  (Mock market data)     │  │
│  └──────┬──────┘  └──────┬──────┘  └───────────┬─────────────┘  │
│         │                │                     │                 │
│         └────────────────┼─────────────────────┘                 │
│                          │                                       │
│                    ┌─────┴─────┐                                 │
│                    │  Drizzle  │                                 │
│                    │   ORM     │                                 │
│                    └─────┬─────┘                                 │
│                          │                                       │
│                    ┌─────┴─────┐                                 │
│                    │  SQLite   │                                 │
│                    └───────────┘                                 │
└──────────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

### 2.1 Monorepo Structure

| Choice | Technology | Reasoning |
|--------|------------|-----------|
| **Package Manager** | pnpm | Faster than npm/yarn, efficient disk usage via hard links, excellent workspace support |
| **Monorepo Tool** | pnpm workspaces | Native, no additional tooling needed. Turborepo considered but overkill for 3 packages |
| **Shared Types** | TypeScript package | Single source of truth for API contracts, prevents drift between client/server |

**Alternative Considered:** Nx - More powerful but adds complexity. pnpm workspaces sufficient for this scale.

### 2.2 Frontend

| Layer | Technology | Reasoning |
|-------|------------|-----------|
| **Framework** | React 18 | Industry standard, excellent ecosystem, what the role requires |
| **Build Tool** | Vite | Fast HMR, modern ESM-first approach, simpler than Webpack |
| **Routing** | TanStack Router | Type-safe routing, integrates well with TanStack Query, modern approach |
| **Server State** | TanStack Query | Caching, background refetching, optimistic updates, devtools |
| **Styling** | Tailwind CSS | Utility-first, fast iteration, consistent design system |
| **Components** | shadcn/ui | Accessible, customizable, not a dependency (code ownership) |
| **Data Grid** | AG Grid Community | Industry standard for trading platforms, handles real-time updates efficiently |
| **Charts** | Lightweight Charts | TradingView's library, purpose-built for financial data |
| **Forms** | React Hook Form + Zod | Performant, type-safe validation |

**Why Not Next.js?**
- Trading platforms are inherently client-side, real-time applications
- SSR adds complexity without clear benefit for this use case
- No SEO requirements (internal tool)
- Simpler mental model with pure CSR

**Why AG Grid over TanStack Table?**
- Built-in cell flashing for real-time updates
- Virtualization out of the box
- Column pinning, resizing - expected in trading UIs
- Industry recognition (interviewers will know it)

### 2.3 Backend

| Layer | Technology | Reasoning |
|-------|------------|-----------|
| **Runtime** | Node.js 20 | Same language as frontend, excellent async I/O |
| **Framework** | Fastify | Faster than Express, first-class TypeScript, plugin architecture |
| **WebSocket** | @fastify/websocket | Native Fastify integration, simple API |
| **Database** | SQLite | Zero configuration, file-based, portable, sufficient for demo |
| **ORM** | Drizzle | Type-safe, lightweight, excellent DX, faster than Prisma |

**Why Fastify over Express?**
- 2-3x faster in benchmarks
- Built-in validation with JSON Schema
- Better TypeScript support
- Modern plugin system

**Why SQLite over PostgreSQL?**
- No Docker/installation required
- Portable (single file)
- Fast for read-heavy workloads
- Easy to reset/seed for demos
- Production note: Schema is Postgres-compatible for easy migration

**Why Drizzle over Prisma?**
- Lighter weight (no query engine binary)
- Faster cold starts
- SQL-like syntax (closer to the metal)
- Better for simple schemas

---

## 3. Frontend Architecture

### 3.1 Folder Structure Philosophy

We use a **feature-based architecture** rather than a technical-folder approach:

```
src/
├── components/           # ONLY reusable components
│   ├── primitives/       # shadcn/ui base (untouched)
│   └── ui/               # Our composed components
├── features/             # Feature modules (self-contained)
│   ├── trading/
│   │   ├── components/   # Feature-specific components
│   │   ├── api/          # Queries, mutations, keys
│   │   └── TradingPage.tsx
│   └── portfolio/
│       ├── components/
│       ├── api/
│       └── PortfolioPage.tsx
├── api/                  # Global API concerns
├── layouts/              # App shell components
└── lib/                  # Utilities
```

**Why Feature-Based?**
- **Scalability:** Adding features doesn't pollute existing folders
- **Discoverability:** All related code in one place
- **Team-friendly:** Teams can own features without conflicts
- **Deletability:** Remove a feature by deleting one folder

**Why Separate `primitives/` and `ui/`?**
- `primitives/` = shadcn/ui components, rarely modified
- `ui/` = our abstractions that compose primitives
- Clear boundary between library code and application code

### 3.2 API Layer Pattern

Each feature owns its API concerns:

```typescript
// features/trading/api/keys.ts
export const tradingKeys = {
  all: ['trading'] as const,
  prices: () => [...tradingKeys.all, 'prices'] as const,
  trades: () => [...tradingKeys.all, 'trades'] as const,
  trade: (id: string) => [...tradingKeys.trades(), id] as const,
};

// features/trading/api/queries.ts
export const usePricesQuery = () => {
  return useQuery({
    queryKey: tradingKeys.prices(),
    queryFn: () => apiClient.get<MetalPrice[]>('/prices'),
  });
};

// features/trading/api/mutations.ts
export const useExecuteTradeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (trade: CreateTradeRequest) => 
      apiClient.post('/trades', trade),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tradingKeys.trades() });
    },
  });
};
```

**Benefits:**
- Query keys are centralized and type-safe
- Easy to find all API calls for a feature
- Mutations automatically invalidate related queries
- Testable in isolation

### 3.3 Real-Time Data Strategy

```
┌─────────────────────────────────────────────────────────┐
│                    WebSocket Flow                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Client connects to ws://localhost:3001               │
│                                                          │
│  2. Server sends initial price snapshot                  │
│                                                          │
│  3. Server broadcasts price updates every 1-2 seconds    │
│     {                                                    │
│       type: "PRICE_UPDATE",                              │
│       data: { symbol: "CU", price: 8450.25, ... }        │
│     }                                                    │
│                                                          │
│  4. Client updates TanStack Query cache directly         │
│     queryClient.setQueryData(                            │
│       tradingKeys.prices(),                              │
│       (old) => updatePrice(old, newPrice)                │
│     )                                                    │
│                                                          │
│  5. AG Grid detects change, flashes cell                 │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Why Update Query Cache Directly?**
- Avoids refetching (faster)
- Single source of truth
- Components automatically re-render
- Works with React Query devtools

---

## 4. Backend Architecture

### 4.1 API Design

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/prices` | GET | Current prices for all metals |
| `/api/prices/:symbol` | GET | Price for specific metal |
| `/api/prices/:symbol/history` | GET | Historical prices for charts |
| `/api/positions` | GET | User's current holdings |
| `/api/trades` | GET | Trade history |
| `/api/trades` | POST | Execute a new trade |
| `ws://` | WebSocket | Real-time price stream |

### 4.2 Price Simulation

Since we don't have access to real LME data, we simulate realistic price movements:

```typescript
// Realistic base prices (approximate USD per metric ton)
const basePrices = {
  CU: 8500,   // Copper
  AL: 2300,   // Aluminium
  ZN: 2800,   // Zinc
  PB: 2100,   // Lead
  NI: 16000,  // Nickel
  SN: 25000,  // Tin
};

// Price movement simulation
function simulatePriceMovement(currentPrice: number): number {
  // Random walk with mean reversion
  const volatility = 0.001; // 0.1% per tick
  const change = (Math.random() - 0.5) * 2 * volatility * currentPrice;
  return currentPrice + change;
}
```

**Simulation Features:**
- Realistic base prices based on actual LME data
- Small random movements (0.1-0.2% per tick)
- Occasional larger moves to simulate market events
- Prices stay within reasonable bounds

### 4.3 Database Schema

```typescript
// Drizzle schema
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
  side: text('side', { enum: ['BUY', 'SELL'] }).notNull(),
  quantity: real('quantity').notNull(),
  price: real('price').notNull(),
  total: real('total').notNull(),
  status: text('status', { enum: ['FILLED', 'PENDING', 'REJECTED'] }).notNull(),
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

## 5. Performance Considerations

### 5.1 Frontend Performance

| Technique | Implementation |
|-----------|----------------|
| **Virtualization** | AG Grid handles row virtualization automatically |
| **Memoization** | React.memo for price cards, useMemo for calculations |
| **Code Splitting** | Route-based splitting via TanStack Router |
| **Bundle Size** | Tree-shaking, dynamic imports for charts |

### 5.2 Real-Time Performance

| Technique | Implementation |
|-----------|----------------|
| **Batched Updates** | Group price updates before rendering |
| **Selective Re-renders** | Only update changed cells in AG Grid |
| **Debounced Charts** | Don't update charts on every tick |
| **WebSocket Heartbeat** | Detect disconnections quickly |

### 5.3 Backend Performance

| Technique | Implementation |
|-----------|----------------|
| **Connection Pooling** | Drizzle handles SQLite connections |
| **Efficient Broadcasts** | Single price calculation, broadcast to all clients |
| **Minimal Payload** | Only send changed fields in updates |

---

## 6. Security Considerations

For a production system, we would implement:

| Concern | Solution |
|---------|----------|
| **Authentication** | JWT tokens, refresh token rotation |
| **Authorization** | Role-based access (trader vs. read-only) |
| **Input Validation** | Zod schemas on both client and server |
| **Rate Limiting** | Fastify rate-limit plugin |
| **CORS** | Strict origin whitelist |
| **WebSocket Auth** | Token in connection handshake |

*Note: Not implemented in demo due to time constraints.*

---

## 7. Testing Strategy

### 7.1 Frontend Testing

| Type | Tool | Coverage |
|------|------|----------|
| **Unit** | Vitest | Utilities, hooks, calculations |
| **Component** | React Testing Library | UI components |
| **Integration** | Playwright | Critical user flows |

### 7.2 Backend Testing

| Type | Tool | Coverage |
|------|------|----------|
| **Unit** | Vitest | Services, calculations |
| **Integration** | Supertest | API endpoints |
| **E2E** | Playwright | Full stack flows |

*Note: Test setup included, comprehensive tests out of scope for demo.*

---

## 8. Deployment Considerations

For production deployment:

| Component | Recommendation |
|-----------|----------------|
| **Frontend** | Vercel, Netlify, or CDN |
| **Backend** | Railway, Fly.io, or AWS ECS |
| **Database** | Turso (SQLite edge) or PostgreSQL |
| **WebSocket** | Sticky sessions or dedicated WS server |

---

## 9. Future Improvements

If this were a real project, next steps would include:

1. **Authentication & Authorization**
2. **Comprehensive test coverage**
3. **Error tracking (Sentry)**
4. **Performance monitoring (Web Vitals)**
5. **Accessibility audit (WCAG 2.1 AA)**
6. **Internationalization**
7. **Keyboard shortcuts for traders**
8. **Mobile-responsive design**
9. **Offline support with service workers**
10. **Real LME API integration**

---

*Document Version: 1.0*  
*Last Updated: April 2026*
