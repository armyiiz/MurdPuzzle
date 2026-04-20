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
  testimonies: { suspect: string; statement: string }[];
  solution: Record<string, string>[];
};
