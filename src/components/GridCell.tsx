import React from 'react';
import { CellState } from '../hooks/useGameLogic';

interface GridCellProps {
  state: CellState;
  onClick: () => void;
  isDark?: boolean;
  isError?: boolean;
}

export function GridCell({ state, onClick, isDark, isError }: GridCellProps) {
  return (
    <div
      className={`w-10 h-10 border border-black flex items-center justify-center cursor-pointer select-none text-xl font-bold transition-colors
        ${isError ? 'bg-red-400' : isDark ? 'bg-neo-notebook' : 'bg-white'}
        hover:bg-gray-200
      `}
      onClick={onClick}
    >
      {state === 'O' && <span className="text-green-600">O</span>}
      {state === 'X' && <span className="text-red-500">X</span>}
    </div>
  );
}
