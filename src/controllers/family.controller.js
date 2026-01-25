import * as familyService from '../services/family.service.js';
import { io } from '../server.js';

export const createFamily = async (req, res) => {
    try {
        const userId = req.body.creatorId;
        const family = await familyService.createFamily(req.body, userId);

         res.status(201).json(family);
    } catch (error) {
        res.status(400).json({ message: 'Impossible de créer la famille.', error: error.message });
    }
};

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

export const getFamily = async (req, res) => {
    try {
        const familyId = req.params.id;

        const family = await familyService.getFamily(familyId);
        res.status(200).json(family);
    } catch (error) {
        res.status(400).json({ message: 'Impossible de récupérer la famille.', error: error.message });
    }
};

export const updateFamily = async (req, res) => {
    try {
        const familyId = req.params.id;
        const updateData = req.body;

        const updatedFamily = await familyService.updateFamily(familyId, updateData);

        // Émettre l'événement à tous les sockets dans la room de la famille
        io.to(familyId).emit('familyUpdated', {
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
            }
        });
    } catch (error) {
        res.status(400).json({ message: 'Impossible de mettre à jour la famille.', error: error.message });
    }
};

export const requestToJoinFamily = async (req, res) => {
    try {
        const familyId = req.params.id;
        const userId = req.body.userId;

        const result = await familyService.requestToJoinFamily(userId, familyId);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: 'Impossible d’envoyer la demande.', error: error.message });
    }
};

export const deleteFamily = async (req, res) => {
    try {
        const familyId = req.params.id;

        await familyService.deleteFamily(familyId);
        res.status(200).json({ message: 'Famille supprimée avec succès.' });
    } catch (error) {
        res.status(400).json({ message: 'Impossible de supprimer la famille.', error: error.message });
    }
};