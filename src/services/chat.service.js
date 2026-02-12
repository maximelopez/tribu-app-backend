import Chat from '../models/chat.model.js';

// Crée un nouveau message
export const createMessage = async (familyId, senderId, content) => {
  const message = new Chat({ familyId, senderId, content });
  return await message.save();
};

// Récupère tous les messages d'une famille
export const getMessagesByFamily = async (familyId) => {
  return await Chat.find({ familyId })
    .populate('senderId', 'name email') // optionnel : afficher infos de l'expéditeur
    .sort({ createdAt: 1 }); // du plus ancien au plus récent
};