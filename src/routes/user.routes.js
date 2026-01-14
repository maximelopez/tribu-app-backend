import { Router } from 'express';
import { createUser, loginUser, getProfile, updateProfile, deleteProfile, updateScore, addUserToFamily } from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// Authentification
router.post('/login', loginUser);
router.post('/signup', createUser);

// User
router.get('/:id', authMiddleware, getProfile);
router.put('/:id', authMiddleware, updateProfile);
router.delete('/:id', authMiddleware, deleteProfile);

// Score
router.put('/:id/score', updateScore);

// Famille
router.put('/:id/family', authMiddleware, addUserToFamily);

export default router;