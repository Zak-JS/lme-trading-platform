# LME Trading Platform - Project Structure

## Overview

This document defines the complete folder structure for the monorepo. It serves as a reference for where code should live and why.

**🚀 Live Demo:** https://trading-platform-production-3db5.up.railway.app

**Related Documentation:**
- [REQUIREMENTS.md](./REQUIREMENTS.md) - Business requirements & user flows
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical decisions & reasoning

---

## 1. Root Structure

```
metal-exchange/
├── docs/                           # Archived documentation
│   └── archive/                    # Historical docs
│
├── packages/
│   ├── client/                     # React frontend
│   ├── server/                     # Fastify backend
│   └── shared/                     # Shared TypeScript types
│
├── Dockerfile                      # Production Docker build
├── railway.json                    # Railway deployment config
├── nixpacks.toml                   # Nixpacks build config
├── .gitignore
├── pnpm-workspace.yaml             # Workspace configuration
├── package.json                    # Root scripts
├── tsconfig.base.json              # Shared TypeScript config
├── README.md                       # Project overview & setup
├── REQUIREMENTS.md                 # Requirements & decisions
├── ARCHITECTURE.md                 # Technical architecture
└── PROJECT_STRUCTURE.md            # This file
```

---

## 2. Client Package (`packages/client`)

```
packages/client/
├── public/
│   └── favicon.svg
│
├── src/
│   ├── components/                 # ═══ REUSABLE COMPONENTS ═══
│   │   │
│   │   ├── primitives/             # shadcn/ui base components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── select.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── ui/                     # Composed UI components
│   │   │   ├── PriceChange.tsx
│   │   │   ├── MetalIcon.tsx
│   │   │   ├── ConnectionStatus.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── tables/trading/cells/   # AG-Grid cell renderers
│   │       ├── MetalCellRenderer.tsx
│   │       ├── BidCellRenderer.tsx
│   │       ├── ChangeCellRenderer.tsx
│   │       ├── SparklineCellRenderer.tsx
│   │       ├── RangeCellRenderer.tsx
│   │       └── index.ts
│   │
│   ├── features/                   # ═══ FEATURE MODULES ═══
│   │   │
│   │   ├── trading/                # Trading dashboard
│   │   │   ├── components/
│   │   │   │   ├── PriceTable.tsx  # AG Grid with live prices
│   │   │   │   ├── TradePanel.tsx  # Trade execution form
│   │   │   │   ├── RecentTrades.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   ├── usePriceUpdates.ts
│   │   │   │   └── useTrades.ts
│   │   │   │
│   │   │   ├── stores/
│   │   │   │   └── tradingStore.ts  # Zustand store
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   └── portfolio/              # Portfolio management
│   │       ├── components/
│   │       │   ├── HoldingsTable.tsx
│   │       │   ├── AllocationChart.tsx
│   │       │   └── index.ts
│   │       │
│   │       └── index.ts
│   │
│   ├── api/                        # ═══ GLOBAL API ═══
│   │   ├── client.ts               # Axios instance
│   │   ├── websocket.ts            # WebSocket client
│   │   ├── queryClient.ts          # TanStack Query config
│   │   └── index.ts
│   │
│   ├── layouts/                    # ═══ APP SHELL ═══
│   │   ├── RootLayout.tsx
│   │   ├── Header.tsx
│   │   └── index.ts
│   │
│   ├── lib/                        # ═══ UTILITIES ═══
│   │   ├── utils.ts
│   │   └── formatters.ts
│   │
│   ├── styles/
│   │   └── globals.css
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
│
├── Dockerfile                      # Client Docker build
├── netlify.toml                    # Netlify config (alternative)
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 3. Server Package (`packages/server`)

```
packages/server/
├── src/
│   ├── routes/                     # ═══ API ROUTES ═══
│   │   ├── prices.ts               # GET /api/prices
│   │   ├── positions.ts            # GET /api/positions
│   │   ├── trades.ts               # GET/POST /api/trades
│   │   └── index.ts
│   │
│   ├── services/                   # ═══ BUSINESS LOGIC ═══
│   │   ├── priceService.ts         # Price simulation
│   │   ├── tradeService.ts         # Trade execution
│   │   ├── positionService.ts      # Position calculations
│   │   └── index.ts
│   │
│   ├── websocket/                  # ═══ WEBSOCKET ═══
│   │   ├── handler.ts              # Connection handling
│   │   └── index.ts
│   │
│   ├── db/                         # ═══ DATABASE ═══
│   │   ├── schema.ts               # Drizzle table definitions
│   │   ├── index.ts                # DB connection + auto-migrate
│   │   └── seed.ts                 # Initial data
│   │
│   └── index.ts                    # Server entry + static serving
│
├── render.yaml                     # Render deployment config
├── tsconfig.json
└── package.json
```

---

## 4. Shared Package (`packages/shared`)

```
packages/shared/
├── src/
│   ├── types/                      # ═══ TYPE DEFINITIONS ═══
│   │   ├── metals.ts               # MetalSymbol, MetalPrice
│   │   ├── trading.ts              # Trade, Position, Order
│   │   ├── api.ts                  # Request/Response types
│   │   ├── websocket.ts            # WS message types
│   │   └── index.ts
│   │
│   ├── constants/                  # ═══ SHARED CONSTANTS ═══
│   │   ├── metals.ts               # METALS array, base prices
│   │   └── index.ts
│   │
│   ├── schemas/                    # ═══ VALIDATION SCHEMAS ═══
│   │   ├── trade.ts                # Zod schemas for trades
│   │   ├── price.ts                # Zod schemas for prices
│   │   └── index.ts
│   │
│   └── index.ts                    # Barrel export
│
├── tsconfig.json
└── package.json
```

---

## 5. Deployment Configuration

### Railway (Production)

The app is deployed as a single service on Railway:

```
Dockerfile (root)
├── Builds shared package
├── Builds client (static files)
├── Builds server
├── Server serves both API and static files
└── Single URL for everything
```

**Key Files:**
- `Dockerfile` - Multi-stage build for full stack
- `railway.json` - Railway-specific configuration
- `nixpacks.toml` - Build system configuration

---

## 6. File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| React components | PascalCase | `PriceTable.tsx` |
| Hooks | camelCase with `use` prefix | `usePriceUpdates.ts` |
| Utilities | camelCase | `formatters.ts` |
| Types | camelCase | `trading.ts` |
| Constants | camelCase | `metals.ts` |

---

## 7. Import Aliases

```typescript
// tsconfig.json paths
{
  "@/*": ["./src/*"],
  "@/components/*": ["./src/components/*"],
  "@/features/*": ["./src/features/*"],
  "@/api/*": ["./src/api/*"],
  "@lme/shared": ["../../shared/src"]
}
```

---

*Document Version: 2.0*  
*Last Updated: April 2026*
