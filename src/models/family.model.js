import mongoose from 'mongoose';

const familySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Le nom est obligatoire']
    },
    address: {
        type: String,
        default: null
    },
    phone: {
        type: String,
        default: null
    },
    avatarUrl: {
        type: String,
        default: null
    }
}, { timestamps: true });

export const Family = mongoose.model('Family', familySchema);