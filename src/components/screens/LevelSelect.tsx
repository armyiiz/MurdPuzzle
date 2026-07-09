import React from 'react';
import { ScreenState } from '../../types/level';

export function LevelSelect({ setScreen, setSelectedLevel, solvedCases }: { setScreen: (s: ScreenState) => void, setSelectedLevel: (l: number) => void, solvedCases: string[] }) {
  const levels = [
    {
      id: 1,
      name: "Level 1",
      title: "มือใหม่หัดสืบ",
      desc: "เบาะแสทุกอย่างเป็นจริง เหมาะสำหรับตั้งหลักกับตารางตรรกะ",
      reqCase: null,
      icon: "fa-magnifying-glass",
    },
    {
      id: 2,
      name: "Level 2",
      title: "นักสืบฝึกหัด",
      desc: "มีผู้ต้องสงสัยหนึ่งคนที่โกหกเสมอ ต้องอ่านคำให้การให้คมขึ้น",
      reqCase: "case_25",
      icon: "fa-user-secret",
    },
    {
      id: 3,
      name: "Level 3",
      title: "ยอดนักสืบ",
      desc: "เพิ่มแรงจูงใจและข้อมูลหลายชั้น ต้องเชื่อมหลักฐานเป็นระบบ",
      reqCase: "case_50",
      icon: "fa-fingerprint",
    },
    {
      id: 4,
      name: "Level 4",
      title: "ปรมาจารย์",
      desc: "รวมทุกกลไกและ Exhibit D สำหรับคดีที่ท้าทายที่สุด",
      reqCase: "case_75",
      icon: "fa-scale-balanced",
    },
  ];

  return (
    <div className="animate-fadeIn mx-auto max-w-6xl">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="murdle-paper-strip murdle-mono mb-3 inline-flex px-3 py-1 text-xs font-bold uppercase">
            Difficulty Board
          </div>
          <h2 className="murdle-section-title text-3xl">เลือกระดับความยาก</h2>
        </div>
        <div className="murdle-stat-chip self-start sm:self-auto">
          ปิดคดีแล้ว {solvedCases.length}/100
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {levels.map(l => {
          const isUnlocked = !l.reqCase || solvedCases.includes(l.reqCase);
          const levelStart = (l.id - 1) * 25 + 1;
          const levelEnd = l.id * 25;
          const solvedInLevel = solvedCases.filter(id => {
            const caseNum = parseInt(id.replace('case_', ''), 10);
            return caseNum >= levelStart && caseNum <= levelEnd;
          }).length;
          const levelProgress = Math.round((solvedInLevel / 25) * 100);

          return (
            <button
              key={l.id}
              onClick={() => { if (isUnlocked) { setSelectedLevel(l.id); setScreen('CASE_SELECT'); } }}
              disabled={!isUnlocked}
              className={`case-level-card min-h-56 p-5 text-left ${isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
            >
              {!isUnlocked && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-murdle-surface/60 backdrop-blur-[1px]">
                  <span className="murdle-stat-chip !min-h-10 gap-2 px-3 text-sm font-bold">
                    <i className="fa-solid fa-lock" aria-hidden="true"></i>
                    ล็อกอยู่
                  </span>
                </div>
              )}

              <div className={!isUnlocked ? "opacity-40" : ""}>
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="murdle-wordmark-mark !h-12 !w-12 text-xl">
                      <i className={`fa-solid ${l.icon}`} aria-hidden="true"></i>
                    </span>
                    <div>
                      <span className="murdle-paper-strip murdle-mono inline-flex px-2.5 py-0.5 text-[10px] font-bold uppercase">
                        {l.name}
                      </span>
                      <h3 className="mt-2 text-2xl font-black leading-tight text-black">{l.title}</h3>
                    </div>
                  </div>
                  <span className="murdle-stat-chip shrink-0 !min-h-10 !px-3 text-xs font-black">
                    {solvedInLevel}/25
                  </span>
                </div>

                <p className="mb-5 text-sm font-semibold leading-relaxed text-murdle-muted">{l.desc}</p>

                <div className="case-progress-track h-2">
                  <div className="case-progress-bar" style={{ width: `${levelProgress}%` }} />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
