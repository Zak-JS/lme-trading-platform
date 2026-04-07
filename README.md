# LME Trading Platform

A real-time trading platform for London Metal Exchange base metals, demonstrating modern full-stack development with React and Node.js.

![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)
![React](https://img.shields.io/badge/React-18.3-61dafb)
![Node.js](https://img.shields.io/badge/Node.js-20+-green)
![Deployed](https://img.shields.io/badge/Deployed-Railway-blueviolet)

## 🚀 Live Demo

**https://trading-platform-production-3db5.up.railway.app**

---

## 📚 Documentation

| Document                                       | Description                                                          |
| ---------------------------------------------- | -------------------------------------------------------------------- |
| [REQUIREMENTS.md](./REQUIREMENTS.md)           | Business requirements, user flows with diagrams, technical decisions |
| [ARCHITECTURE.md](./ARCHITECTURE.md)           | System architecture, data flow diagrams, deployment details          |
| [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) | Folder structure, naming conventions, file organization              |

---

## Quick Start

```bash
# Install dependencies
pnpm install

# Setup database
pnpm run db:generate
pnpm run db:migrate
pnpm run db:seed

# Start development servers
pnpm run dev
```

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3001

---

## Tech Stack & Rationale

### Frontend

| Technology         | Purpose            | Why This Choice                                            |
| ------------------ | ------------------ | ---------------------------------------------------------- |
| **React 18**       | UI Framework       | Industry standard, demonstrates component architecture     |
| **TypeScript**     | Type Safety        | Catches errors at compile time, self-documenting code      |
| **TanStack Query** | Server State       | Handles caching, background refetching, optimistic updates |
| **TailwindCSS**    | Styling            | Rapid prototyping, consistent design system                |
| **Recharts**       | Data Visualization | Composable charts for portfolio allocation                 |
| **Vite**           | Build Tool         | Fast HMR, optimized production builds                      |

### Backend

| Technology      | Purpose           | Why This Choice                                      |
| --------------- | ----------------- | ---------------------------------------------------- |
| **Fastify**     | HTTP Server       | High performance, TypeScript-first, plugin ecosystem |
| **WebSocket**   | Real-time Updates | Sub-second price updates without polling             |
| **Drizzle ORM** | Database          | Type-safe queries, lightweight, excellent DX         |
| **SQLite**      | Database          | Zero-config, portable, sufficient for demo scale     |
| **Zod**         | Validation        | Runtime validation with TypeScript inference         |

### Monorepo Structure

```
├── packages/
│   ├── shared/     # Types, schemas, constants (used by both)
│   ├── server/     # Fastify REST + WebSocket API
│   ├── client/     # React SPA
│   └── server-java/ # (Placeholder) Spring Boot alternative
```

**Why Monorepo?** Shared types between frontend and backend eliminate API contract drift and enable end-to-end type safety.

---

## Architecture Patterns

### 1. Feature-Based Organization (Frontend)

```
src/features/
├── trading/
│   ├── api/          # React Query hooks
│   ├── components/   # Feature-specific UI
│   └── hooks/        # Custom hooks
└── portfolio/
    └── ...
```

Scales better than grouping by file type. Each feature is self-contained.

### 2. Service Layer (Backend)

```
Routes → Services → Database
```

- **Routes:** HTTP/validation only
- **Services:** Business logic, reusable across routes
- **Database:** Drizzle schema + queries

### 3. Real-Time Architecture

```
┌─────────┐    WebSocket    ┌─────────┐
│ Client  │◄───────────────►│ Server  │
└─────────┘                 └─────────┘
     │                           │
     │  React Query              │  Price Service
     │  (cache sync)             │  (simulation)
     ▼                           ▼
  UI Updates              Broadcast to all clients
```

Price updates flow via WebSocket, React Query cache is updated, UI re-renders automatically.

### 4. Backend-Agnostic Design

The API contract is documented separately, allowing the backend to be reimplemented in any language (Java/Spring Boot scaffold included) while the frontend remains unchanged.

---

## Key Features

| Feature               | Implementation                                              |
| --------------------- | ----------------------------------------------------------- |
| **Live Price Grid**   | WebSocket subscription, flash animations on price change    |
| **Trade Execution**   | Form validation, optimistic updates, position recalculation |
| **Portfolio View**    | Positions table, P&L calculation, allocation pie chart      |
| **Connection Status** | Visual indicator, automatic reconnection with backoff       |

---

## API Overview

### REST Endpoints

| Method | Endpoint                 | Description              |
| ------ | ------------------------ | ------------------------ |
| GET    | `/api/prices`            | All current metal prices |
| GET    | `/api/trades`            | Trade history            |
| POST   | `/api/trades`            | Execute a trade          |
| GET    | `/api/positions`         | Current holdings         |
| GET    | `/api/positions/summary` | Portfolio summary        |

### WebSocket Events

| Event            | Direction       | Description               |
| ---------------- | --------------- | ------------------------- |
| `PRICE_SNAPSHOT` | Server → Client | Initial prices on connect |
| `PRICE_UPDATE`   | Server → Client | Single price change       |
| `TRADE_EXECUTED` | Server → Client | Trade confirmation        |
| `PING/PONG`      | Bidirectional   | Heartbeat                 |

---

## Project Structure

```
Metal exchange/
├── README.md                 # This file
├── REQUIREMENTS.md           # Domain research & requirements gathering
├── package.json              # Root workspace config
├── pnpm-workspace.yaml
├── packages/
│   ├── shared/               # Shared types & validation
│   │   └── src/
│   │       ├── constants/    # Metal definitions
│   │       ├── types/        # TypeScript interfaces
│   │       └── schemas/      # Zod validation schemas
│   ├── server/               # Node.js backend
│   │   └── src/
│   │       ├── db/           # Drizzle schema & migrations
│   │       ├── services/     # Business logic
│   │       ├── routes/       # REST endpoints
│   │       └── websocket/    # Real-time handler
│   ├── client/               # React frontend
│   │   └── src/
│   │       ├── api/          # Axios, React Query, WebSocket
│   │       ├── components/   # Shared UI components
│   │       ├── features/     # Feature modules
│   │       └── layouts/      # Page layouts
│   └── server-java/          # (Future) Spring Boot backend
└── docs/                     # Detailed technical docs (reference)
```

---

## Development Scripts

```bash
pnpm run dev          # Start all services
pnpm run build        # Production build
pnpm run db:seed      # Seed sample data
pnpm run typecheck    # Type checking
```

---

## Future Enhancements

- [ ] Authentication (JWT)
- [ ] Order book depth visualization
- [ ] Historical price charts (candlestick)
- [ ] Trade blotter with filtering
- [ ] Java/Spring Boot backend implementation
