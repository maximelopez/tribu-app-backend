import mongoose from 'mongoose';
import dns from 'dns';

// Forcer Node à utiliser Google DNS
dns.setServers(['8.8.8.8']);
dns.setDefaultResultOrder('ipv4first');

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connecté');
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB :', error);
    throw error; // Arrête le serveur si la DB n’est pas accessible
  }
};
