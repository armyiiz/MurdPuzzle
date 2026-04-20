"use client";

import React, { useState, useEffect } from 'react';
import { LevelData, Category } from '../types/level';
import { useGameLogic } from '../hooks/useGameLogic';
import { useSuspectTracker } from '../hooks/useSuspectTracker';
import { LogicGrid } from '../components/LogicGrid';
import { allCases } from '../data/allCases';

type ScreenState = 'MENU' | 'LEVEL_SELECT' | 'CASE_SELECT' | 'GAME';

export default function Home() {
  const [screen, setScreen] = useState<ScreenState>('MENU');
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [selectedCaseIndex, setSelectedCaseIndex] = useState<number | null>(null);

  // Initialize with empty set, update in useEffect to avoid hydration errors
  const [solvedCases, setSolvedCases] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load solved cases from localStorage on mount
    const saved = localStorage.getItem('solvedCases');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
            // Need to set timeout so it's not synchronous
            setTimeout(() => {
                setSolvedCases(new Set(parsed));
            }, 0);
        }
      } catch (e) {
        console.error('Failed to parse solved cases', e);
      }
    }
    setTimeout(() => {
        setIsLoaded(true);
    }, 0);
  }, []);

  const markCaseAsSolved = (level: number, caseIndex: number) => {
    const caseId = `${level}_${caseIndex}`;
    setSolvedCases((prev) => {
      const newSet = new Set(prev);
      newSet.add(caseId);
      localStorage.setItem('solvedCases', JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  };

  const isCaseSolved = (level: number, caseIndex: number) => {
    return solvedCases.has(`${level}_${caseIndex}`);
  };

  // ----- Screens -----

  if (screen === 'MENU') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-8 text-slate-800">Logic Detective Puzzle</h1>
        <button
          onClick={() => setScreen('LEVEL_SELECT')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-lg shadow-md transition-colors text-2xl"
        >
          เริ่มเล่น
        </button>
      </div>
    );
  }

  if (screen === 'LEVEL_SELECT') {
    const levelCards = [
      { level: 1, title: 'ระดับ 1: มือใหม่หัดสืบ' },
      { level: 2, title: 'ระดับ 2: นักสืบฝึกหัด' },
      { level: 3, title: 'ระดับ 3: ยอดนักสืบ' },
      { level: 4, title: 'ระดับ 4: ปรมาจารย์นักสืบ' },
    ];

    return (
      <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl flex justify-start mb-8">
          <button
            onClick={() => setScreen('MENU')}
            className="text-blue-600 font-bold hover:underline"
          >
            &larr; กลับเมนู
          </button>
        </div>
        <h2 className="text-3xl font-bold mb-8 text-slate-800">เลือกระดับความยาก</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {levelCards.map((card) => (
            <button
              key={card.level}
              onClick={() => {
                setSelectedLevel(card.level);
                setScreen('CASE_SELECT');
              }}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow border border-gray-200 text-left"
            >
              <h3 className="text-2xl font-semibold text-slate-800">{card.title}</h3>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (screen === 'CASE_SELECT' && selectedLevel !== null) {
    const cases = allCases[selectedLevel] || [];

    return (
      <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl flex justify-start mb-8">
          <button
            onClick={() => setScreen('LEVEL_SELECT')}
            className="text-blue-600 font-bold hover:underline"
          >
            &larr; กลับไปเลือกระดับ
          </button>
        </div>
        <h2 className="text-3xl font-bold mb-8 text-slate-800">เลือกคดี (ระดับ {selectedLevel})</h2>

        {cases.length === 0 ? (
          <p>ไม่มีคดีในระดับนี้</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
            {cases.map((c, idx) => {
              const solved = isCaseSolved(selectedLevel, idx);
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedCaseIndex(idx);
                    setScreen('GAME');
                  }}
                  className={`p-6 rounded-xl shadow hover:shadow-lg transition-shadow text-left flex flex-col justify-between h-full border ${
                    solved ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                  }`}
                >
                  <h3 className="text-lg font-bold text-slate-800 mb-2">{c.level_name}</h3>
                  {solved && isLoaded && (
                    <div className="text-green-600 flex items-center gap-2 mt-4 font-bold">
                      <span>✅</span> ไขคดีแล้ว
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  if (screen === 'GAME' && selectedLevel !== null && selectedCaseIndex !== null) {
    const levelData = allCases[selectedLevel][selectedCaseIndex];
    return (
      <GameScreen
        key={`${selectedLevel}_${selectedCaseIndex}`} // Force remount when case changes
        levelData={levelData}
        onBack={() => setScreen('CASE_SELECT')}
        onSolve={() => markCaseAsSolved(selectedLevel, selectedCaseIndex)}
      />
    );
  }

  return null;
}

function GameScreen({ levelData, onBack, onSolve }: { levelData: LevelData, onBack: () => void, onSolve: () => void }) {
  const {
    getCellState,
    toggleCell,
    validateSolution,
    getBlockId,
    getCellKey
  } = useGameLogic(levelData.categories, levelData.solution);

  const {
    toggleSuspectState,
    getSuspectState,
  } = useSuspectTracker();

  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | null }>({ message: '', type: null });
  const [errorCells, setErrorCells] = useState<Set<string>>(new Set());

  const handleCheckAnswer = () => {
    const { isComplete, incorrectCells } = validateSolution();

    if (isComplete) {
      setFeedback({ message: "ยินดีด้วย! คุณไขคดีสำเร็จแล้ว!", type: 'success' });
      setErrorCells(new Set());
      onSolve();
    } else {
      setFeedback({ message: "ลองใหม่อีกครั้ง! ตรรกะของคุณยังมีจุดผิดพลาดอยู่", type: 'error' });

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
      <header className="bg-slate-800 text-white p-4 shadow-md sticky top-0 z-10 flex items-center">
        <button onClick={onBack} className="text-slate-300 hover:text-white mr-4 font-bold">
          &larr; กลับ
        </button>
        <h1 className="text-xl font-bold flex-1 text-center pr-10">{levelData.level_name}</h1>
      </header>

      <main className="max-w-6xl mx-auto mt-6">
        <section className="px-4 md:px-8 mb-6">
          <div className="bg-white p-4 rounded shadow-sm border-l-4 border-slate-800 italic">
            {levelData.story_intro}
          </div>
        </section>

        <section className="bg-white shadow-sm border-t border-b border-gray-200 overflow-auto">
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
            ตรวจคำตอบ
          </button>

          {feedback.type && (
            <div className={`mt-4 px-6 py-3 rounded-lg font-bold text-center animate-pulse ${feedback.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
              {feedback.message}
            </div>
          )}
        </section>

        <section className="p-4 md:p-8 pt-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">เบาะแส</h2>
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

        {levelData.testimonies && levelData.testimonies.length > 0 && (
          <section className="p-4 md:p-8 pt-0">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">คำให้การ</h2>
              <ul className="space-y-4">
                {levelData.testimonies.map((testimony, index) => {
                  const state = getSuspectState(index);

                  let buttonClass = "bg-gray-200 text-gray-700";
                  if (state === 'พูดจริง') buttonClass = "bg-green-500 text-white";
                  if (state === 'โกหก') buttonClass = "bg-red-500 text-white";

                  return (
                    <li key={index} className="flex flex-col md:flex-row gap-3 items-start md:items-center">
                      <button
                        onClick={() => toggleSuspectState(index)}
                        className={`w-24 py-1 rounded font-bold transition-colors shrink-0 shadow-sm ${buttonClass}`}
                      >
                        [ {state} ]
                      </button>
                      <div className="text-lg flex flex-col">
                        <span className="font-bold text-slate-700">{testimony.suspect}:</span>
                        <span>&quot;{testimony.statement}&quot;</span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
