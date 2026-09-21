// Points cumulés nécessaires pour atteindre chaque niveau
// (l'index 0 correspond au niveau 1)
export const LEVEL_THRESHOLDS = [
  0,     // niveau 1
  100,   // niveau 2
  225,   // niveau 3
  375,   // niveau 4
  575,   // niveau 5
  800,   // niveau 6
  1100,  // niveau 7
  1475,  // niveau 8
  1925,  // niveau 9
  2500,  // niveau 10
];

export const MAX_LEVEL = LEVEL_THRESHOLDS.length;

// Calcule le niveau et la progression à partir du total de points
export const getLevelInfo = (points = 0) => {
  const total = Math.max(0, points);

  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (total >= LEVEL_THRESHOLDS[i]) level = i + 1;
  }

  // Niveau maximum atteint
  if (level === MAX_LEVEL) {
    return { level, isMax: true, pointsIntoLevel: 0, pointsForNext: 0, remaining: 0, progress: 1 };
  }

  const current = LEVEL_THRESHOLDS[level - 1];
  const next = LEVEL_THRESHOLDS[level];

  return {
    level,
    isMax: false,
    pointsIntoLevel: total - current,               // points gagnés dans ce niveau
    pointsForNext: next - current,                  // taille du niveau
    remaining: next - total,                        // points restants avant le suivant
    progress: (total - current) / (next - current), // de 0 à 1, pour une barre
  };
};