# LME Trading Platform - Java Backend

This is the **Java/Spring Boot** implementation of the LME Trading Platform backend. It implements the same API contract as the Node.js backend, allowing the frontend to work with either implementation.

## Tech Stack

- **Framework:** Spring Boot 3.x
- **Language:** Java 17+
- **Database:** H2 (embedded, similar to SQLite)
- **WebSocket:** Spring WebSocket
- **Build Tool:** Maven

## Why Two Backends?

This project demonstrates the ability to:
1. Design backend-agnostic frontends
2. Work across multiple tech stacks (Node.js and Java)
3. Follow API contracts for consistent integration

## API Contract

Both backends implement the identical API defined in [`docs/API_CONTRACT.md`](../../docs/API_CONTRACT.md).

## Getting Started

### Prerequisites
- Java 17 or higher
- Maven 3.8+

### Run the Server

```bash
cd packages/server-java
mvn spring-boot:run
```

Server will start at `http://localhost:3001`

### Build

```bash
mvn clean package
java -jar target/lme-server-0.1.0.jar
```

## Project Structure

```
server-java/
├── src/main/java/com/lme/trading/
│   ├── LmeApplication.java          # Main entry point
│   ├── config/
│   │   ├── CorsConfig.java           # CORS configuration
│   │   └── WebSocketConfig.java      # WebSocket configuration
│   ├── controller/
│   │   ├── PriceController.java      # GET /api/prices
│   │   ├── TradeController.java      # GET/POST /api/trades
│   │   └── PositionController.java   # GET /api/positions
│   ├── service/
│   │   ├── PriceService.java         # Price simulation
│   │   ├── TradeService.java         # Trade execution
│   │   └── PositionService.java      # Position management
│   ├── model/
│   │   ├── Metal.java                # Metal enum
│   │   ├── MetalPrice.java           # Price DTO
│   │   ├── Trade.java                # Trade entity
│   │   └── Position.java             # Position entity
│   ├── repository/
│   │   ├── TradeRepository.java
│   │   └── PositionRepository.java
│   └── websocket/
│       └── PriceWebSocketHandler.java
├── src/main/resources/
│   ├── application.yml
│   └── data.sql                      # Seed data
└── pom.xml
```

## Implementation Status

- [ ] Project setup (pom.xml, application.yml)
- [ ] Metal enum and DTOs
- [ ] Price service with simulation
- [ ] REST controllers
- [ ] WebSocket handler
- [ ] JPA entities and repositories
- [ ] Seed data

## Switching Between Backends

The frontend is configured to connect to `http://localhost:3001`. Simply run whichever backend you prefer:

**Node.js:**
```bash
pnpm --filter @lme/server dev
```

**Java:**
```bash
cd packages/server-java && mvn spring-boot:run
```

Both serve on port 3001 with identical API responses.
