import { getPlacesByCity } from '../services/place.service.js';

export const getPlacesByCity = async (req, res) => {
    const { ville } = req.query;

    if (!ville) {
        return res.status(400).json({ message: 'Le paramètre ville est requis.' });
    }

    try {
        const places = await getPlacesByCity(ville);
        res.json(places);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur.' });
    }
}