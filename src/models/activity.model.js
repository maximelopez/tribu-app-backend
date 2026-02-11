import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Le nom est obligatoire']
    },
    description: {
        type: String,
        required: [true, 'La description est obligatoire']
    },
     members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false
        }
    ]
}, { timestamps: true });

export const Activity = mongoose.model('Activity', activitySchema);