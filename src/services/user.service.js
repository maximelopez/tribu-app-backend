import { User } from '../models/user.model.js';
import bcrypt from 'bcrypt';

export const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('Utilisateur non trouvé');

  return {
    profile: {
      id: user._id,
      name: user.name,
      email: user.email,
      score: user.score,
      familyId: user.familyId,
      avatarUrl: user.avatarUrl,
    }
  };
}

// Mettre à jour le profil
export const updateProfile = async (userId, updateData) => {
  const allowedFields = ['name', 'email', 'password', 'avatarUrl'];
  const filteredData = {};

  for (let key of allowedFields) {
    if (updateData[key] !== undefined) {
      filteredData[key] = updateData[key];
    }
  }

  if (filteredData.password) {
    filteredData.password = await bcrypt.hash(filteredData.password, 10);
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: filteredData },
    { new: true, runValidators: true }
  );

  if (!updatedUser) throw new Error('Utilisateur non trouvé');

  return {
    id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    score: updatedUser.score,
    familyId: updatedUser.familyId,
    avatarUrl: updatedUser.avatarUrl,
  };
};

// Mettre à jour uniquement le score
export const updateScore = async (userId, score) => {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { score },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    throw new Error('Utilisateur non trouvé');
  }

  return {
    id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    score: updatedUser.score,
    familyId: updatedUser.familyId,
    avatarUrl: updatedUser.avatarUrl,
  };
};

// Supprimer le profil
export const deleteProfile = async (userId) => {
  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deletedUser) {
    throw new Error('Utilisateur non trouvé');
  }
  return;
};


export const addUserToFamily = async (userId, familyId) => {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { familyId },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    throw new Error('Utilisateur non trouvé');
  }

  return {
    id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    score: updatedUser.score,
    familyId: updatedUser.familyId,
    avatarUrl: updatedUser.avatarUrl,
  };
};

// Récupérer tous les utilisateurs d'une famille
export const getUsersByFamily = async (familyId) => {
  const users = await User.find({ familyId }).select('name score _id avatarUrl');
  // tu peux ajouter d'autres champs que tu veux exposer côté front

  return users.map(user => ({
    id: user._id,
    name: user.name,
    score: user.score,
    avatarUrl: user.avatarUrl,
  }));
};
