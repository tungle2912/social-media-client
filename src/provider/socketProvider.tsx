import { getSession } from 'next-auth/react';
import { createContext, useContext, useEffect, useState } from 'react';
import { SOCKET_EVENT_KEY } from '~/definitions/constants/index.constant';
import useListOnline from '~/stores/listOnline.data';
import socketClient from '~/utils/socketClient';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = async (children: any) => {
  const setListOnline = useListOnline((state) => state.setListOnline);
  const session = await getSession();
  const token = (session as any)?.access_token;
  const [socket, setSocket] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const newSocket: any = socketClient();
    setSocket(newSocket);
    if (newSocket) {
      newSocket.on(SOCKET_EVENT_KEY.CONNECT, (data: any) => {
        if (loading) return;
        setListOnline(data);
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
        }, 5000);
      });

      return () => {
        newSocket.off(SOCKET_EVENT_KEY.CONNECT);
        newSocket.disconnect();
      };
    }
  }, [token]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
