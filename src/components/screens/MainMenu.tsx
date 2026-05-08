import React from 'react';
import { ScreenState } from '../../types/level';

export function MainMenu({ setScreen }: { setScreen: (s: ScreenState) => void }) {
  return (
    <div className="murdle-card flex flex-col items-center justify-center mt-12 sm:mt-16 space-y-6 text-center max-w-3xl mx-auto">
      <h1 className="murdle-display mb-4 text-center">🕵️‍♂️ ไขคดีปริศนา</h1>
      <button onClick={() => setScreen('LEVEL_SELECT')} className="murdle-button-primary text-xl px-12">
        เริ่มไขคดี
      </button>
      <button onClick={() => setScreen('HOW_TO_PLAY')} className="murdle-button-secondary text-lg px-8">
        วิธีการเล่น
      </button>
      <button onClick={() => setScreen('SETTINGS')} className="murdle-button-secondary text-lg px-8">
        ⚙️ ตั้งค่า
      </button>
    </div>
  );
}
