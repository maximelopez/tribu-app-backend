import { Router } from 'express';
import {  
    getProfile, 
    updateProfile, 
    deleteProfile, 
    updateScore, 
    addUserToFamily,
    getUsersByFamily
} from '../controllers/user.controller.js';

const router = Router();

router.get('/:id', getProfile);
router.patch('/:id', updateProfile);
router.delete('/:id', deleteProfile);
router.patch('/:id/score', updateScore);
router.patch('/:id/family', addUserToFamily);

router.get('/', getUsersByFamily);

export default router;