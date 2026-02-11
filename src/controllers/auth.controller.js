import * as userService from '../services/user.service.js';

// Se connecter
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.loginUser(email, password);
    res.json(user);
  } catch (error) {
    res.status(401).json({ message: 'Email ou mot de passe incorrect' });
  }
};

// S'inscrire
export const registerUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(409).json({ message: 'Impossible de créer l’utilisateur', error: error.message });
  }
};
