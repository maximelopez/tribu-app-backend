import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
    categorie: {
        type: String, 
        required: true 
    },
    nom: { 
        type: String, 
        required: true 
    },
    region: { 
        type: String, 
        required: true 
    },
    adresse: { 
        type: String, 
        required: true 
    },
    ville: { 
        type: String, 
        required: true 
    },
    latitude: { 
        type: Number, 
        required: true 
    },
    longitude: { 
        type: Number, 
        required: true 
    },
}, { timestamps: false });

export const Place = mongoose.model("Place", placeSchema);