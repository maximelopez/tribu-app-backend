import { getPlacesByCity } from '../services/place.service.js';

export const getPlaces = async (req, res) => {
    const { city } = req.query;

    if (!city) return res.status(400).json({ message: 'Le paramètre ville est requis.' });

    try {
        const places = await getPlacesByCity(city);
        res.json(places);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur.' });
    }
}