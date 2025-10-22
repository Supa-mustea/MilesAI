
import { useEffect, useRef, useState } from 'react';
import { wsClient } from '@/lib/queryClient';

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const handlersRef = useRef<Map<string, (data: any) => void>>(new Map());

  useEffect(() => {
    wsClient.connect();
    
    const unsubscribe = wsClient.onMessage((data) => {
      const handler = handlersRef.current.get(data.type);
      if (handler) {
        handler(data);
      }
    });

    // Check connection status
    const checkConnection = setInterval(() => {
      setIsConnected(wsClient['ws']?.readyState === WebSocket.OPEN);
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(checkConnection);
    };
  }, []);

  const on = (type: string, handler: (data: any) => void) => {
    handlersRef.current.set(type, handler);
  };

  const off = (type: string) => {
    handlersRef.current.delete(type);
  };

  const send = (data: any) => {
    wsClient.send(data);
  };

  return { isConnected, on, off, send };
}
