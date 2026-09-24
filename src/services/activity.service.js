import { Activity } from '../models/activity.model.js';
import { User } from '../models/user.model.js';
import { Family } from '../models/family.model.js';
import { checkNewTrophies } from '../config/trophies.js';

export const createActivity = async (data) => {
    const activity = new Activity(data);
    return await activity.save();
};

// Nombre de points qu'une activité rapporte à un membre
const POINTS_PER_MEMBER = 25; // à remplacer par activity.points plus tard

export const joinActivity = async (activityId, userId) => {
  // Inscrit l'utilisateur seulement s'il n'y est pas déjà (évite les doublons)
  const activity = await Activity.findOneAndUpdate(
    { _id: activityId, members: { $ne: userId } },
    { $push: { members: userId } },
    { new: true }
  );

  if (!activity) {
    throw new Error('Déjà inscrit à cette activité, ou activité introuvable');
  }

  // Points à l'utilisateur
  const user = await User.findByIdAndUpdate(
    userId,
    { $inc: { points: POINTS_PER_MEMBER } },
    { new: true }
  );

  if (!user.familyId) {
    return { activity, newTrophies: [] };
  }

  // Points à la famille
  const family = await Family.findByIdAndUpdate(
    user.familyId,
    { $inc: { points: POINTS_PER_MEMBER } },
    { new: true }
  );

  // Vérifie les trophées débloqués
  const members = await User.find({ familyId: family._id }, 'points');
  const newTrophies = checkNewTrophies(family, members);

  if (newTrophies.length > 0) {
    family.unlockedTrophies.push(...newTrophies.map((t) => ({ id: t.id })));
    await family.save();
  }

  return { activity, newTrophies };
};

export const getActivity = async (activityId) => {
  return await Activity.findById(activityId).populate('members');
};

export const getAllActivities = async ({ city } = {}) => {
  const query = {};
  if (city) query.city = city;

  return await Activity.find(query).populate('members');
};

export const updateActivity = async (activityId, updateData) => {
    const updatedActivity = await Activity.findByIdAndUpdate(
        activityId,
        { $set: updateData },
        { new: true, runValidators: true }
    );

    if (!updatedActivity) throw new Error('Activité non trouvée');
  
    return updatedActivity;
};

export const deleteActivity = async (activityId) => {
    return await Activity.findByIdAndDelete(activityId);
};
