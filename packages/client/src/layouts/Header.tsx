import { useEffect, useState } from "react";
import { Activity, BarChart3, TrendingUp, Radio, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { wsClient } from "@/api/websocket";
import type { View } from "./RootLayout";

interface HeaderProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export function Header({ currentView, onViewChange }: HeaderProps) {
  const [time, setTime] = useState(new Date());
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const checkConnection = setInterval(() => {
      setIsConnected(wsClient.isConnected);
    }, 500);
    return () => clearInterval(checkConnection);
  }, []);

  const formattedDate = time.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formattedTime = time.toLocaleTimeString("en-US", { hour12: false });

  return (
    <header
      className="sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      style={{
        boxShadow:
          "0 1px 12px 0 rgba(59,130,246,0.04), 0 1px 0 0 rgba(59,130,246,0.08)",
      }}
    >
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight leading-tight">
                LME Trading
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight">
                London Metal Exchange
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-1">
            <button
              onClick={() => onViewChange("trading")}
              className={cn(
                "relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                currentView === "trading"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Activity className="h-4 w-4" />
              Trading
              {currentView === "trading" && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary" />
              )}
            </button>
            <button
              onClick={() => onViewChange("portfolio")}
              className={cn(
                "relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                currentView === "portfolio"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <BarChart3 className="h-4 w-4" />
              Portfolio
              {currentView === "portfolio" && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary" />
              )}
            </button>
            <button
              onClick={() => onViewChange("styleguide")}
              className={cn(
                "relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                currentView === "styleguide"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Palette className="h-4 w-4" />
              Style Guide
              {currentView === "styleguide" && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary" />
              )}
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1">
            <Radio className="h-3 w-3 text-emerald-500" />
            <span className="text-xs font-semibold text-emerald-500">
              Market Open
            </span>
          </div>

          <div className="h-8 w-px bg-border" />

          <div className="flex items-center gap-2">
            <div className="relative flex h-3 w-3">
              {isConnected && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              )}
              <span
                className={cn(
                  "relative inline-flex h-3 w-3 rounded-full",
                  isConnected ? "bg-emerald-500" : "bg-red-500",
                )}
              />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {isConnected ? "Live" : "Disconnected"}
            </span>
          </div>

          <div className="h-8 w-px bg-border" />

          <div className="text-right">
            <div className="text-xs text-muted-foreground leading-tight">
              {formattedDate}
            </div>
            <div className="text-sm font-bold font-mono tabular-nums leading-tight">
              {formattedTime}{" "}
              <span className="text-xs font-normal text-muted-foreground">
                UTC
              </span>
            </div>
          </div>

          <div className="h-8 w-px bg-border" />

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20 text-xs font-bold text-primary cursor-pointer hover:bg-primary/20 transition-colors">
            JD
          </div>
        </div>
      </div>
    </header>
  );
}
