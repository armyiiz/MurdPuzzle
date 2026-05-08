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

const STATE_LABELS: Record<CellState, string> = {
  empty: 'ยังไม่ระบุ',
  O: 'ใช่',
  X: 'ไม่ใช่',
  '?': 'ไม่แน่ใจ',
  A: 'ตัดออกอัตโนมัติ',
};

export function LogicGrid({ categories, getCellState, toggleCell, isCellError, seedString }: LogicGridProps) {
  const numCats = categories.length;
  if (numCats < 3) return null;

  const topCategories = categories.slice(1);
  const leftCategories = [categories[0], ...[...categories.slice(2)].reverse()];

  const totalCols = 1 + topCategories.reduce((count, cat) => count + cat.items.length, 0);
  const totalRows = 1 + leftCategories.reduce((count, cat) => count + cat.items.length, 0);
  const fittedCellSize = `min(44px, calc((100vw - 1.25rem) / ${totalCols}), calc((100dvh - var(--app-header-height) - var(--grid-vertical-chrome, 13rem) - env(safe-area-inset-bottom)) / ${totalRows}))`;
  const cellStyle: React.CSSProperties = {
    boxSizing: 'border-box',
    width: fittedCellSize,
    height: fittedCellSize,
  };

  return (
    <div className="logic-grid-scroll w-full max-w-full overflow-hidden p-0 flex justify-center touch-pan-y" aria-label="ตารางตรรกะสำหรับตัดตัวเลือก">
      <table className="border-collapse table-fixed w-max mx-auto">
        <tbody>
          {/* Top Header Row */}
          <tr>
            <td style={cellStyle} className="p-1 text-[8px] sm:text-[9px] text-black font-bold tracking-[-0.08em] leading-none text-center border border-transparent align-middle">
              LOGIC GRID
            </td>
            {topCategories.map((cat) => (
              cat.items.map((item, itemIndex) => {
                const isFirstOfBlock = itemIndex === 0;
                return (
                  <td
                    key={`top-${cat.id}-${item}`}
                    style={cellStyle}
                    className={`border border-black bg-murdle-bg align-middle text-center p-0
                      border-t-[4px] ${isFirstOfBlock ? 'border-l-[4px]' : ''}
                    `}
                  >
                    <div className="flex items-center justify-center w-full h-full" title={`${cat.name}: ${item}`}>
                      <i aria-hidden="true" className={`${getIconClass(cat.id, item)} text-[clamp(0.75rem,4vw,1.5rem)] [text-shadow:2px_2px_0_#000] max-md:[text-shadow:none]`} style={{ color: getIconColor(itemIndex, seedString, cat.id) }}></i>
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
                    className={`border border-black bg-murdle-bg align-middle text-center p-0
                      border-l-[4px] ${isFirstOfRowBlock ? 'border-t-[4px]' : ''}
                    `}
                  >
                    <div className="flex items-center justify-center w-full h-full" title={`${rowCat.name}: ${rowItem}`}>
                      <i aria-hidden="true" className={`${getIconClass(rowCat.id, rowItem)} text-[clamp(0.75rem,4vw,1.5rem)] [text-shadow:2px_2px_0_#000] max-md:[text-shadow:none]`} style={{ color: getIconColor(rowItemIndex, seedString, rowCat.id) }}></i>
                    </div>
                  </td>

                  {/* Grid Cells */}
                  {rowTopCategories.map((colCat, colCatIndex) => {
                    const isDark = (rowCatIndex + colCatIndex) % 2 === 1;

                    return colCat.items.map((colItem, colItemIndex) => {
                      const state = getCellState(rowCat, colCat, rowItem, colItem);
                      const isError = isCellError ? isCellError(rowCat, colCat, rowItem, colItem) : false;
                      const isFirstColOfBlock = colItemIndex === 0;
                      const stateLabel = STATE_LABELS[state];

                      return (
                        <td
                          key={`cell-${rowCat.id}-${rowItem}-${colCat.id}-${colItem}`}
                          style={cellStyle}
                          className={`border border-black align-middle text-center p-0 select-none font-bold transition-colors
                            ${isFirstOfRowBlock ? 'border-t-[4px]' : ''}
                            ${isFirstColOfBlock ? 'border-l-[4px]' : ''}
                            ${isError ? 'bg-murdle-error' : isDark ? 'bg-murdle-paper' : 'bg-murdle-bg'}
                          `}
                        >
                          <button
                            type="button"
                            onClick={() => toggleCell(rowCat, colCat, rowItem, colItem)}
                            className="flex h-full w-full items-center justify-center font-bold transition-colors hover:bg-murdle-surface focus:outline-none focus:ring-2 focus:ring-murdle-accent focus:ring-inset"
                            aria-label={`${rowCat.name}: ${rowItem} กับ ${colCat.name}: ${colItem}, สถานะปัจจุบัน: ${stateLabel}. กดเพื่อเปลี่ยนสถานะ`}
                          >
                            {state === 'O' && <i aria-hidden="true" className="fa-solid fa-check text-black text-[clamp(0.75rem,4vw,1.25rem)]"></i>}
                            {state === 'X' && <i aria-hidden="true" className="fa-solid fa-xmark text-murdle-accent text-[clamp(0.75rem,4vw,1.25rem)]"></i>}
                            {state === '?' && <i aria-hidden="true" className="fa-solid fa-question text-murdle-muted text-[clamp(0.75rem,4vw,1.25rem)]"></i>}
                            {state === 'A' && <i aria-hidden="true" className="fa-solid fa-xmark text-murdle-purple text-[clamp(0.7rem,3.5vw,1.125rem)] opacity-80"></i>}
                          </button>
                        </td>
                      );
                    });
                  })}

                  {/* Empty space for triangular grid */}
                  {topCategories.slice(numCols).map((cat) => (
                    cat.items.map((item, idx) => (
                      <td
                        key={`empty-${rowCat.id}-${rowItem}-${cat.id}-${item}`}
                        style={cellStyle}
                        className={`border border-transparent p-0 ${idx === 0 ? 'border-l-[4px]' : ''}`}
                        aria-hidden="true"
                      ></td>
                    ))
                  ))}
                </tr>
              );
            });
          })}
        </tbody>
      </table>
    </div>
  );
}
