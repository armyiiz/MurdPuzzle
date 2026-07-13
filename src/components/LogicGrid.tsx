import React, { memo, useMemo, useState } from 'react';
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

function StateMark({ state }: { state: CellState }) {
  const iconClass = 'logic-grid-mark fa-sharp fa-solid fa-fw';

  if (state === 'O') return <i aria-hidden="true" className={`${iconClass} logic-grid-state-mark fa-check`} />;
  if (state === 'X') return <i aria-hidden="true" className={`${iconClass} logic-grid-state-mark fa-xmark`} />;
  if (state === '?') return <i aria-hidden="true" className={`${iconClass} logic-grid-note-mark fa-question`} />;
  if (state === 'A') return <i aria-hidden="true" className={`${iconClass} logic-grid-note-mark fa-ban`} />;
  return null;
}

type GridCellButtonProps = {
  rowCat: Category;
  colCat: Category;
  rowItem: string;
  colItem: string;
  state: CellState;
  isError: boolean;
  isLane: boolean;
  isSelected: boolean;
  isGroupOrigin: boolean;
  onToggle: LogicGridProps['toggleCell'];
  onSelect: React.Dispatch<React.SetStateAction<SelectedGridCell | null>>;
  cellStyle?: React.CSSProperties;
};

const GridCellButton = memo(function GridCellButton({
  rowCat,
  colCat,
  rowItem,
  colItem,
  state,
  isError,
  isLane,
  isSelected,
  isGroupOrigin,
  onToggle,
  onSelect,
  cellStyle,
}: GridCellButtonProps) {
  return (
    <td
      style={cellStyle}
      className={`logic-grid-play-cell ${isGroupOrigin ? 'logic-grid-group-frame' : ''} ${getStateClass(state)} ${isError ? 'logic-grid-cell-error' : ''} ${isLane && !isSelected ? 'logic-grid-cell-lane' : ''} ${isSelected ? 'logic-grid-cell-selected' : ''} ${state !== 'empty' ? 'logic-grid-marked-cell' : ''}`}
    >
      <button
        type="button"
        onClick={() => {
          onSelect({ rowCatId: rowCat.id, rowItem, colCatId: colCat.id, colItem });
          onToggle(rowCat, colCat, rowItem, colItem);
        }}
        aria-pressed={state !== 'empty'}
        className="logic-grid-cell-button"
        aria-label={`${rowCat.name}: ${rowItem} กับ ${colCat.name}: ${colItem}, สถานะปัจจุบัน: ${STATE_LABELS[state]}. กดเพื่อเปลี่ยนสถานะ`}
      >
        <StateMark state={state} />
      </button>
    </td>
  );
});

export function LogicGrid({ categories, getCellState, toggleCell, isCellError, seedString }: LogicGridProps) {
  const [selectedCell, setSelectedCell] = useState<SelectedGridCell | null>(null);
  if (categories.length < 3) return null;

  return (
    <DesktopLogicGrid
      categories={categories}
      getCellState={getCellState}
      toggleCell={toggleCell}
      isCellError={isCellError}
      seedString={seedString}
      selectedCell={selectedCell}
      setSelectedCell={setSelectedCell}
    />
  );
}

type DesktopLogicGridProps = LogicGridProps & {
  selectedCell: SelectedGridCell | null;
  setSelectedCell: React.Dispatch<React.SetStateAction<SelectedGridCell | null>>;
};

