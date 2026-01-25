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

export const getFamily = async (familyId) => {
  const family = await Family.findById(familyId);
  return {
    family: {
      id: family._id,
      name: family.name,
      city: family.city,
      slogan: family.slogan,
      themes: family.themes,
      creatorId: family.creatorId,
      joinRequests: family.joinRequests || []
    }
  };
};

// Ajouter une demande de rejoindre la famille
export const requestToJoinFamily = async (familyId, userId) => {
  const family = await Family.findById(familyId);
  if (!family) throw new Error('Famille non trouvée');

  if (family.joinRequests.includes(userId)) {
    throw new Error('Vous avez déjà envoyé une demande à cette famille');
  }

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
