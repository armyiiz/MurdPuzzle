import React from 'react';
import { Category } from '../types/level';
import { CellState } from '../hooks/useGameLogic';
import { getCategoryEmoji } from '../utils/emojiHelper';

interface LogicGridProps {
  categories: Category[];
  getCellState: (cat1: Category, cat2: Category, item1: string, item2: string) => CellState;
  toggleCell: (cat1: Category, cat2: Category, item1: string, item2: string) => void;
  isCellError?: (cat1: Category, cat2: Category, item1: string, item2: string) => boolean;
}

export function LogicGrid({ categories, getCellState, toggleCell, isCellError }: LogicGridProps) {
  const numCats = categories.length;
  if (numCats < 3) return null;

  const topCategories = categories.slice(1);
  const leftCategories = [categories[0], ...[...categories.slice(2)].reverse()];

  return (
    <div className="w-full max-w-3xl mx-auto overflow-x-auto p-0">
      <table className="border-collapse table-fixed w-max mx-auto">
        <tbody>
          {/* Top Header Row */}
          <tr>
            <td className="w-8 h-8 sm:w-10 sm:h-10 p-1 text-[8px] text-black font-bold tracking-tighter leading-none text-center border border-transparent align-middle">
              LOGIC GRID
            </td>
            {topCategories.map((cat, catIndex) => (
              cat.items.map((item, itemIndex) => {
                const isFirstOfBlock = itemIndex === 0;
                return (
                  <td
                    key={`top-${cat.id}-${item}`}
                    className={`w-8 h-8 sm:w-10 sm:h-10 border border-black bg-white align-middle text-center p-0
                      border-t-[4px] ${isFirstOfBlock ? 'border-l-[4px]' : ''}
                    `}
                  >
                    <div className="flex items-center justify-center w-full h-full">
                      {getCategoryEmoji(cat.id, itemIndex, item)}
                    </div>
                  </td>
                );
              })
            ))}
          </tr>

          {/* Rows for Left Categories */}
          {leftCategories.map((rowCat, rowCatIndex) => {
            const numCols = numCats - 1 - rowCatIndex;
            const rowTopCategories = topCategories.slice(0, numCols);

            return rowCat.items.map((rowItem, rowItemIndex) => {
              const isFirstOfRowBlock = rowItemIndex === 0;

              return (
                <tr key={`row-${rowCat.id}-${rowItem}`}>
                  {/* Left Header Cell */}
                  <td
                    className={`w-8 h-8 sm:w-10 sm:h-10 border border-black bg-white align-middle text-center p-0
                      border-l-[4px] ${isFirstOfRowBlock ? 'border-t-[4px]' : ''}
                    `}
                  >
                    <div className="flex items-center justify-center w-full h-full">
                      {getCategoryEmoji(rowCat.id, rowItemIndex, rowItem)}
                    </div>
                  </td>

                  {/* Grid Cells */}
                  {rowTopCategories.map((colCat, colCatIndex) => {
                    const isDark = (rowCatIndex + colCatIndex) % 2 === 1;

                    return colCat.items.map((colItem, colItemIndex) => {
                      const state = getCellState(rowCat, colCat, rowItem, colItem);
                      const isError = isCellError ? isCellError(rowCat, colCat, rowItem, colItem) : false;
                      const isFirstColOfBlock = colItemIndex === 0;

                      return (
                        <td
                          key={`cell-${rowCat.id}-${rowItem}-${colCat.id}-${colItem}`}
                          onClick={() => toggleCell(rowCat, colCat, rowItem, colItem)}
                          className={`w-8 h-8 sm:w-10 sm:h-10 border border-black align-middle text-center p-0 cursor-pointer select-none text-xl font-bold transition-colors
                            ${isFirstOfRowBlock ? 'border-t-[4px]' : ''}
                            ${isFirstColOfBlock ? 'border-l-[4px]' : ''}
                            ${isError ? 'bg-red-400' : isDark ? 'bg-neo-notebook' : 'bg-white'}
                            hover:bg-gray-200
                          `}
                        >
                          {state === 'O' && <span className="text-base sm:text-2xl drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">✅</span>}
                          {state === 'X' && <span className="text-base sm:text-2xl drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">❌</span>}
                        </td>
                      );
                    });
                  })}
                </tr>
              );
            });
          })}
        </tbody>
      </table>
    </div>
  );
}