function DesktopLogicGrid({ categories, getCellState, toggleCell, isCellError, seedString, selectedCell, setSelectedCell }: DesktopLogicGridProps) {
  const numCats = categories.length;
  const topCategories = categories.slice(1);
  const leftCategories = useMemo(() => [categories[0], ...[...categories.slice(2)].reverse()], [categories]);
  const totalCols = 1 + topCategories.reduce((count, cat) => count + cat.items.length, 0);
  const totalRows = 1 + leftCategories.reduce((count, cat) => count + cat.items.length, 0);
  const isCompactGrid = totalCols > 10 || totalRows > 10;
  const isDenseGrid = totalCols > 12 || totalRows > 12;
  const cellGapRem = isDenseGrid ? 0.1 : isCompactGrid ? 0.14 : 0.18;
  const maxCellSize = isDenseGrid ? '3rem' : isCompactGrid ? '3.5rem' : '4rem';
  const fittedCellSize = `min(${maxCellSize}, calc((100vw - 3rem) / ${totalCols}), calc((100dvh - 12rem) / ${totalRows}))`;
  const cellStyle = useMemo<React.CSSProperties>(() => ({
    boxSizing: 'border-box',
    width: fittedCellSize,
    height: fittedCellSize,
  }), [fittedCellSize]);
  const tableStyle = useMemo(() => ({
    '--logic-cell-size': fittedCellSize,
    '--logic-cell-gap': `${cellGapRem}rem`,
  }) as React.CSSProperties, [cellGapRem, fittedCellSize]);
  const getGroupSpan = (itemCount: number) => {
    const cellSizes = Array.from({ length: itemCount }, () => fittedCellSize).join(' + ');
    const totalGap = Math.max(0, itemCount - 1) * cellGapRem;
    return `calc(${cellSizes} + ${totalGap}rem)`;
  };

  return (
    <div className="logic-grid-scroll" aria-label="ตารางตรรกะสำหรับตัดตัวเลือก">
      <table style={tableStyle} className={`logic-grid-table ${isCompactGrid ? 'logic-grid-compact' : ''}`}>
        <tbody>
          <tr>
            <td style={cellStyle} className="logic-grid-corner-cell"><i className="fa-solid fa-grip" aria-hidden="true" /></td>
            {topCategories.flatMap(cat => cat.items.map((item, itemIndex) => (
              <td key={`top-${cat.id}-${item}`} style={cellStyle} className="logic-grid-header-cell">
                <div className="logic-grid-icon-wrap" title={`${cat.name}: ${item}`}>
                  <i aria-hidden="true" className={`${getIconClass(cat.id, item)} logic-grid-icon`} style={{ color: getIconColor(itemIndex, seedString, cat.id) }} />
                </div>
              </td>
            )))}
          </tr>

          {leftCategories.flatMap((rowCat, rowCatIndex) => {
            const numCols = numCats - 1 - rowCatIndex;
            const rowTopCategories = topCategories.slice(0, numCols);
            return rowCat.items.map((rowItem, rowItemIndex) => (
              <tr key={`${rowCat.id}-${rowItem}`}>
                <td style={cellStyle} className="logic-grid-header-cell logic-grid-row-header">
                  <div className="logic-grid-icon-wrap" title={`${rowCat.name}: ${rowItem}`}>
                    <i aria-hidden="true" className={`${getIconClass(rowCat.id, rowItem)} logic-grid-icon`} style={{ color: getIconColor(rowItemIndex, seedString, rowCat.id) }} />
                  </div>
                </td>
                {rowTopCategories.flatMap(colCat => colCat.items.map((colItem, colItemIndex) => {
                  const state = getCellState(rowCat, colCat, rowItem, colItem);
                  const isSelected = Boolean(selectedCell && selectedCell.rowCatId === rowCat.id && selectedCell.rowItem === rowItem && selectedCell.colCatId === colCat.id && selectedCell.colItem === colItem);
                  const isLane = Boolean(selectedCell && selectedCell.rowCatId === rowCat.id && selectedCell.colCatId === colCat.id && (selectedCell.rowItem === rowItem || selectedCell.colItem === colItem));
                  const isGroupOrigin = rowItemIndex === 0 && colItemIndex === 0;
                  const groupCellStyle = isGroupOrigin ? ({
                    ...cellStyle,
                    '--logic-group-width': getGroupSpan(colCat.items.length),
                    '--logic-group-height': getGroupSpan(rowCat.items.length),
                  } as React.CSSProperties) : cellStyle;
                  return (
                    <GridCellButton
                      key={`${colCat.id}-${colItem}`}
                      rowCat={rowCat}
                      colCat={colCat}
                      rowItem={rowItem}
                      colItem={colItem}
                      state={state}
                      isError={isCellError ? isCellError(rowCat, colCat, rowItem, colItem) : false}
                      isLane={isLane}
                      isSelected={isSelected}
                      isGroupOrigin={isGroupOrigin}
                      onToggle={toggleCell}
                      onSelect={setSelectedCell}
                      cellStyle={groupCellStyle}
                    />
                  );
                }))}
                {topCategories.slice(numCols).flatMap(cat => cat.items.map(item => (
                  <td key={`empty-${rowCat.id}-${rowItem}-${cat.id}-${item}`} style={cellStyle} className="logic-grid-empty-cell" />
                )))}
              </tr>
            ));
          })}
        </tbody>
      </table>
    </div>
  );
}
