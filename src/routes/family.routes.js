import { Router } from 'express';
import { createFamily, getFamily, updateFamily, deleteFamily } from '../controllers/family.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// Créer une famille
router.post('/', authMiddleware, createFamily);

// Voir une famille
router.get('/:id', authMiddleware, getFamily);

// Mettre à jour une famille
router.put('/:id', authMiddleware, updateFamily);

// Supprimer une famille
router.delete('/:id', authMiddleware, deleteFamily);

export default router;