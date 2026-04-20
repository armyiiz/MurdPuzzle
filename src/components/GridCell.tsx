import React from 'react';
import { Category } from '../data/mockData';
import { CellState } from '../hooks/useGameLogic';

interface GridCellProps {
  state: CellState;
  onClick: () => void;
  isDark?: boolean;
}

export function GridCell({ state, onClick, isDark }: GridCellProps) {
  return (
    <div
      className={`w-10 h-10 border border-gray-300 flex items-center justify-center cursor-pointer select-none text-xl font-bold transition-colors
        ${isDark ? 'bg-gray-100' : 'bg-white'}
        hover:bg-blue-50
      `}
      onClick={onClick}
    >
      {state === 'O' && <span className="text-green-600">O</span>}
      {state === 'X' && <span className="text-red-500">X</span>}
    </div>
  );
}
