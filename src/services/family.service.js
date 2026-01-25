import { Family } from "../models/family.model.js";

/**
 * Créer une famille
 */
export const createFamily = async (data, creatorId) => {
  const family = new Family({
    ...data,
    creatorId,
  });

  await family.save();

  return {
    family: {
      id: family._id,
      name: family.name,
      city: family.city,
      slogan: family.slogan,
      themes: family.themes,
      creatorId: family.creatorId,
      joinRequests: family.joinRequests,
    },
  };
};

/**
 * Rechercher des familles
 */
export const searchFamilies = async (search) => {
  const families = await Family.find({
    name: { $regex: search, $options: "i" },
  }).limit(20);

  return families.map((family) => ({
    id: family._id,
    name: family.name,
    city: family.city,
    slogan: family.slogan,
    themes: family.themes,
    creatorId: family.creatorId,
    joinRequests: family.joinRequests,
  }));
};

/**
 * Récupérer une famille
 */
export const getFamily = async (familyId) => {
  const family = await Family.findById(familyId);

  if (!family) {
    throw new Error("Famille non trouvée");
  }

  return {
    family: {
      id: family._id,
      name: family.name,
      city: family.city,
      slogan: family.slogan,
      themes: family.themes,
      creatorId: family.creatorId,
      joinRequests: family.joinRequests,
    },
  };
};

/**
 * Mettre à jour une famille
 */
export const updateFamily = async (familyId, updateData) => {
  const updatedFamily = await Family.findByIdAndUpdate(
    familyId,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!updatedFamily) {
    throw new Error("Famille non trouvée");
  }

  return updatedFamily;
};

/**
 * Envoyer une demande pour rejoindre une famille
 */
export const requestToJoinFamily = async (familyId, userId) => {
  const family = await Family.findById(familyId);
  if (!family) {
    throw new Error("Famille non trouvée");
  }

  // ❌ Déjà demandé
  const alreadyRequested = family.joinRequests.some(
    (id) => id.toString() === userId
  );

  if (alreadyRequested) {
    throw new Error("Vous avez déjà envoyé une demande à cette famille");
  }

  family.joinRequests.push(userId);
  await family.save();

  return family;
};

/**
 * Accepter ou refuser une demande
 */
export const handleJoinRequest = async (familyId, userId, accept) => {
  const family = await Family.findById(familyId);
  if (!family) {
    throw new Error("Famille non trouvée");
  }

  const requestExists = family.joinRequests.some(
    (id) => id.toString() === userId
  );

  if (!requestExists) {
    throw new Error("Aucune demande trouvée pour cet utilisateur");
  }

  // Retirer la demande
  family.joinRequests = family.joinRequests.filter(
    (id) => id.toString() !== userId
  );

  await family.save();

  return family;
};

/**
 * Supprimer une famille
 */
export const deleteFamily = async (familyId) => {
  const deletedFamily = await Family.findByIdAndDelete(familyId);

  if (!deletedFamily) {
    throw new Error("Famille non trouvée");
  }

  return deletedFamily;
};
