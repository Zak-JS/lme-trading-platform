# LME Trading Platform - API Contract

This document defines the API contract that **any backend implementation** must follow. Both the Node.js and Java backends implement this identical interface.

---

## Base Configuration

| Setting | Value |
|---------|-------|
| **Base URL** | `http://localhost:3001` |
| **Content-Type** | `application/json` |
| **WebSocket** | `ws://localhost:3001/ws` |

---

## REST Endpoints

### Prices

#### GET /api/prices
Returns current prices for all metals.

**Response:**
```json
{
  "prices": [
    {
      "symbol": "CU",
      "name": "Copper",
      "price": 8523.45,
      "change": 23.45,
      "changePercent": 0.28,
      "high": 8545.00,
      "low": 8490.00,
      "previousClose": 8500.00,
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### GET /api/prices/:symbol
Returns current price for a specific metal.

**Parameters:**
- `symbol` (path): Metal symbol (CU, AL, ZN, PB, NI, SN)

**Response:**
```json
{
  "symbol": "CU",
  "name": "Copper",
  "price": 8523.45,
  "change": 23.45,
  "changePercent": 0.28,
  "high": 8545.00,
  "low": 8490.00,
  "previousClose": 8500.00,
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

### Trades

#### GET /api/trades
Returns list of executed trades.

**Query Parameters:**
- `limit` (optional): Number of trades to return (default: 50)
- `symbol` (optional): Filter by metal symbol

**Response:**
```json
{
  "trades": [
    {
      "id": "trd_abc123",
      "symbol": "CU",
      "side": "BUY",
      "quantity": 25,
      "price": 8523.45,
      "total": 213086.25,
      "status": "FILLED",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "executedAt": "2024-01-15T10:30:01.000Z"
    }
  ]
}
```

#### POST /api/trades
Execute a new trade.

**Request Body:**
```json
{
  "symbol": "CU",
  "side": "BUY",
  "quantity": 25
}
```

**Validation:**
- `symbol`: Required, must be valid metal symbol
- `side`: Required, must be "BUY" or "SELL"
- `quantity`: Required, positive integer, max 10000

**Response:**
```json
{
  "id": "trd_abc123",
  "symbol": "CU",
  "side": "BUY",
  "quantity": 25,
  "price": 8523.45,
  "total": 213086.25,
  "status": "FILLED",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "executedAt": "2024-01-15T10:30:01.000Z"
}
```

#### GET /api/trades/:id
Returns a specific trade by ID.

---

### Positions

#### GET /api/positions
Returns all current positions.

**Response:**
```json
{
  "positions": [
    {
      "id": "pos_xyz789",
      "symbol": "CU",
      "quantity": 100,
      "avgCost": 8400.00,
      "currentPrice": 8523.45,
      "marketValue": 852345.00,
      "unrealizedPnL": 12345.00,
      "unrealizedPnLPercent": 1.47,
      "createdAt": "2024-01-10T09:00:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### GET /api/positions/summary
Returns portfolio summary.

**Response:**
```json
{
  "totalValue": 1500000.00,
  "totalPnL": 25000.00,
  "totalPnLPercent": 1.69,
  "positionCount": 3,
  "allocation": [
    { "symbol": "CU", "value": 852345.00, "percentage": 56.8 },
    { "symbol": "AL", "value": 450000.00, "percentage": 30.0 },
    { "symbol": "NI", "value": 197655.00, "percentage": 13.2 }
  ]
}
```

---

## WebSocket Protocol

### Connection
```
ws://localhost:3001/ws
```

### Server → Client Messages

#### PRICE_SNAPSHOT
Sent immediately upon connection with all current prices.
```json
{
  "type": "PRICE_SNAPSHOT",
  "data": [
    { "symbol": "CU", "name": "Copper", "price": 8523.45, ... }
  ]
}
```

#### PRICE_UPDATE
Sent when a single metal price changes.
```json
{
  "type": "PRICE_UPDATE",
  "data": { "symbol": "CU", "name": "Copper", "price": 8525.00, ... }
}
```

#### TRADE_EXECUTED
Sent when a trade is executed.
```json
{
  "type": "TRADE_EXECUTED",
  "data": { "id": "trd_abc123", "symbol": "CU", ... }
}
```

#### PONG
Response to client PING.
```json
{
  "type": "PONG"
}
```

#### ERROR
Sent when an error occurs.
```json
{
  "type": "ERROR",
  "message": "Invalid message format"
}
```

### Client → Server Messages

#### PING
Heartbeat to keep connection alive.
```json
{
  "type": "PING"
}
```

#### SUBSCRIBE
Subscribe to specific symbols (optional, defaults to all).
```json
{
  "type": "SUBSCRIBE",
  "symbols": ["CU", "AL"]
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid quantity: must be positive integer"
  }
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created (POST /api/trades)
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

---

## Implementation Checklist

Use this checklist when implementing a new backend:

- [ ] GET /api/prices
- [ ] GET /api/prices/:symbol
- [ ] GET /api/trades
- [ ] POST /api/trades
- [ ] GET /api/trades/:id
- [ ] GET /api/positions
- [ ] GET /api/positions/summary
- [ ] WebSocket /ws connection
- [ ] WebSocket PRICE_SNAPSHOT on connect
- [ ] WebSocket PRICE_UPDATE broadcasts
- [ ] WebSocket PING/PONG heartbeat
- [ ] Price simulation (random walk)
- [ ] CORS enabled for frontend origin
