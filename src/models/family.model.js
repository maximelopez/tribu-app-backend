import mongoose from 'mongoose';

const familySchema = mongoose.Schema({
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
    themes: {
        type: [String],
        default: []
    },
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