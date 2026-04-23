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
    <div className="flex flex-col border-r-[2px] border-black pb-2">
      <div className="text-center font-bold text-xs uppercase tracking-widest border-b-[2px] border-black bg-neo-notebook text-black h-6 flex items-center justify-center">
        {category.id}
      </div>
      <div className="flex">
        {category.items.map((item, index) => {
          return (
            <div key={item} className="w-10 h-10 flex items-center justify-center border-r-[2px] border-b-[2px] border-black bg-white last:border-r-0">
              <span style={{ textShadow: "0 0 0 #000", color: "transparent" }}>
                {getCategoryEmoji(category.id, index, item)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderLeftHeader = (category: Category) => (
    <div className="flex border-b-[2px] border-black pr-2">
      <div
        className="font-bold text-xs uppercase tracking-widest border-r-[2px] border-black bg-neo-notebook text-black w-6 flex items-center justify-center"
        style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
      >
        {category.id}
      </div>
      <div className="flex flex-col">
        {category.items.map((item, index) => {
          return (
            <div key={item} className="h-10 w-10 flex items-center justify-center border-r-[2px] border-b-[2px] border-black bg-white last:border-b-0">
              <span style={{ textShadow: "0 0 0 #000", color: "transparent" }}>
                {getCategoryEmoji(category.id, index, item)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const topCategories = categories.slice(1);
  const leftCategories = [categories[0], ...[...categories.slice(2)].reverse()];

  return (
    <div className="w-full max-w-3xl mx-auto overflow-x-auto pb-4">
      <div className="inline-block min-w-max p-4">
        {/* Outer border for the entire grid area */}
        <div className="border-[2px] border-black flex flex-col bg-white">

          {/* Top Headers Row */}
          <div className="flex border-b-[2px] border-black">
            {/* Top-Left Empty Corner */}
            <div className="w-auto h-auto flex items-center justify-center p-2 text-[8px] text-black font-bold tracking-tighter leading-none text-center border-r-[2px] border-black" style={{ minWidth: "3rem" }}>
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
                    <div key={`subgrid-wrap-${rowCat.id}-${colCat.id}`} className="">
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
    </div>
  );
}
