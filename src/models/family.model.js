import mongoose from 'mongoose';

const familySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Le nom est obligatoire']
    },
    city: {
        type: String,
        required: [true, 'La ville est obligatoire']
    },
    slogan: {
        type: String,
        default: null,
    },
    topics: {
        type: [String],
        default: []
    },
    points: {
        type: Number,
        default: 0,
        min: 0
    },
    unlockedTrophies: [
        {
            id: { type: String, required: true },
            unlockedAt: { type: Date, default: Date.now }
        }
    ],
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    joinRequests: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ]
}, { timestamps: true });

export const Family = mongoose.model('Family', familySchema);