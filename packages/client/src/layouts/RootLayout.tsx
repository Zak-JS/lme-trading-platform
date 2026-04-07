import { useState, useEffect } from "react";
import { Header } from "./Header";
import { TradingPage } from "@/features/trading/TradingPage";
import { PortfolioPage } from "@/features/portfolio/PortfolioPage";
import { StyleGuidePage } from "@/features/styleguide/StyleGuidePage";
import { wsClient } from "@/api/websocket";

export type View = "trading" | "portfolio" | "styleguide";

export function RootLayout() {
  const [currentView, setCurrentView] = useState<View>("trading");

  useEffect(() => {
    wsClient.connect();
    return () => wsClient.disconnect();
  }, []);

  const renderPage = () => {
    switch (currentView) {
      case "trading":
        return <TradingPage />;
      case "portfolio":
        return <PortfolioPage />;
      case "styleguide":
        return <StyleGuidePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-[1600px] h-full">{renderPage()}</div>
      </main>
    </div>
  );
}
