import { User } from '../models/user.model.js';
import bcrypt from 'bcrypt';

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  score: user.score,
  familyId: user.familyId,
  avatar: user.avatar,
  theme: user.theme,
  birthdate: user.birthdate,
});

export const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('Utilisateur non trouvé');
  return formatUser(user);
};

// Mettre à jour le profil
export const updateProfile = async (userId, updateData) => {
  const allowedFields = ['name', 'email', 'password', 'avatar'];
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
  return formatUser(updatedUser);
};

// Mettre à jour uniquement le score
export const updateScore = async (userId, score) => {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { score },
    { new: true, runValidators: true }
  );

  if (!updatedUser) throw new Error('Utilisateur non trouvé');
  return formatUser(updatedUser);
};

// Mettre à jour le thème
export const updateTheme = async (userId, theme) => {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { theme },
    { new: true, runValidators: true }
  );

  if (!updatedUser) throw new Error('Utilisateur non trouvé');
  return formatUser(updatedUser);
};

// Mettre à jour la date de naissance
export const updateBirthdate = async (userId, birthdate) => {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { birthdate },
    { new: true, runValidators: true }
  );

  if (!updatedUser) throw new Error('Utilisateur non trouvé');
  return formatUser(updatedUser);
};

// Supprimer le profil
export const deleteProfile = async (userId) => {
  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deletedUser) throw new Error('Utilisateur non trouvé');
  return;
};


export const addUserToFamily = async (userId, familyId) => {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { familyId },
    { new: true, runValidators: true }
  );

  if (!updatedUser) throw new Error('Utilisateur non trouvé');
  return formatUser(updatedUser);
};

// Récupérer tous les utilisateurs d'une famille
export const getUsersByFamily = async (familyId) => {
  const users = await User.find({ familyId });
  return users.map(formatUser);
};
