export type Category = {
  id: string;
  name: string;
  items: string[];
};

export type ProfileItem = {
  name: string;
  detail: string;
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

export type LevelData = {
  id: string;
  level_name: string;
  difficulty: number;
  story_intro: string;
  profiles?: Profiles;
  categories: Category[];
  clues: string[];
  testimonies?: Testimony[];
  solution_grid?: Record<string, string>[];
  correct_accusation: CorrectAccusation;
};
export type ScreenState = 'MENU' | 'HOW_TO_PLAY' | 'LEVEL_SELECT' | 'CASE_SELECT' | 'GAME' | 'SETTINGS';
