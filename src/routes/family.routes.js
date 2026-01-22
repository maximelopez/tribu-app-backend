import { Router } from 'express';
import { createFamily, getFamily, updateFamily, deleteFamily } from '../controllers/family.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// Créer une famille
router.post('/', createFamily);

// Voir une famille
router.get('/:id', getFamily);

// Mettre à jour une famille
router.put('/:id', updateFamily);

// Supprimer une famille
router.delete('/:id', deleteFamily);

export default router;