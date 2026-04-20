import { useState, useCallback } from 'react';
import { Category } from '../data/mockData';

export type CellState = 'empty' | 'O' | 'X';

// To uniquely identify a sub-grid block
export type BlockId = `${string}-${string}`;

// Structure to hold the state of the entire grid
// Outer key is BlockId, inner key is `${rowItem}-${colItem}`
export type GridState = Record<string, Record<string, CellState>>;

export function useGameLogic(categories: Category[]) {
  const [gridState, setGridState] = useState<GridState>({});

  // Helper to generate the unique ID for a block
  const getBlockId = (cat1: Category, cat2: Category): BlockId => {
    // Sort to ensure consistency (e.g., suspects-weapons is same as weapons-suspects)
    const sorted = [cat1.id, cat2.id].sort();
    return `${sorted[0]}-${sorted[1]}`;
  };

  const getCellKey = (item1: string, item2: string) => {
    const sorted = [item1, item2].sort();
    return `${sorted[0]}-${sorted[1]}`;
  };

  const toggleCell = useCallback((cat1: Category, cat2: Category, item1: string, item2: string) => {
    setGridState(prev => {
      const newState = { ...prev };
      const blockId = getBlockId(cat1, cat2);

      if (!newState[blockId]) {
        newState[blockId] = {};
      }

      const cellKey = getCellKey(item1, item2);
      const currentState = newState[blockId][cellKey] || 'empty';

      let nextState: CellState;
      if (currentState === 'empty') nextState = 'X';
      else if (currentState === 'X') nextState = 'O';
      else nextState = 'empty';

      newState[blockId] = { ...newState[blockId], [cellKey]: nextState };

      // Auto-fill logic when placing an 'O'
      if (nextState === 'O') {
        // Fill row and column with 'X'
        cat1.items.forEach(i1 => {
          if (i1 !== item1) {
            const rowCellKey = getCellKey(i1, item2);
            if (!newState[blockId][rowCellKey] || newState[blockId][rowCellKey] === 'empty') newState[blockId][rowCellKey] = 'X';
          }
        });

        cat2.items.forEach(i2 => {
          if (i2 !== item2) {
            const colCellKey = getCellKey(item1, i2);
            if (!newState[blockId][colCellKey] || newState[blockId][colCellKey] === 'empty') newState[blockId][colCellKey] = 'X';
          }
        });
      }

      return newState;
    });
  }, []);

  const getCellState = useCallback((cat1: Category, cat2: Category, item1: string, item2: string): CellState => {
    const blockId = getBlockId(cat1, cat2);
    if (!gridState[blockId]) return 'empty';

    const cellKey = getCellKey(item1, item2);
    return gridState[blockId][cellKey] || 'empty';
  }, [gridState]);

  return {
    gridState,
    toggleCell,
    getCellState,
    getBlockId
  };
}
