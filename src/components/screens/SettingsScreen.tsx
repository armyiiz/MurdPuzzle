import React from 'react';
import { ScreenState } from '../../types/level';

export function SettingsScreen({ setScreen, setSolvedCases }: { setScreen: (s: ScreenState) => void, setSolvedCases: (c: string[]) => void }) {
  const handleResetAll = () => {
    if (window.confirm('คุณแน่ใจหรือไม่ที่จะรีเซ็ตคดีทั้งหมด? ข้อมูลการปลดล็อกจะหายไปทั้งหมด!')) {
      setSolvedCases([]);
      localStorage.removeItem('solvedCases');
      setScreen('MENU');
    }
  };

  const handleUnlockAll = () => {
    const password = window.prompt('กรุณากรอกรหัสผ่านเพื่อปลดล็อก:');
    if (password === 'UNLOCK') {
      const allIds = Array.from({ length: 100 }, (_, i) => 'case_' + String(i + 1).padStart(2, '0'));
      setSolvedCases(allIds);
      localStorage.setItem('solvedCases', JSON.stringify(allIds));
      window.alert('ปลดล็อกทุกด่านสำเร็จ!');
    }
  };

  return (
    <div className="animate-fadeIn max-w-xl mx-auto pb-24 px-4">
      <div className="murdle-card flex flex-col items-center">
        <h2 className="murdle-section-title mb-8 border-b-[4px] border-black pb-4 text-center w-full">
          ⚙️ ตั้งค่า
        </h2>

        <div className="flex flex-col space-y-6 w-full">
          <button
            onClick={handleResetAll}
            className="murdle-button-primary w-full text-lg"
          >
            🧹 รีเซ็ตข้อมูลการเล่นทั้งหมด
          </button>

          <button
            onClick={handleUnlockAll}
            className="murdle-button-secondary w-full text-lg"
          >
            🔓 (ADMIN) ปลดล็อกทุกด่าน
          </button>
        </div>

        <button
          onClick={() => setScreen('MENU')}
          className="mt-12 murdle-button-secondary text-lg px-8 w-full text-center"
        >
          ⬅️ กลับหน้าหลัก
        </button>
      </div>
    </div>
  );
}
