// src/utils/socketClient.ts
'use client';

import io, { Socket } from 'socket.io-client';

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';

// Sửa lại socketClient.ts
export const socketClient = (token: string): Socket => {
  const socket = io(socketUrl, {
    auth: { 
      token // Server cần xử lý token không có Bearer
    },
    autoConnect: true,
    transports: ['websocket', 'polling'] // Thêm polling để dự phòng
  });

  // Thêm log để debug
  socket.on('connect', () => {
    console.log('Connected to socket with ID:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from socket');
  });

  return socket;
};