// src/provider/socketProvider.tsx
'use client';

import { useSession } from 'next-auth/react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import { SOCKET_EVENT_KEY } from '~/definitions/constants/index.constant';
import useListOnline from '~/stores/listOnline.data';
import { socketClient } from '~/utils/socketClient';

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const initialized = useRef(false);
  const setListOnline = useListOnline((state) => state.setListOnline);
  useEffect(() => {
    if (status === 'loading') return;
    if (initialized.current) return;

    const token = (session as any)?.accessToken;

    if (!token) {
      console.warn('No token available');
      return;
    }

    initialized.current = true;
    const newSocket = socketClient(token);

    newSocket.on(SOCKET_EVENT_KEY.CONNECT, (data: any) => {
      console.log('Socket connected');
    });
    newSocket.on('onlineUsers', (onlineUsers: string[]) => {
      setListOnline(onlineUsers); 
    });
    newSocket.on('connect_error', (err) => {
      console.error('Connection error:', err.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      initialized.current = false;
    };
  }, [(session as any)?.accessToken, status, setListOnline]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
