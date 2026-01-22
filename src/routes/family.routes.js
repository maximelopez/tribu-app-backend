import { Router } from 'express';
import { createFamily, searchFamilies, getFamily, updateFamily, deleteFamily } from '../controllers/family.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', createFamily);
router.get('/', searchFamilies);
router.get('/:id', getFamily);
router.put('/:id', updateFamily);
router.delete('/:id', deleteFamily);

export default router;