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

  return io(`${process.env.NEXT_PUBLIC_API_ENDPOINT}`, options);
};

export default socketClient;
