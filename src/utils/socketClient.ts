import { getSession } from 'next-auth/react';
import io, { Socket } from 'socket.io-client';

const socketClient = async (): Promise<Socket | null> => {
  const session = await getSession();
  const token = (session as any)?.access_token;

  if (!token) return null;

  const options = {
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  };
  const socketUrl = process.env.SOCKET_URL || 'http://localhost:4000';
  return io(socketUrl, options);
};

export default socketClient;
