import * as familyService from '../services/family.service.js';
import { io } from '../server.js';
import { User } from '../models/user.model.js';

// Créer une famille
export const createFamily = async (req, res) => {
  try {
    const { creatorId } = req.body;

    if (!creatorId) {
      return res.status(400).json({ message: 'creatorId manquant' });
    }

    const family = await familyService.createFamily(req.body, creatorId);

    res.status(201).json(family);
  } catch (error) {
    res.status(400).json({
      message: 'Impossible de créer la famille',
      error: error.message,
    });
  }
};

// Rechercher des familles
export const searchFamilies = async (req, res) => {
  try {
    const { search } = req.query;

    if (!search) {
      return res.status(200).json({ families: [] });
    }

    const families = await familyService.searchFamilies(search);
    res.status(200).json({ families });
  } catch (error) {
    res.status(400).json({
      message: 'Impossible de rechercher les familles',
      error: error.message,
    });
  }
};

// Récupérer une famille
export const getFamily = async (req, res) => {
  try {
    const familyId = req.params.id;

    const family = await familyService.getFamily(familyId);
    res.status(200).json(family);
  } catch (error) {
    res.status(400).json({
      message: 'Impossible de récupérer la famille',
      error: error.message,
    });
  }
};

// Mettre à jour une famille
export const updateFamily = async (req, res) => {
  try {
    const familyId = req.params.id;
    const updateData = req.body;

    const updatedFamily = await familyService.updateFamily(familyId, updateData);

    // Notifier tous les membres connectés de la famille
    io.to(`family:${familyId}`).emit('familyUpdated', {
      id: updatedFamily._id,
      name: updatedFamily.name,
      city: updatedFamily.city,
      slogan: updatedFamily.slogan,
      themes: updatedFamily.themes,
    });

    res.status(200).json({
      family: {
        id: updatedFamily._id,
        name: updatedFamily.name,
        city: updatedFamily.city,
        slogan: updatedFamily.slogan,
        themes: updatedFamily.themes,
      },
    });
  } catch (error) {
    res.status(400).json({
      message: 'Impossible de mettre à jour la famille',
      error: error.message,
    });
  }
};

// Envoyer une demande pour rejoindre une famille
export const sendJoinRequest = async (req, res) => {
  try {
    const familyId = req.params.id;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'userId manquant' });
    }

    const family = await familyService.requestToJoinFamily(familyId, userId);

    // Notifier le créateur
    io.to(`user:${family.creatorId}`).emit('newJoinRequest', { familyId, userId });

    res.status(200).json({ message: 'Demande envoyée', family });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Accepter ou refuser une demande
export const respondJoinRequest = async (req, res) => {
  try {
    const familyId = req.params.id;
    const userId = req.params.userId;
    const { accept } = req.body;

    if (typeof accept !== 'boolean') {
      return res.status(400).json({ message: 'accept doit être un booléen' });
    }

    const family = await familyService.handleJoinRequest(familyId, userId, accept);

    if (accept) {
      // Associer l'utilisateur à la famille
      await User.findByIdAndUpdate(userId, { familyId });

      // Notifier l'utilisateur
      io.to(`user:${userId}`).emit('familyAccepted', { familyId });

      // Notifier les membres de la famille
      io.to(`family:${familyId}`).emit('memberJoined', { userId });
    } else {
      // Notifier l'utilisateur du refus
      io.to(`user:${userId}`).emit('familyRejected', { familyId });
    }

    res.status(200).json({ message: 'Demande traitée', family });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer une famille
export const deleteFamily = async (req, res) => {
  try {
    const familyId = req.params.id;

    await familyService.deleteFamily(familyId);

    res.status(200).json({
      message: 'Famille supprimée avec succès',
    });
  } catch (error) {
    res.status(400).json({
      message: 'Impossible de supprimer la famille',
      error: error.message,
    });
  }
};