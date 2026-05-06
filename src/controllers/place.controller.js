import * as placeService from '../services/place.service.js';

export const getPlaces = async (req, res) => {
    const { city, category } = req.query;

    try {
        const places = await placeService.getPlaces({ city, category });
        res.json(places);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur.' });
    }
}
