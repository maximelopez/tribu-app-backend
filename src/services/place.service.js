import { Place } from '../models/place.model.js';

export const getPlaces = async ({ city, category }) => {
    const query = {};

    if (city) query.ville = { $regex: city, $options: 'i' };
    if (category) query.categorie = { $regex: category, $options: 'i' };

    return await Place.find(query);
};