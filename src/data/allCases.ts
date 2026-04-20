import { LevelData } from '../types/level';
import level1 from './level1.json';
import level2 from './level2.json';
import level3 from './level3.json';
import level4 from './level4.json';

export const allCases: Record<number, LevelData[]> = {
  1: level1 as LevelData[],
  2: level2 as LevelData[],
  3: level3 as LevelData[],
  4: level4 as LevelData[]
};
