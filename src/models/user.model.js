import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Le nom est obligatoire']
    },
    email: { 
        type: String, 
        required: [true, 'L\'email est obligatoire'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Email invalide']
    },
    password: { 
        type: String, 
        required: [true, 'Le mot de passe est obligatoire'],
        minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
        select: false // Ne pas retourner le mot de passe par défaut
    },
    score: {
        type: Number,
        default: null,
        min: 0,
        max: 100,
    },
    familyId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Family',
        default: null
    },
    avatarUrl: {
        type: String,
        default: null
    }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);