import { Router } from 'express';
import { 
  createFamily,
  getFamily,
  sendJoinRequest,
  respondJoinRequest
} from '../controllers/family.controller.js';

const router = Router();

router.post('/', createFamily);
router.get('/:id', getFamily);
router.put('/join-request', sendJoinRequest);
router.put('/respond-request', respondJoinRequest);

export default router;
