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

router.post('/', createFamily);
router.get('/', searchFamilies);
router.get('/:id', getFamily);

router.put('/join-request', sendJoinRequest);
router.put('/respond-request', respondJoinRequest);

router.put('/:id', updateFamily);
router.delete('/:id', deleteFamily);

export default router;