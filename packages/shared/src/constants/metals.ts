export const METALS = [
  { symbol: 'CU', name: 'Copper', lotSize: 25, basePrice: 8500 },
  { symbol: 'AL', name: 'Aluminium', lotSize: 25, basePrice: 2300 },
  { symbol: 'ZN', name: 'Zinc', lotSize: 25, basePrice: 2800 },
  { symbol: 'PB', name: 'Lead', lotSize: 25, basePrice: 2100 },
  { symbol: 'NI', name: 'Nickel', lotSize: 6, basePrice: 16000 },
  { symbol: 'SN', name: 'Tin', lotSize: 5, basePrice: 25000 },
] as const;

export type MetalSymbol = (typeof METALS)[number]['symbol'];

export const METAL_SYMBOLS: MetalSymbol[] = ['CU', 'AL', 'ZN', 'PB', 'NI', 'SN'];

export const getMetalBySymbol = (symbol: MetalSymbol) => {
  return METALS.find((m) => m.symbol === symbol);
};

export const getMetalName = (symbol: MetalSymbol): string => {
  return getMetalBySymbol(symbol)?.name ?? symbol;
};
