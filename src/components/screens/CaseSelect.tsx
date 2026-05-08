import React from 'react';
import { LevelData, ScreenState } from '../../types/level';
import { allCases } from '../../data/allCases';

export function CaseSelect({ level, setScreen, setSelectedCase, solvedCases }: { level: number, setScreen: (s: ScreenState) => void, setSelectedCase: (c: LevelData) => void, solvedCases: string[] }) {
  const cases = allCases[level as keyof typeof allCases] || [];

  return (
    <div className="animate-fadeIn">
      <h2 className="murdle-section-title mb-6 flex items-center gap-2">📂 รายการคดีระดับ {level}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cases.map((c: LevelData) => {
          const isSolved = solvedCases.includes(c.id);

          const caseNum = parseInt(c.id.replace('case_', ''), 10);
          const isUnlocked = caseNum === 1 || solvedCases.includes('case_' + String(caseNum - 1).padStart(2, '0'));

          return (
            <button key={c.id}
              onClick={() => { if (isUnlocked) { setSelectedCase(c); setScreen('GAME'); } }}
              disabled={!isUnlocked}
              className={`murdle-card-compact relative text-left flex flex-col justify-between h-full min-h-36 transition
                ${!isUnlocked
                  ? 'opacity-60 !bg-murdle-surface text-murdle-muted cursor-not-allowed'
                  : isSolved
                    ? '!bg-murdle-success hover:-translate-y-1 cursor-pointer'
                    : 'hover:-translate-y-1 cursor-pointer'}`}>

              {!isUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <span className="text-6xl drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">🔒</span>
                </div>
              )}

              <div className={!isUnlocked ? "opacity-30" : ""}>
                <h3 className="font-bold text-lg leading-tight text-black">{c.level_name}</h3>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 border border-black text-black uppercase tracking-wider bg-white">หมายเลขคดี: {c.id}</span>
                </div>
              </div>
              {isSolved && <div className="mt-4 text-black font-bold self-end flex items-center gap-1">✅ ปิดคดี</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
