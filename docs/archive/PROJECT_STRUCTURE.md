# LME Trading Platform - Project Structure

## Overview

This document defines the complete folder structure for the monorepo. It serves as a reference for where code should live and why.

---

## 1. Root Structure

```
metal-exchange/
├── docs/                           # Documentation (you are here)
│   ├── REQUIREMENTS.md             # Business requirements & research
│   ├── ARCHITECTURE.md             # Technical decisions & reasoning
│   ├── DATA_MODELS.md              # Type definitions & schemas
│   └── PROJECT_STRUCTURE.md        # This file
│
├── packages/
│   ├── client/                     # React frontend
│   ├── server/                     # Fastify backend
│   └── shared/                     # Shared TypeScript types
│
├── .gitignore
├── .nvmrc                          # Node version (20)
├── pnpm-workspace.yaml             # Workspace configuration
├── package.json                    # Root scripts
├── tsconfig.base.json              # Shared TypeScript config
└── README.md                       # Project overview & setup
```

---

## 2. Client Package (`packages/client`)

```
packages/client/
├── public/
│   └── favicon.svg
│
├── src/
│   ├── components/                 # ═══ REUSABLE COMPONENTS ONLY ═══
│   │   │
│   │   ├── primitives/             # shadcn/ui base components
│   │   │   ├── button.tsx          # Do not modify these directly
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── select.tsx
│   │   │   ├── tooltip.tsx
│   │   │   └── index.ts            # Barrel export
│   │   │
│   │   └── ui/                     # Our composed/wrapped components
│   │       ├── PriceChange.tsx     # +/- indicator with color
│   │       ├── MetalIcon.tsx       # Icon per metal type
│   │       ├── MetalBadge.tsx      # Metal symbol badge
│   │       ├── ConnectionStatus.tsx # WebSocket status indicator
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorMessage.tsx
│   │       └── index.ts
│   │
│   ├── features/                   # ═══ FEATURE MODULES ═══
│   │   │
│   │   ├── trading/                # Trader dashboard feature
│   │   │   ├── components/         # Feature-specific components
│   │   │   │   ├── PriceGrid.tsx   # AG Grid with live prices
│   │   │   │   ├── PriceCard.tsx   # Individual metal card
│   │   │   │   ├── TradePanel.tsx  # Quick trade form
│   │   │   │   ├── TradeTicket.tsx # Trade confirmation dialog
│   │   │   │   ├── RecentTrades.tsx # Live trade feed
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── api/                # TanStack Query hooks
│   │   │   │   ├── keys.ts         # Query key factory
│   │   │   │   ├── queries.ts      # useQuery hooks
│   │   │   │   ├── mutations.ts    # useMutation hooks
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── hooks/              # Non-API hooks (if needed)
│   │   │   │   └── usePriceAlerts.ts
│   │   │   │
│   │   │   ├── TradingPage.tsx     # Page component
│   │   │   └── index.ts            # Public exports
│   │   │
│   │   └── portfolio/              # Portfolio manager feature
│   │       ├── components/
│   │       │   ├── HoldingsSummary.tsx
│   │       │   ├── PositionTable.tsx  # AG Grid with positions
│   │       │   ├── PnLDisplay.tsx
│   │       │   ├── AllocationChart.tsx # Pie/donut chart
│   │       │   ├── PriceChart.tsx     # Lightweight Charts
│   │       │   └── index.ts
│   │       │
│   │       ├── api/
│   │       │   ├── keys.ts
│   │       │   ├── queries.ts
│   │       │   └── index.ts
│   │       │
│   │       ├── PortfolioPage.tsx
│   │       └── index.ts
│   │
│   ├── api/                        # ═══ GLOBAL API CONCERNS ═══
│   │   ├── client.ts               # Axios instance with interceptors
│   │   ├── websocket.ts            # WebSocket client singleton
│   │   ├── queryClient.ts          # TanStack Query client config
│   │   └── index.ts
│   │
│   ├── layouts/                    # ═══ APP SHELL ═══
│   │   ├── RootLayout.tsx          # Main layout with header
│   │   ├── Header.tsx              # Top navigation bar
│   │   ├── Sidebar.tsx             # Side navigation (if needed)
│   │   └── index.ts
│   │
│   ├── lib/                        # ═══ UTILITIES ═══
│   │   ├── utils.ts                # cn() helper, misc utilities
│   │   ├── formatters.ts           # Price, date, number formatters
│   │   └── constants.ts            # Re-export from @lme/shared
│   │
│   ├── styles/
│   │   └── globals.css             # Tailwind + custom CSS
│   │
│   ├── routes.tsx                  # TanStack Router definitions
│   ├── App.tsx                     # Providers wrapper
│   ├── main.tsx                    # Entry point
│   └── vite-env.d.ts
│
├── index.html
├── components.json                 # shadcn/ui config
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
├── tsconfig.json
└── package.json
```

