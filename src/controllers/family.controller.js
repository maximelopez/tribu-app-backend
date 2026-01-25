import * as familyService from '../services/family.service.js';
import { io } from '../server.js';
import { User } from '../models/user.model.js';

export const createFamily = async (req, res) => {
  try {
    const userId = req.body.creatorId;
    const family = await familyService.createFamily(req.body, userId);

    res.status(201).json(family);
  } catch (error) {
    res.status(400).json({ message: 'Impossible de créer la famille.', error: error.message });
  }
};

export const getFamily = async (req, res) => {
  try {
    const familyId = req.params.id;
    const family = await familyService.getFamily(familyId);
    res.status(200).json(family);
  } catch (error) {
    res.status(400).json({ message: 'Impossible de récupérer la famille.', error: error.message });
  }
};

// Envoyer une demande
export const sendJoinRequest = async (req, res) => {
  try {
    const { familyId, userId } = req.body;
    const family = await familyService.requestToJoinFamily(familyId, userId);

    // ⚡ Émettre un événement à tous les sockets de la famille
    io.to(familyId).emit('joinRequestUpdated', family.joinRequests);

    res.status(200).json({ message: 'Demande envoyée', family });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Accepter ou refuser une demande
export const respondJoinRequest = async (req, res) => {
  try {
    const { familyId, userId, accept } = req.body;
    const family = await familyService.handleJoinRequest(familyId, userId, accept);

    if (accept) {
      const updatedUser = await User.findByIdAndUpdate(userId, { familyId }, { new: true });
      io.to(userId).emit('familyAccepted', { familyId });
    } else {
      io.to(userId).emit('familyRejected', { familyId });
    }

    // ⚡ Mettre à jour la room famille pour tous les sockets du créateur
    io.to(familyId).emit('joinRequestUpdated', family.joinRequests);

    res.status(200).json({ message: 'Demande traitée', family });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
