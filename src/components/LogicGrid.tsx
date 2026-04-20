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
        <div key={item} className="w-10 h-32 flex items-end justify-center pb-2 border border-gray-200 overflow-hidden">
          <div className="-rotate-90 whitespace-nowrap text-sm">{item}</div>
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

  return (
    <div className="overflow-auto p-4 w-full">
      <div className="inline-block min-w-max">
        {/* Top Headers Row */}
        <div className="flex">
          {/* Top-Left Empty Corner */}
          <div className="w-32 h-32"></div>
          {/* Top Headers for colCategories (cats 1 to N-1) */}
          <div className="flex">
            {categories.slice(1).map((cat) => (
              <React.Fragment key={`top-header-${cat.id}`}>
                {renderTopHeader(cat)}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Rows for rowCategories (cats 0 to N-2) */}
        {categories.slice(0, numCats - 1).map((rowCat, rowIndex) => {
          // How many spaces (empty subgrids) to prepend
          const emptySpaces = rowIndex;

          return (
            <div key={`row-${rowCat.id}`} className="flex">
              {/* Left Header */}
              {renderLeftHeader(rowCat)}

              {/* Prepend empty spacers to create the staircase effect */}
              {Array.from({ length: emptySpaces }).map((_, i) => (
                <div key={`spacer-${rowIndex}-${i}`} className="flex flex-col border-2 border-transparent">
                  {rowCat.items.map(rItem => (
                     <div key={`spacer-r-${rItem}`} className="flex">
                       {categories[1 + i].items.map(cItem => (
                         <div key={`spacer-c-${cItem}`} className="w-10 h-10 border border-transparent"></div>
                       ))}
                     </div>
                  ))}
                </div>
              ))}

              {/* SubGrids */}
              {categories.slice(1 + rowIndex).map((colCat, colIndexOffset) => {
                const isDark = (rowIndex + colIndexOffset) % 2 === 1;
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
