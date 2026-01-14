import { Activity } from '../models/activity.model.js';

export const createActivity = async (data) => {
    const activity = new Activity(data);
    return await activity.save();
};

export const getActivity = async (activityId) => {
    return await Activity.findById(activityId);
};

export const updateActivity = async (activityId, updateData) => {
    const updatedActivity = await Activity.findByIdAndUpdate(
        activityId,
        { $set: updateData },
        { new: true, runValidators: true }
    );

    if (!updatedActivity) throw new Error('Activité non trouvé.');
  
    return updatedActivity;
};

export const deleteActivity = async (activityId) => {
    return await Activity.findByIdAndDelete(activityId);
};