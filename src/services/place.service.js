import { Place } from '../models/place.model.js';

export const getPlacesByCity = async (city) => {
    return await Place.find({
        ville: { $regex: city, $options: 'i' }
    });
};