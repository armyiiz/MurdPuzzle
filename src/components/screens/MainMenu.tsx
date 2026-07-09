import React from 'react';
import { ScreenState } from '../../types/level';

export function MainMenu({ setScreen, solvedCases }: { setScreen: (s: ScreenState) => void, solvedCases: string[] }) {
  const closedCases = solvedCases.length;
  const progressPercent = Math.min(100, Math.round((closedCases / 100) * 100));
  const remainingCases = Math.max(0, 100 - closedCases);

  return (
    <div className="animate-fadeIn mx-auto flex max-w-6xl flex-col gap-4 sm:gap-5">
      <section className="murdle-case-hero px-5 py-6 sm:px-8 sm:py-8">
        <div className="case-hero-layout">
          <div className="relative z-10 max-w-2xl">
            <div className="murdle-paper-strip murdle-mono mb-4 inline-flex px-3 py-1 text-xs font-bold uppercase">
              MurdPuzzle Case Desk
            </div>
            <h1 className="murdle-display text-balance">ไขคดีปริศนา</h1>
            <p className="mt-4 max-w-xl text-base font-semibold leading-relaxed text-murdle-muted sm:text-lg">
              เปิดแฟ้มใหม่ ไล่หลักฐาน แล้วปิดคดีให้ครบทั้งชุด
            </p>

            <div className="mt-6 grid grid-cols-3 gap-2 sm:max-w-lg">
              <div className="murdle-stat-chip flex-col">
                <span className="text-[10px] text-murdle-muted">Closed</span>
                <span className="text-lg">{closedCases}/100</span>
              </div>
              <div className="murdle-stat-chip flex-col">
                <span className="text-[10px] text-murdle-muted">Progress</span>
                <span className="text-lg">{progressPercent}%</span>
              </div>
              <div className="murdle-stat-chip flex-col">
                <span className="text-[10px] text-murdle-muted">Left</span>
                <span className="text-lg">{remainingCases}</span>
              </div>
            </div>

            <div className="case-progress-track mt-5 h-3">
              <div className="case-progress-bar transition-[width] duration-300" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <div className="case-hero-art" aria-hidden="true">
            <span className="case-hero-pin"></span>
            <span className="case-hero-thread"></span>
            <span className="case-hero-note"></span>
            <span className="case-hero-photo"></span>
          </div>
        </div>
      </section>

      <section className="case-action-grid">
        <button onClick={() => setScreen('LEVEL_SELECT')} className="murdle-button-primary case-action-card min-h-16 text-xl">
          <i className="fa-solid fa-play" aria-hidden="true"></i>
          เริ่มไขคดี
        </button>
        <button onClick={() => setScreen('HOW_TO_PLAY')} className="murdle-button-secondary case-action-card min-h-16 text-lg">
          <i className="fa-solid fa-circle-question" aria-hidden="true"></i>
          วิธีการเล่น
        </button>
        <button onClick={() => setScreen('SETTINGS')} className="murdle-button-secondary case-action-card min-h-16 text-lg">
          <i className="fa-solid fa-gear" aria-hidden="true"></i>
          ตั้งค่า
        </button>
      </section>
    </div>
  );
}
