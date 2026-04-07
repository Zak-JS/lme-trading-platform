import type { MetalSymbol } from '../constants/metals';
import type { MetalPrice } from './metals';
import type { Trade, Position } from './trading';

export type ClientMessage =
  | { type: 'SUBSCRIBE'; symbols: MetalSymbol[] }
  | { type: 'UNSUBSCRIBE'; symbols: MetalSymbol[] }
  | { type: 'PING' };

export type ServerMessage =
  | { type: 'PRICE_UPDATE'; data: MetalPrice }
  | { type: 'PRICE_SNAPSHOT'; data: MetalPrice[] }
  | { type: 'TRADE_EXECUTED'; data: Trade }
  | { type: 'POSITION_UPDATED'; data: Position }
  | { type: 'PONG' }
  | { type: 'ERROR'; message: string }
  | { type: 'CONNECTED'; clientId: string };
