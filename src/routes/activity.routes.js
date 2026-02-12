import { Router } from 'express';
import { createActivity, getActivity, getAllActivities, updateActivity, deleteActivity } from '../controllers/activity.controller.js';

const router = Router();

router.get('/', getAllActivities);
router.get('/:id', getActivity);
router.post('/', createActivity);
router.put('/:id', updateActivity);
router.delete('/:id', deleteActivity);

export default router;