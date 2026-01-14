import { Router } from 'express';
import { createActivity, getActivity, updateActivity, deleteActivity } from '../controllers/activity.controller.js';

const router = Router();

router.post('/', createActivity);
router.get('/:id', getActivity);
router.put('/:id', updateActivity);
router.delete('/:id', deleteActivity);

export default router;