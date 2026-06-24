import React from 'react';
import { ScreenState } from '../../types/level';

export function LevelSelect({ setScreen, setSelectedLevel, solvedCases }: { setScreen: (s: ScreenState) => void, setSelectedLevel: (l: number) => void, solvedCases: string[] }) {
  const levels = [
    { id: 1, name: "Level 1 (Cases 1-25) มือใหม่หัดสืบ", desc: "หา \"ใคร\", \"อย่างไร\" และ \"ที่ไหน\" เบาะแสทุกอย่างเป็นความจริง 100% ฝึกใช้ Deduction Grid ตัดตัวเลือกอย่างเป็นระบบ", reqCase: null },
    { id: 2, name: "Level 2 (Cases 26-50) นักสืบฝึกหัด", desc: "มี \"ผู้ต้องสงสัย 1 คนที่โกหกเสมอ\" วิเคราะห์คำให้การและทดสอบสมมติฐาน", reqCase: "case_25" },
    { id: 3, name: "Level 3 (Cases 51-75) ยอดนักสืบ", desc: "เพิ่มการหา \"แรงจูงใจ\" ข้อมูลซับซ้อนขึ้นและต้องคิดเชื่อมโยงหลายชั้น", reqCase: "case_50" },
    { id: 4, name: "Level 4 (Cases 76-100) ปรมาจารย์", desc: "รวมทุกกลไก (คนโกหก + แรงจูงใจ) พร้อม \"Exhibit D\" ข้อมูลย้อนแย้งสูงสุดระดับท้าทายขีดจำกัด", reqCase: "case_75" },
  ];

  return (
    <div className="animate-fadeIn mx-auto max-w-5xl">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="murdle-paper-strip murdle-mono mb-3 inline-flex px-3 py-1 text-xs font-bold uppercase tracking-widest">
            Difficulty Board
          </div>
          <h2 className="murdle-section-title text-3xl">เลือกระดับความยาก</h2>
        </div>
        <div className="murdle-stat-chip self-start sm:self-auto">
          ปิดคดีแล้ว {solvedCases.length}/100
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {levels.map(l => {
          const isUnlocked = !l.reqCase || solvedCases.includes(l.reqCase);
          const levelStart = (l.id - 1) * 25 + 1;
          const levelEnd = l.id * 25;
          const solvedInLevel = solvedCases.filter(id => {
            const caseNum = parseInt(id.replace('case_', ''), 10);
            return caseNum >= levelStart && caseNum <= levelEnd;
          }).length;

          return (
            <button key={l.id}
              onClick={() => { if (isUnlocked) { setSelectedLevel(l.id); setScreen('CASE_SELECT'); } }}
              disabled={!isUnlocked}
              className={`murdle-card murdle-case-tile relative min-h-52 text-left transition ${isUnlocked ? 'cursor-pointer' : 'opacity-60 !bg-murdle-surface text-murdle-muted cursor-not-allowed'}`}>

              {!isUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <span className="text-6xl drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">🔒</span>
                </div>
              )}

              <div className={`flex h-full flex-col gap-4 ${!isUnlocked ? "opacity-30" : ""}`}>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-bold leading-tight text-black">{l.name}</h3>
                  <span className="murdle-stat-chip shrink-0 !min-h-9 !px-2 !py-1 text-[10px]">
                    {solvedInLevel}/25
                  </span>
                </div>
                <p className="text-sm font-bold leading-relaxed text-black">{l.desc}</p>
                <div className="mt-auto h-3 border-2 border-black bg-white">
                  <div className="h-full bg-murdle-accent" style={{ width: `${Math.round((solvedInLevel / 25) * 100)}%` }} />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
