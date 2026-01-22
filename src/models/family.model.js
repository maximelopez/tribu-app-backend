import mongoose from 'mongoose';

const familySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Le nom est obligatoire']
    },
    city: {
        type: String,
        required: [true, 'La ville est obligatoire']
    }
}, { timestamps: true });

export const Family = mongoose.model('Family', familySchema);