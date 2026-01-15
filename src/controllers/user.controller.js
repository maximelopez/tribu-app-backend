import * as userService from '../services/user.service.js';

// Se connecter
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userService.loginUser(email, password);
        res.json(user);
    } catch (error) {
        if (error.message.includes('Utilisateur non trouvé') || error.message.includes('Mot de passe incorrect')) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

// S'inscrire
export const createUser = async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(409).json({ message: 'Impossible de créer l’utilisateur', error: error.message });
    }
};

// Récupérer le profil utilisateur
export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await userService.getProfile(userId);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: 'Impossible de récupérer le profil', error: error.message });
    }
};

// Mettre à jour le profil
export const updateProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const updateData = req.body;

        const updatedUser = await userService.updateProfile(userId, updateData);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: 'Impossible de mettre à jour le profil', error: error.message });
    }
};

// Mettre à jour le score
export const updateScore = async (req, res) => {
  try {
    const userId = req.params.id;
    const { score } = req.body;

    // Vérification simple
    if (typeof score !== 'number') {
      return res.status(400).json({ message: 'Le score doit être un nombre' });
    }

    const updatedUser = await userService.updateScore(userId, score);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: 'Impossible de mettre à jour le score', error: error.message });
  }
};

// Supprimer le profil
export const deleteProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        
        await userService.deleteProfile(userId);
        res.status(200).json({ message: 'Profil supprimé avec succès' });
    } catch (error) {
        res.status(400).json({ message: 'Impossible de supprimer le profil', error: error.message });
    }
};

export const addUserToFamily = async (req, res) => {
    try {
        const userId = req.params.id;
        const { familyId } = req.body;

        if (!familyId) {
            return res.status(400).json({ message: 'familyId est requis' });
        }

        const updatedUser = await userService.addUserToFamily(userId, familyId);

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ 
            message: 'Impossible d’ajouter la famille à l’utilisateur',
            error: error.message 
        });
    }
};