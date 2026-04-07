import { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { wsClient } from '@/api/websocket';
import { cn } from '@/lib/utils';

export function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkConnection = () => {
      setIsConnected(wsClient.isConnected);
    };

    checkConnection();
    const interval = setInterval(checkConnection, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium',
        isConnected
          ? 'bg-green-500/10 text-green-500'
          : 'bg-red-500/10 text-red-500'
      )}
    >
      {isConnected ? (
        <>
          <Wifi className="h-3 w-3" />
          <span>Live</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3" />
          <span>Disconnected</span>
        </>
      )}
    </div>
  );
}
