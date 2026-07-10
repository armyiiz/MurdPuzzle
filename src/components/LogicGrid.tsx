import React, { memo, useEffect, useMemo, useState } from 'react';
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
  if (state === 'O') return <i aria-hidden="true" className="logic-grid-mark logic-grid-state-mark fa-solid fa-circle-check" />;
  if (state === 'X') return <i aria-hidden="true" className="logic-grid-mark logic-grid-state-mark fa-solid fa-circle-xmark" />;
  if (state === '?') return <i aria-hidden="true" className="logic-grid-mark logic-grid-note-mark fa-solid fa-circle-question" />;
  if (state === 'A') return <i aria-hidden="true" className="logic-grid-mark logic-grid-note-mark fa-solid fa-ban" />;
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
  onToggle,
  onSelect,
  cellStyle,
}: GridCellButtonProps) {
  return (
    <td
      style={cellStyle}
      className={`logic-grid-play-cell ${getStateClass(state)} ${isError ? 'logic-grid-cell-error' : ''} ${isLane && !isSelected ? 'logic-grid-cell-lane' : ''} ${isSelected ? 'logic-grid-cell-selected' : ''} ${state !== 'empty' ? 'logic-grid-marked-cell' : ''}`}
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

function useCompactGrid() {
  const [isCompact, setIsCompact] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
  ));

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const update = () => setIsCompact(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return isCompact;
}

export function LogicGrid({ categories, getCellState, toggleCell, isCellError, seedString }: LogicGridProps) {
  const isCompact = useCompactGrid();
  const [selectedCell, setSelectedCell] = useState<SelectedGridCell | null>(null);
  const [rowCategoryId, setRowCategoryId] = useState(categories[0]?.id ?? '');
  const [columnCategoryId, setColumnCategoryId] = useState(categories[1]?.id ?? '');

  const rowCategory = categories.find(category => category.id === rowCategoryId) ?? categories[0];
  const columnCategory = categories.find(category => category.id === columnCategoryId)
    ?? categories.find(category => category.id !== rowCategory?.id)
    ?? categories[1];

  const selectRowCategory = (categoryId: string) => {
    setRowCategoryId(categoryId);
    if (categoryId === columnCategoryId) {
      const replacement = categories.find(category => category.id !== categoryId);
      if (replacement) setColumnCategoryId(replacement.id);
    }
    setSelectedCell(null);
  };

  const selectColumnCategory = (categoryId: string) => {
    setColumnCategoryId(categoryId);
    if (categoryId === rowCategoryId) {
      const replacement = categories.find(category => category.id !== categoryId);
      if (replacement) setRowCategoryId(replacement.id);
    }
    setSelectedCell(null);
  };

  if (categories.length < 3 || !rowCategory || !columnCategory) return null;

  if (isCompact) {
    return (
      <section className="logic-grid-mobile" aria-label="สมุดตารางตรรกะ">
        <div className="logic-grid-pair-picker">
          <label>
            <span>แถว</span>
            <select value={rowCategory.id} onChange={event => selectRowCategory(event.target.value)}>
              {categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
          </label>
          <i className="fa-solid fa-xmark" aria-hidden="true" />
          <label>
            <span>คอลัมน์</span>
            <select value={columnCategory.id} onChange={event => selectColumnCategory(event.target.value)}>
              {categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
          </label>
        </div>

        <p className="logic-grid-current-pair" aria-live="polite">
          <span>{rowCategory.name}</span>
          <i className="fa-solid fa-arrow-right-arrow-left" aria-hidden="true" />
          <span>{columnCategory.name}</span>
        </p>

        <div className="logic-grid-mobile-scroll">
          <table className="logic-grid-pair-table">
            <thead>
              <tr>
                <th className="logic-grid-pair-corner" aria-label={`${rowCategory.name} เทียบกับ ${columnCategory.name}`}>
                  <i className="fa-solid fa-table-cells" aria-hidden="true" />
                </th>
                {columnCategory.items.map((item, index) => (
                  <th key={item} scope="col" title={item}>
                    <i className={getIconClass(columnCategory.id, item)} style={{ color: getIconColor(index, seedString, columnCategory.id) }} aria-hidden="true" />
                    <span>{item}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rowCategory.items.map((rowItem, rowIndex) => (
                <tr key={rowItem}>
                  <th scope="row" title={rowItem}>
                    <i className={getIconClass(rowCategory.id, rowItem)} style={{ color: getIconColor(rowIndex, seedString, rowCategory.id) }} aria-hidden="true" />
                    <span>{rowItem}</span>
                  </th>
                  {columnCategory.items.map(colItem => {
                    const state = getCellState(rowCategory, columnCategory, rowItem, colItem);
                    const isSelected = Boolean(selectedCell && selectedCell.rowCatId === rowCategory.id && selectedCell.rowItem === rowItem && selectedCell.colCatId === columnCategory.id && selectedCell.colItem === colItem);
                    const isLane = Boolean(selectedCell && selectedCell.rowCatId === rowCategory.id && selectedCell.colCatId === columnCategory.id && (selectedCell.rowItem === rowItem || selectedCell.colItem === colItem));
                    return (
                      <GridCellButton
                        key={colItem}
                        rowCat={rowCategory}
                        colCat={columnCategory}
                        rowItem={rowItem}
                        colItem={colItem}
                        state={state}
                        isError={isCellError ? isCellError(rowCategory, columnCategory, rowItem, colItem) : false}
                        isLane={isLane}
                        isSelected={isSelected}
                        onToggle={toggleCell}
                        onSelect={setSelectedCell}
                      />
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedCell && (
          <p className="logic-grid-selection-readout">
            <i className="fa-solid fa-crosshairs" aria-hidden="true" />
            {selectedCell.rowItem} × {selectedCell.colItem}
          </p>
        )}
      </section>
    );
  }

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
                {rowTopCategories.flatMap(colCat => colCat.items.map(colItem => {
                  const state = getCellState(rowCat, colCat, rowItem, colItem);
                  const isSelected = Boolean(selectedCell && selectedCell.rowCatId === rowCat.id && selectedCell.rowItem === rowItem && selectedCell.colCatId === colCat.id && selectedCell.colItem === colItem);
                  const isLane = Boolean(selectedCell && selectedCell.rowCatId === rowCat.id && selectedCell.colCatId === colCat.id && (selectedCell.rowItem === rowItem || selectedCell.colItem === colItem));
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
                      onToggle={toggleCell}
                      onSelect={setSelectedCell}
                      cellStyle={cellStyle}
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
