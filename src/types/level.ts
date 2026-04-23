export type Category = {
  id: string;
  name: string;
  items: string[];
};

export type ProfileItem = {
  name: string;
  detail: string;
  confession?: string;
};

export type Profiles = {
  suspects?: ProfileItem[];
  weapons?: ProfileItem[];
  locations?: ProfileItem[];
  motives?: ProfileItem[];
};

export type Testimony = {
  suspect: string;
  statement: string;
};

export type CorrectAccusation = {
  suspect: string;
  weapon: string;
  location: string;
  motive?: string;
};

export type DynamicClue = {
  dynamic: true;
  subject: string;
  relation: 'WITH' | 'NOT_WITH';
  object: string;
};

export type LevelData = {
  id: string;
  level_name: string;
  difficulty: number;
  story_intro: string;
  profiles?: Profiles;
  categories: Category[];
  clues: (string | DynamicClue)[];
  testimonies?: Testimony[];
  solution_grid?: Record<string, string>[];
  correct_accusation: CorrectAccusation;
};
