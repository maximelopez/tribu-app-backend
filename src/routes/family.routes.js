import { Router } from 'express';
import { 
    createFamily,
    searchFamilies,
    getFamily,
    updateFamily,
    sendJoinRequest,
    respondJoinRequest,
    deleteFamily
} from '../controllers/family.controller.js';

const router = Router();

/**
 * CRUD Familles
 */
router.post('/', createFamily);
router.get('/', searchFamilies);
router.get('/:id', getFamily);
router.put('/:id', updateFamily);
router.delete('/:id', deleteFamily);

/**
 * Join Requests
 * - POST: envoyer une demande
 * - PATCH: accepter ou refuser une demande pour un utilisateur
 */
router.post('/:id/join-requests', sendJoinRequest);
router.patch('/:id/join-requests/:userId', respondJoinRequest);

export default router;
