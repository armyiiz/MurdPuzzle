import React, { useState } from 'react';
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

type SelectedGridCell = {
  rowCatId: string;
  rowItem: string;
  colCatId: string;
  colItem: string;
};

export function LogicGrid({ categories, getCellState, toggleCell, isCellError, seedString }: LogicGridProps) {
  const [selectedCell, setSelectedCell] = useState<SelectedGridCell | null>(null);
  const numCats = categories.length;
  if (numCats < 3) return null;

  const topCategories = categories.slice(1);
  const leftCategories = [categories[0], ...[...categories.slice(2)].reverse()];

  const totalCols = 1 + topCategories.reduce((count, cat) => count + cat.items.length, 0);
  const totalRows = 1 + leftCategories.reduce((count, cat) => count + cat.items.length, 0);
  const isCompactGrid = totalCols > 10 || totalRows > 10;
  const fittedCellSize = `min(${isCompactGrid ? '42px' : '48px'}, calc((100vw - 1.25rem) / ${totalCols}), calc((100dvh - var(--app-header-height) - var(--grid-vertical-chrome, 13rem) - env(safe-area-inset-bottom)) / ${totalRows}))`;
  const cellStyle: React.CSSProperties = {
    boxSizing: 'border-box',
    width: fittedCellSize,
    height: fittedCellSize,
  };
  const tableStyle = {
    '--logic-cell-size': fittedCellSize,
    '--logic-grid-border': isCompactGrid ? '3px' : '4px',
    '--logic-block-border': isCompactGrid ? '3px' : '4px',
    '--logic-cell-inset': isCompactGrid ? '2px' : '3px',
  } as React.CSSProperties;
  const isSelectedItem = (cat: Category, item: string) => {
    return Boolean(selectedCell && (
      (selectedCell.rowCatId === cat.id && selectedCell.rowItem === item) ||
      (selectedCell.colCatId === cat.id && selectedCell.colItem === item)
    ));
  };

  return (
    <div className="logic-grid-scroll w-full max-w-full overflow-hidden p-0 flex justify-center touch-pan-y" aria-label="ตารางตรรกะสำหรับตัดตัวเลือก">
      <table style={tableStyle} className={`logic-grid-table border-collapse table-fixed w-max mx-auto ${isCompactGrid ? 'logic-grid-compact' : ''}`}>
        <tbody>
          {/* Top Header Row */}
          <tr>
            <td style={cellStyle} className="p-1 murdle-mono text-[8px] sm:text-[9px] text-black font-bold tracking-normal leading-none text-center border border-transparent align-middle">
              GRID
            </td>
            {topCategories.map((cat) => (
              cat.items.map((item, itemIndex) => {
                const isFirstOfBlock = itemIndex === 0;
                return (
                  <td
                    key={`top-${cat.id}-${item}`}
                    style={cellStyle}
                    className={`border border-black bg-murdle-paper align-middle text-center p-0
                      logic-grid-block-top ${isFirstOfBlock ? 'logic-grid-block-left' : ''}
                      ${isSelectedItem(cat, item) ? 'logic-grid-cell-selected' : ''}
                    `}
                  >
                    <div className="flex items-center justify-center w-full h-full" title={`${cat.name}: ${item}`}>
                      <i aria-hidden="true" className={`${getIconClass(cat.id, item)} logic-grid-icon [text-shadow:2px_2px_0_#000] max-md:[text-shadow:none]`} style={{ color: getIconColor(itemIndex, seedString, cat.id) }}></i>
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
                    className={`border border-black bg-murdle-paper align-middle text-center p-0
                      logic-grid-block-left ${isFirstOfRowBlock ? 'logic-grid-block-top' : ''}
                      ${isSelectedItem(rowCat, rowItem) ? 'logic-grid-cell-selected' : ''}
                    `}
                  >
                    <div className="flex items-center justify-center w-full h-full" title={`${rowCat.name}: ${rowItem}`}>
                      <i aria-hidden="true" className={`${getIconClass(rowCat.id, rowItem)} logic-grid-icon [text-shadow:2px_2px_0_#000] max-md:[text-shadow:none]`} style={{ color: getIconColor(rowItemIndex, seedString, rowCat.id) }}></i>
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
                      const isSelected = Boolean(selectedCell &&
                        selectedCell.rowCatId === rowCat.id &&
                        selectedCell.rowItem === rowItem &&
                        selectedCell.colCatId === colCat.id &&
                        selectedCell.colItem === colItem
                      );
                      const isLane = !isSelected && (isSelectedItem(rowCat, rowItem) || isSelectedItem(colCat, colItem));

                      return (
                        <td
                          key={`cell-${rowCat.id}-${rowItem}-${colCat.id}-${colItem}`}
                          style={cellStyle}
                          className={`logic-grid-play-cell border border-black align-middle text-center p-0 select-none font-bold transition-colors
                            ${isFirstOfRowBlock ? 'logic-grid-block-top' : ''}
                            ${isFirstColOfBlock ? 'logic-grid-block-left' : ''}
                            ${isError ? 'bg-murdle-error' : isDark ? 'bg-murdle-paper' : 'bg-murdle-bg'}
                            ${isLane ? 'logic-grid-cell-lane' : ''}
                            ${isSelected ? 'logic-grid-cell-selected' : ''}
                            ${state !== 'empty' ? 'logic-grid-marked-cell' : ''}
                          `}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCell({ rowCatId: rowCat.id, rowItem, colCatId: colCat.id, colItem });
                              toggleCell(rowCat, colCat, rowItem, colItem);
                            }}
                            aria-pressed={state !== 'empty'}
                            className={`flex h-full w-full items-center justify-center font-bold transition-all focus:outline-none focus:ring-2 focus:ring-murdle-accent focus:ring-inset ${state === 'O' || state === 'X' ? 'shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1)] bg-black/5' : 'hover:bg-murdle-surface'}`}
                            aria-label={`${rowCat.name}: ${rowItem} กับ ${colCat.name}: ${colItem}, สถานะปัจจุบัน: ${stateLabel}. กดเพื่อเปลี่ยนสถานะ`}
                          >
                            {state === 'O' && <i aria-hidden="true" className="logic-grid-mark logic-grid-state-mark fa-solid fa-check text-black [text-shadow:1px_1px_0_#fff]"></i>}
                            {state === 'X' && <i aria-hidden="true" className="logic-grid-mark logic-grid-state-mark fa-solid fa-xmark text-murdle-accent [text-shadow:1px_1px_0_#fff]"></i>}
                            {state === '?' && <i aria-hidden="true" className="logic-grid-mark logic-grid-note-mark fa-solid fa-question text-murdle-muted"></i>}
                            {state === 'A' && <i aria-hidden="true" className="logic-grid-mark logic-grid-note-mark fa-solid fa-xmark text-murdle-purple opacity-80"></i>}
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
                        className={`border border-transparent p-0 ${idx === 0 ? 'logic-grid-block-left' : ''}`}
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
