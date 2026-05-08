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
    <div className="animate-fadeIn">
      <h2 className="murdle-section-title mb-6 text-center">เลือกระดับความยาก</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {levels.map(l => {
          const isUnlocked = !l.reqCase || solvedCases.includes(l.reqCase);
          return (
            <button key={l.id}
              onClick={() => { if (isUnlocked) { setSelectedLevel(l.id); setScreen('CASE_SELECT'); } }}
              disabled={!isUnlocked}
              className={`murdle-card relative text-left flex flex-col justify-between min-h-44 transition ${isUnlocked ? 'hover:-translate-y-1 cursor-pointer' : 'opacity-60 !bg-murdle-surface text-murdle-muted cursor-not-allowed'}`}>

              {!isUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <span className="text-6xl drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">🔒</span>
                </div>
              )}

              <div className={!isUnlocked ? "opacity-30" : ""}>
                <h3 className="text-xl font-bold text-black mb-4">{l.name}</h3>
                <div className="murdle-card-compact !border-[2px] !p-3 !shadow-[2px_2px_0_#1DACD6]">
                  <p className="text-black text-sm font-bold">{l.desc}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
