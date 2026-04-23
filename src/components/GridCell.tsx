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
      className={`w-10 h-10 flex items-center justify-center cursor-pointer select-none text-xl font-bold transition-colors
        ${isError ? 'bg-red-400' : state === 'O' ? 'bg-green-200' : isDark ? 'bg-neo-notebook' : 'bg-white'}
        hover:bg-yellow-100
      `}
      onClick={onClick}
    >
      {state === 'O' && <span className="text-black">✅</span>}
      {state === 'X' && <span className="text-black font-black">✖️</span>}
    </div>
  );
}
