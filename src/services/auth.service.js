import { User } from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET must be defined in .env');
    }

    return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Fonction de login
export const loginUser = async (email, password) => {
    const user = await User.findOne({ email }).select('+password');
    if (!user) throw new Error('Email ou mot de passe incorrect');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Email ou mot de passe incorrect');

    const token = generateToken(user);

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            score: user.score,
            familyId: user.familyId,
            avatar: user.avatar,
            theme: user.theme,
        },
        token
    };
};

// Création de l'utilisateur
export const createUser = async (data) => {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) throw new Error('Cet email est déjà utilisé');

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await User.create({
        ...data,
        password: hashedPassword
    });

    const token = generateToken(user);

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            score: user.score,
            familyId: user.familyId,
            avatar: user.avatar,
            theme: user.theme,
        },
        token
    };
};
