import React from 'react';
import { LevelData, ScreenState } from '../../types/level';
import { allCases } from '../../data/allCases';

export function CaseSelect({ level, setScreen, setSelectedCase, solvedCases }: { level: number, setScreen: (s: ScreenState) => void, setSelectedCase: (c: LevelData) => void, solvedCases: string[] }) {
  const cases = allCases[level as keyof typeof allCases] || [];
  const solvedInLevel = cases.filter((c: LevelData) => solvedCases.includes(c.id)).length;

  return (
    <div className="animate-fadeIn mx-auto max-w-6xl">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="murdle-paper-strip murdle-mono mb-3 inline-flex px-3 py-1 text-xs font-bold uppercase tracking-widest">
            Case Archive
          </div>
          <h2 className="murdle-section-title flex items-center gap-2 text-3xl">📂 รายการคดีระดับ {level}</h2>
        </div>
        <div className="murdle-stat-chip self-start sm:self-auto">
          ปิดแล้ว {solvedInLevel}/{cases.length}
        </div>
      </div>

      <div className="murdle-case-grid">
        {cases.map((c: LevelData) => {
          const isSolved = solvedCases.includes(c.id);

          const caseNum = parseInt(c.id.replace('case_', ''), 10);
          const isUnlocked = caseNum === 1 || solvedCases.includes('case_' + String(caseNum - 1).padStart(2, '0'));

          return (
            <button key={c.id}
              onClick={() => { if (isUnlocked) { setSelectedCase(c); setScreen('GAME'); } }}
              disabled={!isUnlocked}
              className={`murdle-card-compact murdle-case-tile relative text-left flex flex-col justify-between h-full min-h-40 transition
                ${!isUnlocked
                  ? 'opacity-60 !bg-murdle-surface text-murdle-muted cursor-not-allowed'
                  : isSolved
                    ? '!bg-murdle-success cursor-pointer'
                    : 'cursor-pointer'}`}>

              {!isUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <span className="text-6xl drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">🔒</span>
                </div>
              )}

              <div className={!isUnlocked ? "opacity-30" : ""}>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="murdle-paper-strip murdle-mono px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black">
                    {c.id}
                  </span>
                  {isSolved && <span className="text-xl">✅</span>}
                </div>
                <h3 className="font-bold text-lg leading-tight text-black">{c.level_name}</h3>
              </div>
              <div className="mt-4 text-black font-bold self-end flex items-center gap-1">
                {!isUnlocked ? 'ล็อก' : isSolved ? 'ปิดคดี' : 'เปิดแฟ้ม'}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
