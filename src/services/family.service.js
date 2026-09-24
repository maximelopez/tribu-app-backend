import { Family } from "../models/family.model.js";
import { User } from "../models/user.model.js";
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

  // Un utilisateur qui a déjà une Tribu ne peut pas en demander une autre
  const user = await User.findById(userId);
  if (!user) throw new Error("Utilisateur non trouvé");
  if (user.familyId) throw new Error("Vous faites déjà partie d'une Tribu");

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
// Retourne la famille mise à jour et, en cas d'acceptation, les autres familles
// qui avaient une demande de cet utilisateur (pour prévenir leurs créateurs).
export const handleJoinRequest = async (familyId, userId, accept) => {
  const family = await Family.findById(familyId);
  if (!family) throw new Error("Famille non trouvée");

  if (!family.joinRequests.some((id) => id.toString() === userId)) {
    throw new Error("Aucune demande trouvée pour cet utilisateur");
  }

  let otherFamilies = [];

  if (accept) {
    // 1. On rattache d'abord l'utilisateur, seulement s'il n'a pas déjà une Tribu.
    //    Le filtre { familyId: null } rend l'opération sûre même si deux créateurs
    //    acceptent en même temps : un seul des deux réussira.
    const joinedUser = await User.findOneAndUpdate(
      { _id: userId, familyId: null },
      { familyId },
      { new: true }
    );

    if (!joinedUser) {
      // Déjà dans une Tribu (ou supprimé) : la demande n'a plus lieu d'être
      await Family.updateOne({ _id: familyId }, { $pull: { joinRequests: userId } });
      throw new Error("Cet utilisateur fait déjà partie d'une Tribu");
    }

    // 2. Les autres familles où il avait aussi demandé à entrer
    otherFamilies = await Family.find(
      { _id: { $ne: familyId }, joinRequests: userId },
      { creatorId: 1 }
    );

    // 3. On retire toutes ses demandes en attente (celle-ci comprise)
    await Family.updateMany({ joinRequests: userId }, { $pull: { joinRequests: userId } });
  } else {
    // Refus : on retire uniquement cette demande
    await Family.updateOne({ _id: familyId }, { $pull: { joinRequests: userId } });
  }

  const populatedFamily = await Family.findById(familyId).populate("joinRequests", "name");

  return {
    family: formatFamily(populatedFamily, formatJoinRequests(populatedFamily.joinRequests)),
    otherFamilies: otherFamilies.map((f) => ({ id: f._id.toString(), creatorId: f.creatorId.toString() })),
  };
};

// Supprimer une famille
export const deleteFamily = async (familyId) => {
  const deletedFamily = await Family.findByIdAndDelete(familyId);

  if (!deletedFamily) {
    throw new Error("Famille non trouvée");
  }

  return deletedFamily;
};
