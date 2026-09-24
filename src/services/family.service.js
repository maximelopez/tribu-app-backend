import { Family } from "../models/family.model.js";
import { getLevelInfo } from "../config/levels.js";
import { TROPHIES } from "../config/trophies.js";

// Échappe les caractères spéciaux pour les utiliser dans une regex
const escapeRegex = (text) => String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Transforme les demandes populées en tableau {id, name}
const formatJoinRequests = (joinRequests) =>
  joinRequests.map((user) => ({
    id: user._id,
    name: user.name,
  }));

// Format commun d'une famille
const formatFamily = (family, joinRequests = family.joinRequests) => ({
  id: family._id,
  name: family.name,
  city: family.city,
  slogan: family.slogan,
  topics: family.topics,
  points: family.points,
  levelInfo: getLevelInfo(family.points),
  trophies: family.unlockedTrophies.map((t) => ({
    ...TROPHIES.find((trophy) => trophy.id === t.id),
    unlockedAt: t.unlockedAt,
  })),
  creatorId: family.creatorId,
  joinRequests,
});

// Créer une famille
export const createFamily = async (data, creatorId) => {
  const { name, city, slogan, topics } = data;

  const family = new Family({ name, city, slogan, topics, creatorId });
  await family.save();

  return { family: formatFamily(family) };
};

// Rechercher des familles
export const searchFamilies = async (search) => {
  const families = await Family.find({
    name: { $regex: escapeRegex(search), $options: "i" },
  }).limit(20);

  return families.map((family) => formatFamily(family));
};

// Récupérer une famille
export const getFamily = async (familyId) => {
  const family = await Family.findById(familyId).populate("joinRequests", "name");

  if (!family) {
    throw new Error("Famille non trouvée");
  }

  return {
    family: formatFamily(family, formatJoinRequests(family.joinRequests)),
  };
};

// Mettre à jour une famille
export const updateFamily = async (familyId, updateData) => {
  const allowedFields = ["name", "city", "slogan", "topics"];
  const filteredData = {};

  for (const key of allowedFields) {
    if (updateData[key] !== undefined) {
      filteredData[key] = updateData[key];
    }
  }

  const updatedFamily = await Family.findByIdAndUpdate(
    familyId,
    { $set: filteredData },
    { new: true, runValidators: true }
  );

  if (!updatedFamily) {
    throw new Error("Famille non trouvée");
  }

  return updatedFamily;
};

// Envoyer une demande pour rejoindre une famille
export const requestToJoinFamily = async (familyId, userId) => {
  const family = await Family.findById(familyId);
  if (!family) throw new Error("Famille non trouvée");

  // Vérification si déjà demandé
  if (family.joinRequests.some((id) => id.toString() === userId)) {
    throw new Error("Vous avez déjà envoyé une demande à cette famille");
  }

  family.joinRequests.push(userId);
  await family.save();

  const populatedFamily = await Family.findById(familyId).populate("joinRequests", "name");

  return formatFamily(populatedFamily, formatJoinRequests(populatedFamily.joinRequests));
};

// Accepter ou refuser une demande
export const handleJoinRequest = async (familyId, userId, accept) => {
  const family = await Family.findById(familyId);
  if (!family) throw new Error("Famille non trouvée");

  if (!family.joinRequests.some((id) => id.toString() === userId)) {
    throw new Error("Aucune demande trouvée pour cet utilisateur");
  }

  // Supprime la demande
  family.joinRequests = family.joinRequests.filter((id) => id.toString() !== userId);
  await family.save();

  const populatedFamily = await Family.findById(familyId).populate("joinRequests", "name");

  return formatFamily(populatedFamily, formatJoinRequests(populatedFamily.joinRequests));
};

// Supprimer une famille
export const deleteFamily = async (familyId) => {
  const deletedFamily = await Family.findByIdAndDelete(familyId);

  if (!deletedFamily) {
    throw new Error("Famille non trouvée");
  }

  return deletedFamily;
};
