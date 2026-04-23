import React from 'react';
import { Category } from '../types/level';
import { CellState } from '../hooks/useGameLogic';
import { SubGrid } from './SubGrid';
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

  const renderTopHeader = (category: Category) => (
    <div className="flex border-l-4 border-t-4 border-slate-800">
      {category.items.map((item, index) => {
        return (
          <div key={item} className="w-10 h-10 flex items-center justify-center border border-gray-200 bg-slate-50">
            {getCategoryEmoji(category.id, index, item)}
          </div>
        );
      })}
    </div>
  );

  const renderLeftHeader = (category: Category) => (
    <div className="flex flex-col border-t-4 border-l-4 border-slate-800">
      {category.items.map((item, index) => {
        return (
          <div key={item} className="h-10 w-10 flex items-center justify-center border border-gray-200 bg-slate-50">
            {getCategoryEmoji(category.id, index, item)}
          </div>
        );
      })}
    </div>
  );

  const topCategories = categories.slice(1);
  const leftCategories = [categories[0], ...[...categories.slice(2)].reverse()];

  return (
    <div className="w-full max-w-3xl mx-auto overflow-x-auto pb-4">
      <div className="inline-block min-w-max p-4">
        {/* Top Headers Row */}
        <div className="flex">
          {/* Top-Left Empty Corner */}
          <div className="w-10 h-10 flex items-center justify-center p-1 text-[8px] text-slate-400 font-bold tracking-tighter leading-none text-center">
            LOGIC GRID
          </div>
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
                  <div key={`subgrid-wrap-${rowCat.id}-${colCat.id}`} className="border-t-4 border-l-4 border-slate-800">
                    <SubGrid
                      key={`subgrid-${rowCat.id}-${colCat.id}`}
                      rowCategory={rowCat}
                      colCategory={colCat}
                      getCellState={getCellState}
                      toggleCell={toggleCell}
                      isDark={isDark}
                      isCellError={isCellError}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
