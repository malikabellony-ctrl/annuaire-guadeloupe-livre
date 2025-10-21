export type Role = 'visitor'|'contributor'|'moderator'|'admin';
export const Types = ['auteur','editeur','illustrateur','librairie','bibliotheque','lieu','independant','autre'] as const;
export type EntityType = typeof Types[number];
export const Statuses = ['draft','pending','published','rejected'] as const;
