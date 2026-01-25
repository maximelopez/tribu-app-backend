import app from './app.js';
import http from 'http';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

// Initialise Socket.IO
export const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('Un client est connecté :', socket.id);

  socket.on('registerUser', (userId) => {
    socket.join(`user:${userId}`);
    console.log(`Socket ${socket.id} rejoint user:${userId}`);
  });

  socket.on('joinFamilyRoom', (familyId) => {
    socket.join(`family:${familyId}`);
    console.log(`Socket ${socket.id} rejoint family:${familyId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client déconnecté :', socket.id);
  });
});

// Lance le serveur
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
