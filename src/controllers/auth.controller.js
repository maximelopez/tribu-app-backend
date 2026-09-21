import * as authService from '../services/auth.service.js';

// Se connecter
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.loginUser(email, password);
    res.json(user);
  } catch (error) {
    res.status(401).json({ message: 'Email ou mot de passe incorrect' });
  }
};

// S'inscrire
export const registerUser = async (req, res) => {
  try {
    const user = await authService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    // 409 uniquement si l'email est déjà pris, 400 pour les autres erreurs
    const status = error.message === 'Cet email est déjà utilisé' ? 409 : 400;
    res.status(status).json({ message: 'Impossible de créer l’utilisateur', error: error.message });
  }
};
