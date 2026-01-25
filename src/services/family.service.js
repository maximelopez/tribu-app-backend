import { Family } from "../models/family.model.js";

export const createFamily = async (data, creatorId) => {
    const family = new Family({ ...data, creatorId });

    await family.save();

    return {
        family: {
            id: family._id,
            name: family.name,
            city: family.city,
            slogan: family.slogan,
            themes: family.themes,
            creatorId: family.creatorId,
            joinRequests: family.joinRequests
        }
    };
};

export const searchFamilies = async (search) => {
    const families = await Family.find({
        name: { $regex: search, $options: 'i' }
    }).limit(20);

    return families.map(family => ({
        id: family._id,
        name: family.name,
        city: family.city,
        slogan: family.slogan,
        themes: family.themes,
    }));
};

export const getFamily = async (familyId) => {
    const family = await Family.findById(familyId);
    return {
        family: {
            id: family._id,
            name: family.name,
            city: family.city,
            slogan: family.slogan,
            themes: family.themes,
        }
    };
};

export const updateFamily = async (familyId, updateData) => {
    const updatedFamily = await Family.findByIdAndUpdate(
        familyId,
        { $set: updateData },
        { new: true, runValidators: true }
    );

    if (!updatedFamily) throw new Error('Famille non trouvé.');
  
    return updatedFamily;
};

// Ajouter une demande de rejoindre la famille
export const requestToJoinFamily = async (familyId, userId) => {
  const family = await Family.findById(familyId);
  if (!family) throw new Error('Famille non trouvée');

  // Vérifie que l’utilisateur n’a pas déjà fait une demande
  if (family.joinRequests.includes(userId)) {
    throw new Error('Vous avez déjà envoyé une demande à cette famille');
  }

  // Ajouter la demande
  family.joinRequests.push(userId);
  await family.save();

  return family;
};

// Accepter ou refuser une demande
export const handleJoinRequest = async (familyId, userId, accept) => {
  const family = await Family.findById(familyId);
  if (!family) throw new Error('Famille non trouvée');

  // Retire la demande
  family.joinRequests = family.joinRequests.filter(id => id.toString() !== userId);
  await family.save();

  return family;
};

export const deleteFamily = async (familyId) => {
    return await Family.findByIdAndDelete(familyId);
};