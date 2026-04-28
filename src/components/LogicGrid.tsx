import React from 'react';
import { Category } from '../types/level';
import { CellState } from '../hooks/useGameLogic';
import { getIconClass, getIconColor } from '../utils/emojiHelper';

interface LogicGridProps {
  categories: Category[];
  getCellState: (cat1: Category, cat2: Category, item1: string, item2: string) => CellState;
  toggleCell: (cat1: Category, cat2: Category, item1: string, item2: string) => void;
  isCellError?: (cat1: Category, cat2: Category, item1: string, item2: string) => boolean;
  seedString?: string;
}

export function LogicGrid({ categories, getCellState, toggleCell, isCellError, seedString }: LogicGridProps) {
  const numCats = categories.length;
  if (numCats < 3) return null;

  const topCategories = categories.slice(1);
  const leftCategories = [categories[0], ...[...categories.slice(2)].reverse()];

  // Calculate dynamic width based on total columns
  // 1 label column + (number of top categories * number of items per category)
  // We use a slight safety margin (95vw instead of 100vw) to account for borders/padding.
  const numItemsPerCat = topCategories.length > 0 ? topCategories[0].items.length : 1;
  const totalCols = 1 + (topCategories.length * numItemsPerCat);
  const cellStyle = {
    width: `min(40px, max(24px, 95vw / ${totalCols}))`,
    height: `min(40px, max(24px, 95vw / ${totalCols}))`
  };
  const textSizeScale = totalCols > 10 ? 'text-[3vw]' : 'text-[4vw]';
  const labelSizeScale = totalCols > 10 ? 'text-[1.5vw]' : 'text-[2vw]';

  return (
    <div className="w-full max-w-3xl mx-auto overflow-hidden p-0 flex justify-center">
      <table className="border-collapse table-fixed w-max mx-auto">
        <tbody>
          {/* Top Header Row */}
          <tr>
            <td style={cellStyle} className={`p-1 ${labelSizeScale} sm:text-[8px] text-black font-bold tracking-tighter leading-none text-center border border-transparent align-middle`}>
              LOGIC GRID
            </td>
            {topCategories.map((cat, catIndex) => (
              cat.items.map((item, itemIndex) => {
                const isFirstOfBlock = itemIndex === 0;
                return (
                  <td
                    key={`top-${cat.id}-${item}`}
                    style={cellStyle}
                    className={`border border-black bg-white align-middle text-center p-0
                      border-t-[4px] ${isFirstOfBlock ? 'border-l-[4px]' : ''}
                    `}
                  >
                    <div className="flex items-center justify-center w-full h-full">
                      <i className={`${getIconClass(cat.id, item)} text-[3vw] sm:text-[2vw] md:text-2xl [text-shadow:2px_2px_0_#000] max-md:[text-shadow:none]`} style={{ color: getIconColor(itemIndex, seedString, cat.id) }}></i>
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
                    style={cellStyle}
                    className={`border border-black bg-white align-middle text-center p-0
                      border-l-[4px] ${isFirstOfRowBlock ? 'border-t-[4px]' : ''}
                    `}
                  >
                    <div className="flex items-center justify-center w-full h-full">
                      <i className={`${getIconClass(rowCat.id, rowItem)} text-[3vw] sm:text-[2vw] md:text-2xl [text-shadow:2px_2px_0_#000] max-md:[text-shadow:none]`} style={{ color: getIconColor(rowItemIndex, seedString, rowCat.id) }}></i>
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
                          style={cellStyle}
                          className={`border border-black align-middle text-center p-0 cursor-pointer select-none font-bold transition-colors
                            ${isFirstOfRowBlock ? 'border-t-[4px]' : ''}
                            ${isFirstColOfBlock ? 'border-l-[4px]' : ''}
                            ${isError ? 'bg-red-400' : isDark ? 'bg-neo-notebook' : 'bg-white'}
                            hover:bg-gray-200
                          `}
                        >
                          {state === 'O' && <span className={`${textSizeScale} sm:text-2xl [text-shadow:2px_2px_0_#000]`}>✅</span>}
                          {state === 'X' && <span className={`${textSizeScale} sm:text-2xl [text-shadow:2px_2px_0_#000]`}>❌</span>}
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
