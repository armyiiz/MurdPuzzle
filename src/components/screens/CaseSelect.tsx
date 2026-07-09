import React from 'react';
import { LevelData, ScreenState } from '../../types/level';
import { allCases } from '../../data/allCases';

export function CaseSelect({ level, setScreen, setSelectedCase, solvedCases }: { level: number, setScreen: (s: ScreenState) => void, setSelectedCase: (c: LevelData) => void, solvedCases: string[] }) {
  const cases = allCases[level as keyof typeof allCases] || [];
  const solvedInLevel = cases.filter((c: LevelData) => solvedCases.includes(c.id)).length;
  const progressPercent = cases.length ? Math.round((solvedInLevel / cases.length) * 100) : 0;

  return (
    <div className="animate-fadeIn mx-auto max-w-6xl">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="murdle-paper-strip murdle-mono mb-3 inline-flex px-3 py-1 text-xs font-bold uppercase">
            Case Archive
          </div>
          <h2 className="murdle-section-title text-3xl">รายการคดีระดับ {level}</h2>
        </div>
        <div className="min-w-56">
          <div className="murdle-stat-chip mb-2 justify-between gap-3 px-3 text-sm font-bold">
            <span>ปิดแล้ว</span>
            <span>{solvedInLevel}/{cases.length}</span>
          </div>
          <div className="case-progress-track h-2">
            <div className="case-progress-bar" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>

      <div className="murdle-case-grid">
        {cases.map((c: LevelData) => {
          const isSolved = solvedCases.includes(c.id);
          const caseNum = parseInt(c.id.replace('case_', ''), 10);
          const isUnlocked = caseNum === 1 || solvedCases.includes('case_' + String(caseNum - 1).padStart(2, '0'));

          return (
            <button
              key={c.id}
              onClick={() => { if (isUnlocked) { setSelectedCase(c); setScreen('GAME'); } }}
              disabled={!isUnlocked}
              className={`case-file-card flex min-h-40 flex-col justify-between p-4 text-left ${
                !isUnlocked
                  ? 'cursor-not-allowed opacity-60'
                  : isSolved
                    ? 'bg-murdle-success cursor-pointer'
                    : 'cursor-pointer'
              }`}
            >
              <div className={!isUnlocked ? "opacity-40" : ""}>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="murdle-paper-strip murdle-mono px-2.5 py-0.5 text-[10px] font-bold uppercase text-black">
                    {c.id}
                  </span>
                  <span className={`murdle-stat-chip !min-h-8 !px-2 text-[10px] font-black ${
                    isSolved ? 'murdle-status-success' : !isUnlocked ? 'text-murdle-muted' : ''
                  }`}>
                    {!isUnlocked ? 'Locked' : isSolved ? 'Closed' : 'Open'}
                  </span>
                </div>

                <h3 className="text-lg font-black leading-tight text-black">{c.level_name}</h3>
              </div>

              <div className="mt-5 flex items-center justify-between gap-3 text-sm font-black text-black">
                <span>{!isUnlocked ? 'ล็อก' : isSolved ? 'ปิดคดี' : 'เปิดแฟ้ม'}</span>
                <i className={`fa-solid ${!isUnlocked ? 'fa-lock' : isSolved ? 'fa-check' : 'fa-arrow-right'}`} aria-hidden="true"></i>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
