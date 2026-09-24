import { getLevelInfo } from './levels.js';

export const TROPHIES = [
  { id: 'first_points', name: 'Premiers pas', tier: 'bronze' },
  { id: 'all_members_100', name: 'Tribu mobilisée', tier: 'argent' },
  { id: 'thousand_points', name: 'Mille points', tier: 'or' },
  { id: 'max_level', name: 'Niveau maximum', tier: 'platine' },
];

// Vérifie une condition à partir de la famille et de ses membres
const conditions = {
  first_points: (family) => family.points > 0,
  all_members_100: (family, members) =>
    members.length > 0 && members.every((m) => m.points >= 100),
  thousand_points: (family) => family.points >= 1000,
  max_level: (family) => getLevelInfo(family.points).isMax,
};

// Retourne les nouveaux trophées à débloquer (pas encore obtenus)
export const checkNewTrophies = (family, members) => {
  const alreadyUnlocked = new Set(family.unlockedTrophies.map((t) => t.id));

  return TROPHIES.filter(
    (trophy) => !alreadyUnlocked.has(trophy.id) && conditions[trophy.id](family, members)
  );
};