import React from 'react';
import { Category } from '../types/level';
import { CellState } from '../hooks/useGameLogic';
import { GridCell } from './GridCell';

interface SubGridProps {
  rowCategory: Category;
  colCategory: Category;
  getCellState: (cat1: Category, cat2: Category, item1: string, item2: string) => CellState;
  toggleCell: (cat1: Category, cat2: Category, item1: string, item2: string) => void;
  isDark?: boolean;
  isCellError?: (cat1: Category, cat2: Category, item1: string, item2: string) => boolean;
}

export function SubGrid({ rowCategory, colCategory, getCellState, toggleCell, isDark, isCellError }: SubGridProps) {
  return (
    <div className="flex flex-col border-[2px] border-black">
      {rowCategory.items.map((rowItem) => (
        <div key={rowItem} className="flex">
          {colCategory.items.map((colItem) => (
            <GridCell
              key={`${rowItem}-${colItem}`}
              state={getCellState(rowCategory, colCategory, rowItem, colItem)}
              onClick={() => toggleCell(rowCategory, colCategory, rowItem, colItem)}
              isDark={isDark}
              isError={isCellError ? isCellError(rowCategory, colCategory, rowItem, colItem) : false}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
