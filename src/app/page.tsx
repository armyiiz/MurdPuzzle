"use client";

import React, { useState } from 'react';
import { MOCK_CATEGORIES, MOCK_CATEGORIES_4, MOCK_CLUES } from '../data/mockData';
import { useGameLogic } from '../hooks/useGameLogic';
import { LogicGrid } from '../components/LogicGrid';

export default function Home() {
  const [use4Cats, setUse4Cats] = useState(false);
  const categories = use4Cats ? MOCK_CATEGORIES_4 : MOCK_CATEGORIES;
  const { getCellState, toggleCell } = useGameLogic(categories);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="bg-slate-800 text-white p-4 shadow-md sticky top-0 z-10 flex justify-between items-center">
        <h1 className="text-xl font-bold">Logic Detective Puzzle</h1>
        <button
          onClick={() => setUse4Cats(!use4Cats)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          Toggle {use4Cats ? '3' : '4'} Categories
        </button>
      </header>

      <main className="max-w-6xl mx-auto pb-12">
        <section className="bg-white shadow-sm border-b border-gray-200">
          <LogicGrid
            key={use4Cats ? '4cat' : '3cat'} // force remount to clear state
            categories={categories}
            getCellState={getCellState}
            toggleCell={toggleCell}
          />
        </section>

        <section className="p-4 md:p-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Clues</h2>
            <ul className="space-y-3">
              {MOCK_CLUES.map((clue, index) => (
                <li key={index} className="flex gap-3 items-start">
                  <span className="font-bold text-slate-400 select-none">{index + 1}.</span>
                  <span className="text-lg">{clue}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
