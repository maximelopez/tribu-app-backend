import { Router } from 'express';
import { createActivity, getActivity, getAllActivities, joinActivity, updateActivity, deleteActivity } from '../controllers/activity.controller.js';

const router = Router();

router.get('/', getAllActivities);
router.get('/:id', getActivity);
router.post('/', createActivity);
router.post('/:id/join', joinActivity);
router.put('/:id', updateActivity);
router.delete('/:id', deleteActivity);

export default router;