import { Router } from 'express';
import {  
    getProfile, 
    updateProfile, 
    deleteProfile, 
    updateScore, 
    addUserToFamily 
} from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/:id', getProfile);
router.patch('/:id', updateProfile);
router.delete('/:id', deleteProfile);
router.patch('/:id/score', updateScore);
router.patch('/:id/family', addUserToFamily);

export default router;