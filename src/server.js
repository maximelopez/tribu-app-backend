import app from './app.js';
import http from 'http';
import { Server } from 'socket.io';
import * as chatService from './services/chat.service.js';

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

  // Rejoindre sa room utilisateur (notifications privées)
  socket.on('registerUser', (userId) => {
    socket.join(`user:${userId}`);
    console.log(`Socket ${socket.id} rejoint user:${userId}`);
  });

  // Rejoindre la room famille
  socket.on('joinFamilyRoom', (familyId) => {
    socket.join(`family:${familyId}`);
    console.log(`Socket ${socket.id} rejoint family:${familyId}`);
  });

  // Envoyer un message dans la famille
  socket.on('sendMessage', async ({ familyId, sender, content }) => {
    try {
      const message = await chatService.createMessage(familyId, sender, content);

      const populatedMessage = await message.populate('sender', 'name');

      io.to(`family:${familyId}`).emit('newMessage', populatedMessage);
    } catch (error) {
      console.error('Erreur sendMessage:', error);
      socket.emit('errorMessage', { message: error.message });
    }
  });

  // Récupérer l'historique des messages d'une famille
  socket.on('getHistory', async (familyId) => {
    try {
      const messages = await chatService.getMessagesByFamily(familyId);
      socket.emit('chatHistory', messages);
    } catch (error) {
      socket.emit('errorMessage', { message: error.message });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client déconnecté :', socket.id);
  });
});

// Lance le serveur
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