### 2.1 Component Placement Rules

| Component Type | Location | Example |
|----------------|----------|---------|
| shadcn/ui primitives | `components/primitives/` | Button, Card, Input |
| Reusable UI components | `components/ui/` | PriceChange, MetalIcon |
| Feature-specific components | `features/[feature]/components/` | PriceGrid, TradePanel |
| Page components | `features/[feature]/[Feature]Page.tsx` | TradingPage |
| Layout components | `layouts/` | Header, RootLayout |

### 2.2 Import Aliases

```typescript
// vite.config.ts / tsconfig.json
{
  "@/*": ["./src/*"],
  "@/components/*": ["./src/components/*"],
  "@/features/*": ["./src/features/*"],
  "@/api/*": ["./src/api/*"],
  "@/lib/*": ["./src/lib/*"],
  "@lme/shared": ["../../shared/src"]
}
```

---

## 3. Server Package (`packages/server`)

```
packages/server/
├── src/
│   ├── routes/                     # ═══ API ROUTES ═══
│   │   ├── prices.ts               # GET /api/prices, /api/prices/:symbol
│   │   ├── positions.ts            # GET /api/positions
│   │   ├── trades.ts               # GET/POST /api/trades
│   │   └── index.ts                # Route registration
│   │
│   ├── services/                   # ═══ BUSINESS LOGIC ═══
│   │   ├── priceService.ts         # Price simulation & management
│   │   ├── tradeService.ts         # Trade execution logic
│   │   ├── positionService.ts      # Position calculations
│   │   └── index.ts
│   │
│   ├── websocket/                  # ═══ WEBSOCKET ═══
│   │   ├── handler.ts              # Connection handling
│   │   ├── broadcaster.ts          # Price broadcast logic
│   │   └── index.ts
│   │
│   ├── db/                         # ═══ DATABASE ═══
│   │   ├── schema.ts               # Drizzle table definitions
│   │   ├── index.ts                # DB connection
│   │   ├── seed.ts                 # Initial data
│   │   └── migrations/             # Generated migrations
│   │
│   ├── plugins/                    # ═══ FASTIFY PLUGINS ═══
│   │   ├── cors.ts
│   │   ├── websocket.ts
│   │   └── index.ts
│   │
│   ├── utils/                      # ═══ UTILITIES ═══
│   │   ├── id.ts                   # ID generation (nanoid)
│   │   └── logger.ts               # Logging setup
│   │
│   └── index.ts                    # Server entry point
│
├── drizzle.config.ts               # Drizzle CLI config
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

## 5. File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| React components | PascalCase | `PriceGrid.tsx` |
| Hooks | camelCase with `use` prefix | `usePrices.ts` |
| Utilities | camelCase | `formatters.ts` |
| Types | camelCase | `trading.ts` |
| Constants | camelCase | `metals.ts` |
| Test files | `*.test.ts` or `*.spec.ts` | `PriceGrid.test.tsx` |

---

## 6. Import Order Convention

```typescript
// 1. React/external libraries
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Shared package
import { MetalPrice, METALS } from '@lme/shared';

// 3. Internal absolute imports (alphabetical)
import { apiClient } from '@/api/client';
import { Button } from '@/components/primitives';
import { PriceChange } from '@/components/ui';

// 4. Relative imports (parent first, then siblings)
import { tradingKeys } from '../api/keys';
import { PriceCard } from './PriceCard';

// 5. Styles
import styles from './PriceGrid.module.css';
```

---

## 7. Barrel Export Pattern

Each folder with multiple exports should have an `index.ts`:

```typescript
// features/trading/components/index.ts
export { PriceGrid } from './PriceGrid';
export { PriceCard } from './PriceCard';
export { TradePanel } from './TradePanel';
export { TradeTicket } from './TradeTicket';
export { RecentTrades } from './RecentTrades';
```

This enables clean imports:

```typescript
// Instead of:
import { PriceGrid } from '@/features/trading/components/PriceGrid';
import { TradePanel } from '@/features/trading/components/TradePanel';

// We can do:
import { PriceGrid, TradePanel } from '@/features/trading/components';
```

---

## 8. Adding a New Feature

When adding a new feature (e.g., "alerts"):

1. Create feature folder: `src/features/alerts/`
2. Add components: `src/features/alerts/components/`
3. Add API hooks: `src/features/alerts/api/`
4. Add page: `src/features/alerts/AlertsPage.tsx`
5. Add route in `routes.tsx`
6. Export from `src/features/alerts/index.ts`

---

*Document Version: 1.0*  
*Last Updated: April 2026*
