import { User } from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const generateToken = (user) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET must be defined in .env');
  }

  return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Fonction de login
export const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new Error('Email ou mot de passe incorrect');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Email ou mot de passe incorrect');

  const token = generateToken(user);

  return { 
    user: { 
      id: user._id, 
      name: user.name, 
      email: user.email, 
      score: user.score,
      familyId: user.familyId,
      avatarUrl: user.avatarUrl,
    }, 
    token 
  };
};

// Création de l'utilisateur
export const createUser = async (data) => {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) throw new Error('Cet email est déjà utilisé');

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await User.create({
    ...data,
    password: hashedPassword
  });

  const token = generateToken(user);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      score: user.score,
      familyId: user.familyId,
      avatarUrl: user.avatarUrl,
    },
    token
  };
};

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
