import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { usePriceUpdates } from "../hooks/usePriceUpdates";
import { useTradingStore } from "../stores/tradingStore";
import { Card } from "@/components/ui/Card";
import { AgGridReact } from "ag-grid-react";
import type {
  ColDef,
  RowClickedEvent,
  RowClassParams,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  type ExtendedMetalPrice,
  type TradingGridContext,
  MetalCellRenderer,
  BidCellRenderer,
  AskCellRenderer,
  ChangeCellRenderer,
  SparklineCellRenderer,
  RangeCellRenderer,
  VolumeCellRenderer,
} from "@/components/tables/trading/cells";

// ── Main Component ─────────────────────────────────────────────────────
export function PriceTable() {
  const { selectedSymbol, setSelectedSymbol } = useTradingStore();
  const gridRef = useRef<AgGridReact<ExtendedMetalPrice>>(null);
  const { prices } = usePriceUpdates();
  const [extendedPrices, setExtendedPrices] = useState<ExtendedMetalPrice[]>(
    [],
  );
  const flashTimers = useRef<Record<string, number>>({});
  const lastFlashTime = useRef<Record<string, number>>({});

  // Configuration for flash throttling (cooldown only - direction comes from server)
  const FLASH_COOLDOWN_MS = 3000;

  // Flash a row by directly manipulating the DOM element
  const flashRow = useCallback((symbol: string, direction: "up" | "down") => {
    // Check cooldown
    const lastFlash = lastFlashTime.current[symbol] || 0;
    if (Date.now() - lastFlash < FLASH_COOLDOWN_MS) {
      return;
    }

    // Clear any existing timer for this symbol
    if (flashTimers.current[symbol]) {
      clearTimeout(flashTimers.current[symbol]);
    }

    // Find all row elements for this symbol
    const rowElements = document.querySelectorAll<HTMLElement>(
      `.ag-row[row-id="${symbol}"]`,
    );

    rowElements.forEach((el) => {
      // Remove any existing flash class to allow re-triggering
      el.classList.remove("ag-row-flash-green", "ag-row-flash-red");
      // Force reflow to restart animation
      void el.offsetWidth;
      // Add the new flash class
      el.classList.add(
        direction === "up" ? "ag-row-flash-green" : "ag-row-flash-red",
      );
    });

    // Track last flash time
    lastFlashTime.current[symbol] = Date.now();

    // Remove the class after animation completes
    flashTimers.current[symbol] = window.setTimeout(() => {
      const els = document.querySelectorAll<HTMLElement>(
        `.ag-row[row-id="${symbol}"]`,
      );
      els.forEach((el) => {
        el.classList.remove("ag-row-flash-green", "ag-row-flash-red");
      });
      delete flashTimers.current[symbol];
    }, 1000);
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(flashTimers.current).forEach(clearTimeout);
    };
  }, []);

  // Extend prices with additional data
  useEffect(() => {
    if (prices.length === 0) return;

    const newPrices = prices.map((price) => {
      // Use server-provided direction for flash (no client-side calculation)
      if (price.direction !== "neutral") {
        flashRow(price.symbol, price.direction);
      }

      return {
        ...price,
        ask: price.price + 1.5,
      };
    });

    setExtendedPrices(newPrices);
  }, [prices, flashRow]);

  // Redraw rows when selection changes
  useEffect(() => {
    const api = gridRef.current?.api;
    if (api) {
      api.redrawRows();
    }
  }, [selectedSymbol]);

  const columnDefs = useMemo<ColDef<ExtendedMetalPrice>[]>(
    () => [
      {
        headerName: "Metal",
        field: "symbol",
        cellRenderer: MetalCellRenderer,
        flex: 2,
        minWidth: 180,
        sortable: true,
      },
      {
        headerName: "Bid / Spread",
        field: "price",
        cellRenderer: BidCellRenderer,
        headerClass: "ag-right-aligned-header",
        flex: 1.2,
        minWidth: 120,
        sortable: true,
        comparator: (a: number, b: number) => a - b,
      },
      {
        headerName: "Ask",
        field: "ask",
        cellRenderer: AskCellRenderer,
        headerClass: "ag-right-aligned-header",
        flex: 1,
        minWidth: 100,
        sortable: true,
        comparator: (a: number, b: number) => a - b,
      },
      {
        headerName: "Change",
        field: "change",
        cellRenderer: ChangeCellRenderer,
        headerClass: "ag-right-aligned-header",
        flex: 1.3,
        minWidth: 130,
        sortable: true,
        comparator: (a: number, b: number) => a - b,
      },
      {
        headerName: "Volume",
        field: "volume",
        cellRenderer: VolumeCellRenderer,
        headerClass: "ag-right-aligned-header",
        flex: 0.8,
        minWidth: 80,
        sortable: true,
      },
      {
        headerName: "Trend",
        field: "priceHistory",
        cellRenderer: SparklineCellRenderer,
        flex: 1,
        minWidth: 100,
        sortable: false,
      },
      {
        headerName: "Range (D)",
        field: "high",
        cellRenderer: RangeCellRenderer,
        flex: 1.2,
        minWidth: 120,
        sortable: false,
      },
    ],
    [],
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      resizable: true,
      sortable: true,
      suppressMovable: false,
      sortingOrder: ["asc", "desc", null],
    }),
    [],
  );

  const context = useMemo<TradingGridContext>(
    () => ({
      selectedSymbol,
    }),
    [selectedSymbol],
  );

  const getRowId = useCallback(
    (params: { data: ExtendedMetalPrice }) => params.data.symbol,
    [],
  );

  const getRowClass = useCallback(
    (params: RowClassParams<ExtendedMetalPrice>) => {
      if (!params.data) return "";
      if (params.data.symbol === selectedSymbol) {
        return "ag-row-selected-custom";
      }
      return "";
    },
    [selectedSymbol],
  );

  const onRowClicked = useCallback(
    (event: RowClickedEvent<ExtendedMetalPrice>) => {
      if (event.data) {
        setSelectedSymbol(event.data.symbol);
      }
    },
    [setSelectedSymbol],
  );

  if (extendedPrices.length === 0) {
    return (
      <Card className="flex h-full items-center justify-center">
        <div className="text-muted-foreground">Loading prices...</div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden flex flex-col h-full bg-card/50 backdrop-blur-sm border-border/60">
      <div className="px-5 py-3 border-b border-border/60 flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-positive animate-pulse-dot" />
        <span className="text-xs uppercase tracking-wider text-foreground font-semibold">
          Market Prices
        </span>
        <span className="ml-auto text-[10px] text-muted-foreground/60 font-mono">
          AG-Grid • {extendedPrices.length} instruments
        </span>
      </div>
      <div
        className="ag-theme-alpine-dark flex-1"
        style={{ width: "100%", height: "100%", minHeight: 400 }}
      >
        <AgGridReact<ExtendedMetalPrice>
          ref={gridRef}
          rowData={extendedPrices}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          context={context}
          getRowId={getRowId}
          getRowClass={getRowClass}
          onRowClicked={onRowClicked}
          rowHeight={60}
          headerHeight={40}
          animateRows={true}
          suppressCellFocus={true}
          suppressRowHoverHighlight={false}
          suppressRowClickSelection={true}
        />
      </div>
    </Card>
  );
}
