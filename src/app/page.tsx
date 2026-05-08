"use client";

import React, { useState, useEffect } from 'react';
import { LevelData, ScreenState } from '../types/level';
import { MainMenu } from '../components/screens/MainMenu';
import { SettingsScreen } from '../components/screens/SettingsScreen';
import { HowToPlay } from '../components/screens/HowToPlay';
import { LevelSelect } from '../components/screens/LevelSelect';
import { CaseSelect } from '../components/screens/CaseSelect';
import { GamePlay } from '../components/screens/GamePlay';

export default function Home() {
  const [screen, setScreen] = useState<ScreenState>('MENU');
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [selectedCase, setSelectedCase] = useState<LevelData | null>(null);
  const [solvedCases, setSolvedCases] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('solvedCases');
      if (saved) {
        setSolvedCases(JSON.parse(saved) as string[]);
      }
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [screen, selectedCase]);

  // ฟังก์ชันจัดการปุ่มย้อนกลับตามลำดับ
  const handleBack = () => {
    if (screen === 'GAME') setScreen('CASE_SELECT');
    else if (screen === 'CASE_SELECT') setScreen('LEVEL_SELECT');
    else if (screen === 'LEVEL_SELECT') setScreen('MENU');
    else if (screen === 'HOW_TO_PLAY') setScreen('MENU');
    else if (screen === 'SETTINGS') setScreen('MENU');
  };

  return (
    <div className="min-h-screen bg-neo-bg text-black font-mono pb-24">
      <header className="murdle-nav sticky top-0 z-10 flex justify-between items-center gap-2 min-h-[var(--app-header-height)]">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          {screen !== 'MENU' && (
            <button onClick={handleBack} aria-label="กลับไปหน้าก่อนหน้า" className="murdle-button-ghost shrink-0 !p-2 !min-h-11 !w-11 text-xl font-bold">
              ⬅️
            </button>
          )}
          <h1 className="min-w-0 truncate text-base sm:text-xl font-bold tracking-widest uppercase">🕵️‍♂️ ไขคดีปริศนา</h1>
        </div>
        {screen !== 'MENU' && (
          <button onClick={() => setScreen('MENU')} aria-label="กลับหน้าหลัก" className="murdle-button-secondary shrink-0 !px-3 !py-1 !min-h-11 text-[10px] sm:text-xs uppercase tracking-wider">
            หน้าหลัก
          </button>
        )}
      </header>

      <main className="w-full max-w-6xl mx-auto mt-6 px-4 sm:px-6 lg:px-8">
        {screen === 'MENU' && <MainMenu setScreen={setScreen} />}
        {screen === 'HOW_TO_PLAY' && <HowToPlay />}
        {screen === 'LEVEL_SELECT' && <LevelSelect setScreen={setScreen} setSelectedLevel={setSelectedLevel} solvedCases={solvedCases} />}
        {screen === 'CASE_SELECT' && <CaseSelect level={selectedLevel} setScreen={setScreen} setSelectedCase={setSelectedCase} solvedCases={solvedCases} />}
        {screen === 'GAME' && selectedCase && <GamePlay levelData={selectedCase} setSolvedCases={setSolvedCases} solvedCases={solvedCases} />}
        {screen === 'SETTINGS' && <SettingsScreen setScreen={setScreen} setSolvedCases={setSolvedCases} />}
      </main>
    </div>
  );
}
