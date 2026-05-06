import { Router } from 'express';
import { getPlacesByCity } from '../services/place.service.js';

const router = Router();

router.get('/', getPlacesByCity);

export default router;
