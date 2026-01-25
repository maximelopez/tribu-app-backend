import app from './app.js';
import http from 'http';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 3000;

// Crée le serveur HTTP à partir de l'app Express
const server = http.createServer(app);

// Initialise Socket.IO
export const io = new Server(server, {
  cors: {
    origin: '*', // adapter selon ton app
  },
});

io.on('connection', (socket) => {
  console.log('Un client est connecté :', socket.id);

  // Permet de rejoindre une room par familyId
  socket.on('joinFamilyRoom', (familyId) => {
    socket.join(familyId);
    console.log(`Socket ${socket.id} rejoint la room ${familyId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client déconnecté :', socket.id);
  });
});

// Lance le serveur
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
