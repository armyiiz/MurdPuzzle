import React from 'react';
import { Category } from '../types/level';
import { CellState } from '../hooks/useGameLogic';
import { SubGrid } from './SubGrid';

interface LogicGridProps {
  categories: Category[];
  getCellState: (cat1: Category, cat2: Category, item1: string, item2: string) => CellState;
  toggleCell: (cat1: Category, cat2: Category, item1: string, item2: string) => void;
  isCellError?: (cat1: Category, cat2: Category, item1: string, item2: string) => boolean;
}

export function LogicGrid({ categories, getCellState, toggleCell, isCellError }: LogicGridProps) {
  const numCats = categories.length;
  if (numCats < 3) return null;

  const renderTopHeader = (category: Category) => (
    <div className="flex">
      {category.items.map(item => (
        <div key={item} className="w-10 h-32 flex items-center justify-center border border-gray-200 overflow-hidden">
          <span
            className="text-sm whitespace-nowrap"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            {item}
          </span>
        </div>
      ))}
    </div>
  );

  const renderLeftHeader = (category: Category) => (
    <div className="flex flex-col">
      {category.items.map(item => (
        <div key={item} className="h-10 w-32 flex items-center justify-end pr-2 border border-gray-200 text-sm whitespace-nowrap overflow-hidden text-right">
          {item}
        </div>
      ))}
    </div>
  );

  const topCategories = categories.slice(1);
  const leftCategories = [categories[0], ...[...categories.slice(2)].reverse()];

  return (
    <div className="overflow-auto p-4 w-full">
      <div className="inline-block min-w-max">
        {/* Top Headers Row */}
        <div className="flex">
          {/* Top-Left Empty Corner */}
          <div className="w-32 h-32"></div>
          {/* Top Headers */}
          <div className="flex">
            {topCategories.map((cat) => (
              <React.Fragment key={`top-header-${cat.id}`}>
                {renderTopHeader(cat)}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Rows */}
        {leftCategories.map((rowCat, rowIndex) => {
          const numCols = numCats - 1 - rowIndex;
          const rowTopCategories = topCategories.slice(0, numCols);

          return (
            <div key={`row-${rowCat.id}`} className="flex">
              {/* Left Header */}
              {renderLeftHeader(rowCat)}

              {/* SubGrids left aligned */}
              {rowTopCategories.map((colCat, colIndex) => {
                const isDark = (rowIndex + colIndex) % 2 === 1;
                return (
                  <SubGrid
                    key={`subgrid-${rowCat.id}-${colCat.id}`}
                    rowCategory={rowCat}
                    colCategory={colCat}
                    getCellState={getCellState}
                    toggleCell={toggleCell}
                    isDark={isDark}
                    isCellError={isCellError}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
