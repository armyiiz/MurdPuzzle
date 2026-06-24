import React from 'react';
import { ScreenState } from '../../types/level';

export function MainMenu({ setScreen, solvedCases }: { setScreen: (s: ScreenState) => void, solvedCases: string[] }) {
  const closedCases = solvedCases.length;
  const progressPercent = Math.min(100, Math.round((closedCases / 100) * 100));

  return (
    <div className="animate-fadeIn mx-auto flex max-w-5xl flex-col gap-6">
      <section className="murdle-case-hero px-5 py-7 sm:px-8 sm:py-9">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="murdle-paper-strip murdle-mono mb-4 inline-flex px-3 py-1 text-xs font-bold uppercase tracking-widest">
              MurdPuzzle Case Desk
            </div>
            <h1 className="murdle-display text-balance">🕵️‍♂️ ไขคดีปริศนา</h1>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:min-w-80">
            <div className="murdle-stat-chip flex-col">
              <span className="text-[10px] text-murdle-muted">Closed</span>
              <span className="text-lg">{closedCases}/100</span>
            </div>
            <div className="murdle-stat-chip flex-col">
              <span className="text-[10px] text-murdle-muted">Progress</span>
              <span className="text-lg">{progressPercent}%</span>
            </div>
            <div className="murdle-stat-chip flex-col">
              <span className="text-[10px] text-murdle-muted">Mode</span>
              <span className="text-lg">Logic</span>
            </div>
          </div>
        </div>

        <div className="mt-7 h-4 border-[3px] border-black bg-white">
          <div className="h-full bg-murdle-accent transition-[width] duration-300" style={{ width: `${progressPercent}%` }} />
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <button onClick={() => setScreen('LEVEL_SELECT')} className="murdle-button-primary min-h-16 text-xl">
          เริ่มไขคดี
        </button>
        <button onClick={() => setScreen('HOW_TO_PLAY')} className="murdle-button-secondary min-h-16 text-lg">
          วิธีการเล่น
        </button>
        <button onClick={() => setScreen('SETTINGS')} className="murdle-button-secondary min-h-16 text-lg">
          ⚙️ ตั้งค่า
        </button>
      </section>
    </div>
  );
}
