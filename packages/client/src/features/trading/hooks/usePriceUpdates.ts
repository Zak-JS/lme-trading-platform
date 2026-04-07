import { useState, useEffect, useCallback, useMemo } from "react";
import { wsClient } from "@/api/websocket";
import type { MetalPrice, ServerMessage } from "@lme/shared";

export function usePriceUpdates() {
  const [pricesMap, setPricesMap] = useState<Map<string, MetalPrice>>(
    new Map(),
  );

  const handleMessage = useCallback((message: ServerMessage) => {
    if (message.type === "PRICE_SNAPSHOT") {
      const newPrices = new Map<string, MetalPrice>();
      message.data.forEach((price) => {
        newPrices.set(price.symbol, price);
      });
      setPricesMap(newPrices);
    } else if (message.type === "PRICE_UPDATE") {
      setPricesMap((prev) => {
        const updated = new Map(prev);
        updated.set(message.data.symbol, message.data);
        return updated;
      });
    }
  }, []);

  useEffect(() => {
    const unsubscribe = wsClient.subscribe(handleMessage);
    return () => {
      unsubscribe();
    };
  }, [handleMessage]);

  // Memoize the prices array to prevent new reference on every render
  const prices = useMemo<MetalPrice[]>(
    () => Array.from(pricesMap.values()),
    [pricesMap],
  );

  return {
    prices,
    pricesMap,
  };
}
