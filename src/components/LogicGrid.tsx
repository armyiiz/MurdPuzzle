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

  const shadowColors = [
    'drop-shadow-[0_0_0_rgba(255,102,204,0.8)]', // Pink
    'drop-shadow-[0_0_0_rgba(102,204,255,0.8)]', // Blue
    'drop-shadow-[0_0_0_rgba(102,255,153,0.8)]', // Green
    'drop-shadow-[0_0_0_rgba(255,204,102,0.8)]', // Yellow
  ];

  const getEmojiTint = (category: Category, index: number) => {
    if (category.id === 'suspects') {
      return shadowColors[index % shadowColors.length];
    }
    return 'drop-shadow-[0_0_0_rgba(0,0,0,0.8)]';
  };

  const parseItemEmoji = (item: string) => {
    const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/u;
    const match = item.match(emojiRegex);
    if (match) {
      const emoji = match[0];
      const text = item.replace(emoji, '').trim();
      return { emoji, text };
    }
    return { emoji: null, text: item };
  };

  const renderTopHeader = (category: Category) => (
    <div className="flex border-l-4 border-t-4 border-slate-800">
      {category.items.map((item, index) => {
        const { emoji, text } = parseItemEmoji(item);
        return (
          <div key={item} className="w-10 h-32 flex items-center justify-center border border-gray-200 overflow-hidden bg-slate-50">
            <span
              className="text-xs tracking-widest whitespace-nowrap flex items-center gap-1"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              <span className="font-bold text-slate-700">{text}</span>
              {emoji && <span className={`${getEmojiTint(category, index)} text-base`}>{emoji}</span>}
            </span>
          </div>
        );
      })}
    </div>
  );

  const renderLeftHeader = (category: Category) => (
    <div className="flex flex-col border-t-4 border-l-4 border-slate-800">
      {category.items.map((item, index) => {
        const { emoji, text } = parseItemEmoji(item);
        return (
          <div key={item} className="h-10 w-32 flex items-center justify-end pr-2 border border-gray-200 text-sm whitespace-nowrap overflow-hidden text-right bg-slate-50">
            <span className="font-bold text-slate-700 mr-2">{text}</span>
            {emoji && <span className={`${getEmojiTint(category, index)} text-base`}>{emoji}</span>}
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
          <div className="w-32 h-32 flex items-end justify-end p-2 text-xs text-slate-400 font-bold tracking-widest">
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
