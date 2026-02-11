import * as activityService from '../services/activity.service.js';

export const createActivity = async (req, res) => {
    try {
        const activity = await activityService.createActivity(req.body);
         res.status(201).json(activity);
    } catch (error) {
        res.status(400).json({ message: 'Impossible de créer l\'activité', error: error.message });
    }
};

export const getActivity = async (req, res) => {
    try {
        const activityId = req.params.id;

        const activity = await activityService.getActivity(activityId);
        res.status(200).json(activity);
    } catch (error) {
        res.status(400).json({ message: 'Impossible de récupérer l\'activité', error: error.message });
    }
};

export const updateActivity = async (req, res) => {
    try {
        const activityId = req.params.id;
        const updateData = req.body;

        const updateActivity = await activityService.updateActivity(activityId, updateData);
        res.status(200).json(updateActivity);
    } catch (error) {
        res.status(400).json({ message: 'Impossible de mettre à jour l\'activité', error: error.message });
    }
};

export const deleteActivity = async (req, res) => {
    try {
        const activityId = req.params.id;

        await activityService.deleteActivity(activityId);
        res.status(200).json({ message: 'Activité supprimée avec succès' });
    } catch (error) {
        res.status(400).json({ message: 'Impossible de supprimer l\'activité', error: error.message });
    }
};