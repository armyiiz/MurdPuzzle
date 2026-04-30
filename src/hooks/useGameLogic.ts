import { useState, useCallback } from 'react';
import { Category } from '../types/level';

export type CellState = 'empty' | 'O' | 'X' | '?' | 'A';

// To uniquely identify a sub-grid block
export type BlockId = `${string}-${string}`;

// Structure to hold the state of the entire grid
// Outer key is BlockId, inner key is `${rowItem}-${colItem}`
export type GridState = Record<string, Record<string, CellState>>;

export function useGameLogic(categories: Category[], solution: Record<string, string>[]) {
  const [gridState, setGridState] = useState<GridState>({});
  const [gridHistory, setGridHistory] = useState<GridState[]>([]);

  // Helper to generate the unique ID for a block
  const getBlockId = (cat1: Category | string, cat2: Category | string): BlockId => {
    const id1 = typeof cat1 === 'string' ? cat1 : cat1.id;
    const id2 = typeof cat2 === 'string' ? cat2 : cat2.id;
    const sorted = [id1, id2].sort();
    return `${sorted[0]}-${sorted[1]}`;
  };

  const getCellKey = (item1: string, item2: string) => {
    const sorted = [item1, item2].sort();
    return `${sorted[0]}-${sorted[1]}`;
  };

  const calculateAutoCrosses = useCallback((state: GridState): GridState => {
    const newState = JSON.parse(JSON.stringify(state)) as GridState;

    // Step A: Strip away ALL current 'A' states on the entire board
    for (const block in newState) {
      for (const cell in newState[block]) {
        if (newState[block][cell] === 'A') {
          newState[block][cell] = 'empty';
        }
      }
    }

    // Step B: Loop through the board and process 'O's
    for (const blockId in newState) {
      for (const cellKey in newState[blockId]) {
        if (newState[blockId][cellKey] === 'O') {
          // Identify the two items from cellKey and two categories from blockId
          // However, we have blockId like "catId1-catId2" and cellKey like "item1-item2".
          // We need a way to reliably iterate the rows and columns for that subgrid.
          // Since we need to know the categories' items, we can find them from the `categories` array.

          const [id1, id2] = blockId.split('-');
          const cat1 = categories.find(c => String(c.id) === id1);
          const cat2 = categories.find(c => String(c.id) === id2);

          if (!cat1 || !cat2) continue;

          // Now find which item belongs to which category
          const [itemA, itemB] = cellKey.split('-');
          let item1 = '', item2 = '';

          if (cat1.items.includes(itemA) && cat2.items.includes(itemB)) {
            item1 = itemA;
            item2 = itemB;
          } else if (cat1.items.includes(itemB) && cat2.items.includes(itemA)) {
            item1 = itemB;
            item2 = itemA;
          } else {
            // Might happen if item names overlap but generally we can assume they match one of the permutations
            continue;
          }

          // Step C: Change any 'empty' cells in that subgrid's row and column to 'A'
          cat1.items.forEach(i1 => {
            if (i1 !== item1) {
              const rowCellKey = getCellKey(i1, item2);
              if (!newState[blockId][rowCellKey] || newState[blockId][rowCellKey] === 'empty') {
                newState[blockId][rowCellKey] = 'A';
              }
            }
          });

          cat2.items.forEach(i2 => {
            if (i2 !== item2) {
              const colCellKey = getCellKey(item1, i2);
              if (!newState[blockId][colCellKey] || newState[blockId][colCellKey] === 'empty') {
                newState[blockId][colCellKey] = 'A';
              }
            }
          });
        }
      }
    }

    return newState;
  }, [categories]);

  const toggleCell = useCallback((cat1: Category, cat2: Category, item1: string, item2: string) => {
    setGridState(prev => {
      // First, capture the previous state and save to history
      // Note: We use a separate effect/callback for history normally to avoid side effects in updater,
      // but since toggleCell is an action, we can capture prev here. A cleaner way in React is to
      // do setGridHistory outside the setGridState updater.
      // Let's refactor:

      let newState = JSON.parse(JSON.stringify(prev)) as GridState;
      const blockId = getBlockId(cat1, cat2);

      if (!newState[blockId]) {
        newState[blockId] = {};
      }

      const cellKey = getCellKey(item1, item2);
      let currentState = newState[blockId][cellKey] || 'empty';
      if (currentState === 'A') {
        currentState = 'empty';
      }

      let nextState: CellState;
      if (currentState === 'empty') nextState = 'X';
      else if (currentState === 'X') nextState = 'O';
      else if (currentState === 'O') nextState = '?';
      else nextState = 'empty';

      // Unique 'O' Rule: clear existing 'O's in the row and col
      if (nextState === 'O') {
        cat1.items.forEach(i1 => {
          if (i1 !== item1) {
            const rowCellKey = getCellKey(i1, item2);
            if (newState[blockId][rowCellKey] === 'O') {
              newState[blockId][rowCellKey] = 'empty';
            }
          }
        });
        cat2.items.forEach(i2 => {
          if (i2 !== item2) {
            const colCellKey = getCellKey(item1, i2);
            if (newState[blockId][colCellKey] === 'O') {
              newState[blockId][colCellKey] = 'empty';
            }
          }
        });
      }

      newState[blockId][cellKey] = nextState;

      // Recalculate auto crosses
      newState = calculateAutoCrosses(newState);

      return newState;
    });
    // Push the current state to history BEFORE we update it via setGridState
    setGridHistory(h => [...h, gridState]);
  }, [gridState, calculateAutoCrosses]);

  const undo = useCallback(() => {
    setGridHistory(prevHistory => {
      if (prevHistory.length === 0) return prevHistory;
      const newHistory = [...prevHistory];
      const previousState = newHistory.pop()!;
      setGridState(previousState);
      return newHistory;
    });
  }, []);

  const saveGridState = useCallback((testimonyStates: Record<number, number>, notes: string, levelId: string) => {
    const saveData = {
      gridState,
      testimonyStates,
      notes,
    };
    localStorage.setItem(`murdle_save_${levelId}`, JSON.stringify(saveData));
  }, [gridState]);

  const loadGridState = useCallback((levelId: string): { testimonyStates: Record<number, number>, notes: string } | null => {
    const saved = localStorage.getItem(`murdle_save_${levelId}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      const loadedGridState = parsed.gridState || {};

      // Calculate auto crosses immediately after loading a saved state
      // to act as a self-healing mechanism.
      const recalculatedState = calculateAutoCrosses(loadedGridState);

      setGridState(recalculatedState);
      setGridHistory([]);
      return {
        testimonyStates: parsed.testimonyStates || {},
        notes: parsed.notes || '',
      };
    }
    return null;
  }, [calculateAutoCrosses]);

  const getCellState = useCallback((cat1: Category, cat2: Category, item1: string, item2: string): CellState => {
    const blockId = getBlockId(cat1, cat2);
    if (!gridState[blockId]) return 'empty';

    const cellKey = getCellKey(item1, item2);
    return gridState[blockId][cellKey] || 'empty';
  }, [gridState]);

  const validateSolution = useCallback(() => {
    const validCells = new Set<string>();
    const requiredOs = categories.length * (categories.length - 1) / 2 * categories[0].items.length;

    // Precompute all valid O placements
    for (const sol of solution) {
      const keys = Object.keys(sol);
      for (let i = 0; i < keys.length; i++) {
        for (let j = i + 1; j < keys.length; j++) {
          const cat1 = keys[i];
          const cat2 = keys[j];
          const item1 = sol[cat1];
          const item2 = sol[cat2];

          const blockId = getBlockId(cat1, cat2);
          const cellKey = getCellKey(item1, item2);
          validCells.add(`${blockId}:::${cellKey}`);
        }
      }
    }

    const incorrectCells: { blockId: string, cellKey: string }[] = [];
    let placedOs = 0;

    // Check user's grid state
    for (const [blockId, cells] of Object.entries(gridState)) {
      for (const [cellKey, state] of Object.entries(cells)) {
        if (state === 'O') {
          placedOs++;
          if (!validCells.has(`${blockId}:::${cellKey}`)) {
            incorrectCells.push({ blockId, cellKey });
          }
        }
      }
    }

    const isComplete = placedOs === requiredOs && incorrectCells.length === 0;

    return {
      isComplete,
      incorrectCells
    };
  }, [gridState, solution, categories]);

  // ----------------------------------------------------
  // ฟังก์ชันใหม่สำหรับล้างตาราง (ที่อลิซเพิ่มเข้าไป)
  // ----------------------------------------------------
  const resetGrid = useCallback(() => {
    if (window.confirm('คุณต้องการล้างข้อมูลในตารางทั้งหมดใช่หรือไม่?')) {
      setGridHistory(h => [...h, gridState]);
      setGridState({});
    }
  }, [gridState]);

  return {
    gridState,
    toggleCell,
    getCellState,
    getBlockId,
    getCellKey,
    validateSolution,
    resetGrid,
    undo,
    saveGridState,
    loadGridState,
    canUndo: gridHistory.length > 0
  };
}
