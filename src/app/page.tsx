"use client";

import React, { useState } from 'react';
import levelDataRaw from '../data/case01.json';
import { LevelData, Category } from '../types/level';
import { useGameLogic } from '../hooks/useGameLogic';
import { LogicGrid } from '../components/LogicGrid';

const levelData = levelDataRaw as LevelData;

export default function Home() {
  const {
    getCellState,
    toggleCell,
    validateSolution,
    getBlockId,
    getCellKey
  } = useGameLogic(levelData.categories, levelData.solution);

  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | null }>({ message: '', type: null });
  const [errorCells, setErrorCells] = useState<Set<string>>(new Set());

  const handleCheckAnswer = () => {
    const { isComplete, incorrectCells } = validateSolution();

    if (isComplete) {
      setFeedback({ message: "Victory! You've solved the case!", type: 'success' });
      setErrorCells(new Set());
    } else {
      setFeedback({ message: "Keep trying! Your logic has flaws or is incomplete.", type: 'error' });

      const newErrorCells = new Set<string>();
      incorrectCells.forEach(({ blockId, cellKey }) => {
        newErrorCells.add(`${blockId}:::${cellKey}`);
      });
      setErrorCells(newErrorCells);

      // Clear highlights after 2 seconds
      setTimeout(() => {
        setErrorCells(new Set());
        setFeedback({ message: '', type: null });
      }, 2000);
    }
  };

  const isCellError = (cat1: Category, cat2: Category, item1: string, item2: string) => {
    const blockId = getBlockId(cat1, cat2);
    const cellKey = getCellKey(item1, item2);
    return errorCells.has(`${blockId}:::${cellKey}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-24">
      <header className="bg-slate-800 text-white p-4 shadow-md sticky top-0 z-10 text-center">
        <h1 className="text-xl font-bold">{levelData.level_name}</h1>
      </header>

      <main className="max-w-6xl mx-auto mt-6">
        <section className="px-4 md:px-8 mb-6">
          <div className="bg-white p-4 rounded shadow-sm border-l-4 border-slate-800 italic">
            {levelData.story_intro}
          </div>
        </section>

        <section className="bg-white shadow-sm border-t border-b border-gray-200">
          <LogicGrid
            categories={levelData.categories}
            getCellState={getCellState}
            toggleCell={toggleCell}
            isCellError={isCellError}
          />
        </section>

        <section className="p-4 md:p-8 flex flex-col items-center">
          <button
            onClick={handleCheckAnswer}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-colors text-lg"
          >
            Check Answer
          </button>

          {feedback.type && (
            <div className={`mt-4 px-6 py-3 rounded-lg font-bold text-center animate-pulse ${feedback.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
              {feedback.message}
            </div>
          )}
        </section>

        <section className="p-4 md:p-8 pt-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Clues</h2>
            <ul className="space-y-3">
              {levelData.clues.map((clue, index) => (
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
