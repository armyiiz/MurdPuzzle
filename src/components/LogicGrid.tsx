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

function getStateClass(state: CellState) {
  if (state === 'O') return 'logic-grid-cell-yes';
  if (state === 'X') return 'logic-grid-cell-no';
  if (state === '?') return 'logic-grid-cell-maybe';
  if (state === 'A') return 'logic-grid-cell-auto';
  return '';
}

export function LogicGrid({ categories, getCellState, toggleCell, isCellError, seedString }: LogicGridProps) {
  const [selectedCell, setSelectedCell] = useState<SelectedGridCell | null>(null);
  const numCats = categories.length;
  if (numCats < 3) return null;

  const topCategories = categories.slice(1);
  const leftCategories = [categories[0], ...[...categories.slice(2)].reverse()];

  const totalCols = 1 + topCategories.reduce((count, cat) => count + cat.items.length, 0);
  const totalRows = 1 + leftCategories.reduce((count, cat) => count + cat.items.length, 0);
  const isCompactGrid = totalCols > 10 || totalRows > 10;
  const isDenseGrid = totalCols > 12 || totalRows > 12;
  const cellGapRem = isDenseGrid ? 0.1 : isCompactGrid ? 0.14 : 0.18;
  const colGapRem = Math.max(0, totalCols - 1) * cellGapRem;
  const rowGapRem = Math.max(0, totalRows - 1) * cellGapRem;
  const maxCellSize = isDenseGrid ? '2.45rem' : isCompactGrid ? '2.95rem' : '3.35rem';
  const fittedCellSize = `min(${maxCellSize}, calc((100vw - 1.25rem - ${colGapRem.toFixed(2)}rem) / ${totalCols}), calc((100dvh - var(--app-header-height) - var(--grid-vertical-chrome, 13rem) - env(safe-area-inset-bottom) - ${rowGapRem.toFixed(2)}rem) / ${totalRows}))`;
  const cellStyle: React.CSSProperties = {
    boxSizing: 'border-box',
    width: fittedCellSize,
    height: fittedCellSize,
  };
  const tableStyle = {
    '--logic-cell-size': fittedCellSize,
    '--logic-cell-gap': `${cellGapRem}rem`,
  } as React.CSSProperties;

  return (
    <div className="logic-grid-scroll w-full max-w-full overflow-hidden p-2" aria-label="ตารางตรรกะสำหรับตัดตัวเลือก">
      <table style={tableStyle} className={`logic-grid-table table-fixed w-max mx-auto ${isCompactGrid ? 'logic-grid-compact' : ''}`}>
        <tbody>
          <tr>
            <td style={cellStyle} className="logic-grid-corner-cell align-middle text-center">
              <i className="fa-solid fa-grip" aria-hidden="true"></i>
            </td>
            {topCategories.map((cat) => (
              cat.items.map((item, itemIndex) => {
                const isFirstOfBlock = itemIndex === 0;
                return (
                  <td
                    key={`top-${cat.id}-${item}`}
                    style={cellStyle}
                    className={`logic-grid-header-cell align-middle text-center ${isFirstOfBlock ? 'logic-grid-block-left' : ''}`}
                  >
                    <div className="logic-grid-icon-wrap" title={`${cat.name}: ${item}`}>
                      <i aria-hidden="true" className={`${getIconClass(cat.id, item)} logic-grid-icon`} style={{ color: getIconColor(itemIndex, seedString, cat.id) }}></i>
                    </div>
                  </td>
                );
              })
            ))}
          </tr>

          {leftCategories.map((rowCat, rowCatIndex) => {
            const numCols = numCats - 1 - rowCatIndex;
            const rowTopCategories = topCategories.slice(0, numCols);

            return rowCat.items.map((rowItem, rowItemIndex) => {
              const isFirstOfRowBlock = rowItemIndex === 0;

              return (
                <tr key={`row-${rowCat.id}-${rowItem}`}>
                  <td
                    style={cellStyle}
                    className={`logic-grid-header-cell logic-grid-row-header align-middle text-center ${isFirstOfRowBlock ? 'logic-grid-block-top' : ''}`}
                  >
                    <div className="logic-grid-icon-wrap" title={`${rowCat.name}: ${rowItem}`}>
                      <i aria-hidden="true" className={`${getIconClass(rowCat.id, rowItem)} logic-grid-icon`} style={{ color: getIconColor(rowItemIndex, seedString, rowCat.id) }}></i>
                    </div>
                  </td>

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
                      const isLane = Boolean(selectedCell &&
                        selectedCell.rowCatId === rowCat.id &&
                        selectedCell.colCatId === colCat.id &&
                        (selectedCell.rowItem === rowItem || selectedCell.colItem === colItem)
                      );

                      return (
                        <td
                          key={`cell-${rowCat.id}-${rowItem}-${colCat.id}-${colItem}`}
                          style={cellStyle}
                          className={`logic-grid-play-cell align-middle text-center select-none ${getStateClass(state)}
                            ${isFirstOfRowBlock ? 'logic-grid-block-top' : ''}
                            ${isFirstColOfBlock ? 'logic-grid-block-left' : ''}
                            ${isError ? 'logic-grid-cell-error' : isDark ? 'logic-grid-cell-alt' : ''}
                            ${isLane && !isSelected ? 'logic-grid-cell-lane' : ''}
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
                            className="logic-grid-cell-button"
                            aria-label={`${rowCat.name}: ${rowItem} กับ ${colCat.name}: ${colItem}, สถานะปัจจุบัน: ${stateLabel}. กดเพื่อเปลี่ยนสถานะ`}
                          >
                            {state === 'O' && <i aria-hidden="true" className="logic-grid-mark logic-grid-state-mark fa-solid fa-circle-check"></i>}
                            {state === 'X' && <i aria-hidden="true" className="logic-grid-mark logic-grid-state-mark fa-solid fa-circle-xmark"></i>}
                            {state === '?' && <i aria-hidden="true" className="logic-grid-mark logic-grid-note-mark fa-solid fa-circle-question"></i>}
                            {state === 'A' && <i aria-hidden="true" className="logic-grid-mark logic-grid-note-mark fa-solid fa-ban"></i>}
                          </button>
                        </td>
                      );
                    });
                  })}

                  {topCategories.slice(numCols).map((cat) => (
                    cat.items.map((item, idx) => (
                      <td
                        key={`empty-${rowCat.id}-${rowItem}-${cat.id}-${item}`}
                        style={cellStyle}
                        className={`logic-grid-empty-cell ${idx === 0 ? 'logic-grid-block-left' : ''}`}
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
