import Chat from '../models/chat.model.js';

// Crée un nouveau message
export const createMessage = async (familyId, sender, content) => {
  const message = new Chat({ familyId, sender, content });
  return await message.save();
};

// Récupère tous les messages d'une famille
export const getMessagesByFamily = async (familyId) => {
  return await Chat.find({ familyId })
    .populate('sender', 'name') // on ne récupère que le nom
    .sort({ createdAt: 1 });    // du plus ancien au plus récent
};