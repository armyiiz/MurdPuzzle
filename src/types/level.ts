export type Category = {
  id: string;
  name: string;
  items: string[];
};

export type LevelData = {
  level_name: string;
  difficulty: number;
  story_intro: string;
  categories: Category[];
  clues: string[];
  testimonies: any[]; // Ignored for Phase 2
  solution: Record<string, string>[];
};
