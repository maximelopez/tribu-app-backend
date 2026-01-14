import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Le nom est obligatoire']
    },
    email: { 
        type: String, 
        required: [true, 'L\'email est obligatoire'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: { 
        type: String, 
        required: [true, 'Le mot de passe est obligatoire'],
        minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères']
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
    }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);