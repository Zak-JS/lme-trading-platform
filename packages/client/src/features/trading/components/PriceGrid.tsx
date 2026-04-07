import { useState, useEffect, useRef } from "react";
import type { MetalSymbol } from "@lme/shared";
import { usePriceUpdates } from "../hooks/usePriceUpdates";
import { PriceCard } from "./PriceCard";

interface PriceGridProps {
  selectedSymbol: MetalSymbol | null;
  onSelectSymbol: (symbol: MetalSymbol) => void;
}

export function PriceGrid({ selectedSymbol, onSelectSymbol }: PriceGridProps) {
  const { prices } = usePriceUpdates();
  const [flashStates, setFlashStates] = useState<
    Record<string, "up" | "down" | "neutral">
  >({});
  const prevPrices = useRef<Record<string, number>>({});

  useEffect(() => {
    const newFlashStates: Record<string, "up" | "down" | "neutral"> = {};

    prices.forEach((price) => {
      const prevPrice = prevPrices.current[price.symbol];
      if (prevPrice !== undefined && prevPrice !== price.price) {
        newFlashStates[price.symbol] = price.price > prevPrice ? "up" : "down";
      }
      prevPrices.current[price.symbol] = price.price;
    });

    if (Object.keys(newFlashStates).length > 0) {
      setFlashStates(newFlashStates);
      const timer = setTimeout(() => setFlashStates({}), 500);
      return () => clearTimeout(timer);
    }
  }, [prices]);

  if (prices.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        Loading prices...
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {prices.map((price) => (
        <PriceCard
          key={price.symbol}
          price={price}
          isSelected={selectedSymbol === price.symbol}
          onClick={() => onSelectSymbol(price.symbol)}
          flashDirection={flashStates[price.symbol] || "neutral"}
        />
      ))}
    </div>
  );
}
