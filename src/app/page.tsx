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
        window.setTimeout(() => {
          setSolvedCases(JSON.parse(saved) as string[]);
        }, 0);
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
    <div className="murdle-app-shell text-black pb-28">
      <header className="murdle-nav sticky top-0 z-40 min-h-[var(--app-header-height)]">
        <div className="mx-auto flex min-h-[var(--app-header-height)] w-full max-w-6xl items-center justify-between gap-3 px-3 sm:px-6 lg:px-8">
          <div className="murdle-wordmark">
            {screen !== 'MENU' && (
              <button onClick={handleBack} aria-label="กลับไปหน้าก่อนหน้า" className="murdle-button-ghost shrink-0 !min-h-10 !w-10 !p-0 text-lg font-bold">
                <i className="fa-solid fa-arrow-left" aria-hidden="true"></i>
              </button>
            )}
            <span className="murdle-wordmark-mark" aria-hidden="true">MP</span>
            <span className="min-w-0">
              <span className="murdle-wordmark-text block truncate text-base sm:text-xl">ไขคดีปริศนา</span>
              <span className="murdle-wordmark-sub">MurdPuzzle Case Hub</span>
            </span>
          </div>
          {screen !== 'MENU' && (
            <button onClick={() => setScreen('MENU')} aria-label="กลับหน้าหลัก" className="murdle-button-secondary shrink-0 !min-h-10 !px-3 !py-2 text-xs font-bold">
              <span className="hidden sm:inline">หน้าหลัก</span>
              <i className="fa-solid fa-house sm:hidden" aria-hidden="true"></i>
            </button>
          )}
        </div>
      </header>

      <main className="w-full max-w-6xl mx-auto mt-4 px-3 sm:mt-6 sm:px-6 lg:px-8">
        {screen === 'MENU' && <MainMenu setScreen={setScreen} solvedCases={solvedCases} />}
        {screen === 'HOW_TO_PLAY' && <HowToPlay />}
        {screen === 'LEVEL_SELECT' && <LevelSelect setScreen={setScreen} setSelectedLevel={setSelectedLevel} solvedCases={solvedCases} />}
        {screen === 'CASE_SELECT' && <CaseSelect level={selectedLevel} setScreen={setScreen} setSelectedCase={setSelectedCase} solvedCases={solvedCases} />}
        {screen === 'GAME' && selectedCase && <GamePlay levelData={selectedCase} setSolvedCases={setSolvedCases} solvedCases={solvedCases} />}
        {screen === 'SETTINGS' && <SettingsScreen setScreen={setScreen} setSolvedCases={setSolvedCases} />}
      </main>
    </div>
  );
}
