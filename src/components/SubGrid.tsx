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
    <div className="flex flex-col border-r-[2px] border-b-[2px] border-black h-full">
      {rowCategory.items.map((rowItem, rowIndex) => (
        <div key={rowItem} className="flex flex-1">
          {colCategory.items.map((colItem, colIndex) => (
            <div
              key={`${rowItem}-${colItem}`}
              className={`flex-1 border-black ${colIndex !== colCategory.items.length - 1 ? 'border-r-[2px]' : ''} ${rowIndex !== rowCategory.items.length - 1 ? 'border-b-[2px]' : ''}`}
            >
              <GridCell
                state={getCellState(rowCategory, colCategory, rowItem, colItem)}
                onClick={() => toggleCell(rowCategory, colCategory, rowItem, colItem)}
                isDark={isDark}
                isError={isCellError ? isCellError(rowCategory, colCategory, rowItem, colItem) : false}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
