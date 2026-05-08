"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { LevelData, Category, ProfileItem, Profiles } from '../types/level';
import { getIconClass, getIconColor, extractEmojiAndText } from '../utils/emojiHelper';
import { useGameLogic } from '../hooks/useGameLogic';
import { LogicGrid } from '../components/LogicGrid';
import { allCases } from '../data/allCases';
import exhibitBData from '../data/ExhibitB.json';
import anagramDict from '../data/anagramDictionary.json';
import dailyMasterData from '../data/dailymasterdata.json';

type ZodiacSign = {
  name_en: string;
  symbol: string;
  name_th: string;
  element_th: string;
  dates_th: string;
};

type AlchemicalSymbol = {
  name_en: string;
  symbol: string;
  name_th: string;
};

type ScreenState = 'MENU' | 'HOW_TO_PLAY' | 'LEVEL_SELECT' | 'CASE_SELECT' | 'GAME' | 'SETTINGS';

export default function Home() {
  const [screen, setScreen] = useState<ScreenState>('MENU');
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [selectedCase, setSelectedCase] = useState<LevelData | null>(null);
  const [solvedCases, setSolvedCases] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = window.localStorage.getItem('solvedCases');
    return saved ? JSON.parse(saved) as string[] : [];
  });

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

function MainMenu({ setScreen }: { setScreen: (s: ScreenState) => void }) {
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

function SettingsScreen({ setScreen, setSolvedCases }: { setScreen: (s: ScreenState) => void, setSolvedCases: (c: string[]) => void }) {
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

function HowToPlay() {
  return (
    <div className="animate-fadeIn max-w-4xl mx-auto pb-24 px-4">
      <div className="murdle-card">
        <h2 className="murdle-section-title mb-6 border-b-[4px] border-black pb-4 flex items-center gap-3">
          <span className="text-4xl">🔍</span> คู่มือการสืบสวน: วิธีไขคดี Murdle
        </h2>

        <p className="murdle-body font-bold mb-8">
          สวมบทเป็น <strong className="bg-murdle-paper px-2 py-1 border-[2px] border-black">&quot;นักสืบโลจิโก&quot;</strong> แล้วออกไปลากคอคนร้ายมาลงโทษ! ในแต่ละคดี คุณต้องไขปริศนาให้ได้ว่า <strong className="text-murdle-accent">ใคร</strong> คือคนร้าย, ใช้ <strong className="text-murdle-accent">อาวุธ</strong> ชิ้นไหน และลงมือที่ <strong className="text-murdle-accent">สถานที่</strong> ใด
        </p>

        <section className="murdle-panel mb-10">
          <h3 className="text-xl font-bold mb-4 text-black border-b-[2px] border-black pb-2 inline-block">1. เครื่องมือทำมาหากิน: ตารางตรรกะ</h3>
          <p className="text-black mb-4 font-bold">หัวใจของเกมนี้คือการเชื่อมโยงข้อมูล 3 หมวดหมู่ (ผู้ต้องสงสัย, อาวุธ, สถานที่) เข้าด้วยกัน</p>
          <ul className="space-y-3 text-black font-bold list-disc list-inside marker:text-black">
            <li><strong>แตะ 1 ครั้ง (❌):</strong> เพื่อตัดความเป็นไปได้ทิ้ง (เมื่อมั่นใจว่า &quot;ไม่ใช่&quot;)</li>
            <li><strong>แตะ 2 ครั้ง (✅):</strong> เพื่อยืนยันความถูกต้อง (เมื่อมั่นใจว่า &quot;ใช่!&quot;)</li>
            <li className="mt-4 p-3 bg-murdle-error border-[2px] border-black">
              <strong>🚨 กฎเหล็ก:</strong> ในหนึ่งแถวหรือคอลัมน์ จะมี ✅ ได้เพียงช่องเดียวเท่านั้น ถ้าคุณพี่ใส่ ✅ แล้ว ระบบจะช่วยตัดช่องอื่นในแถวนั้นเป็น ❌ ให้ทันทีค่ะ
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h3 className="text-2xl font-bold mb-6 text-black border-b-[3px] border-black pb-2">2. ตัวอย่างประเภทคำใบ้และการตีความ</h3>
          <p className="text-black mb-6 font-bold">ใน Murdle คำใบ้จะไม่บอกตรงๆ เสมอไป คุณพี่ต้องหัดอ่านใจคนร้ายและสังเกตสิ่งแวดล้อม ดังนี้ค่ะ:</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="murdle-card-compact">
              <h4 className="text-lg font-bold mb-3 text-black flex items-center gap-2"><span className="text-2xl">📌</span> คำใบ้จากประวัติ</h4>
              <p className="text-black mb-2">บางครั้งคำใบ้จะพูดถึง &quot;ลักษณะทางกายภาพ&quot; ของผู้ต้องสงสัย</p>
              <div className="bg-murdle-paper p-3 border-[2px] border-black mb-2 text-sm italic">
                <strong>ตัวอย่าง:</strong> &quot;ผู้ต้องสงสัยที่ตัวสูงที่สุดไม่เคยเฉียดเข้าไปในตู้โดยสารท้ายขบวนเลย&quot;
              </div>
              <p className="text-black text-sm">
                <strong>วิธีคิด:</strong> เปิดดู Profile เพื่อเช็คส่วนสูง (เช่น รองประธานมอฟ สูง 5&#39;8&quot; ซึ่งสูงที่สุด) แล้วไปกา ❌ ที่ช่อง รองประธานมอฟ + ตู้โดยสารท้ายขบวน
              </p>
            </div>

            <div className="murdle-card-compact">
              <h4 className="text-lg font-bold mb-3 text-black flex items-center gap-2"><span className="text-2xl">📌</span> คำใบ้จากสถานที่และวัตถุพยาน</h4>
              <div className="bg-murdle-paper p-3 border-[2px] border-black mb-2 text-sm italic">
                <strong>ตัวอย่าง:</strong> &quot;ศพถูกพบอยู่ภายในอ่างอาบน้ำหินอ่อน&quot;
              </div>
              <p className="text-black text-sm">
                <strong>วิธีคิด:</strong> มองหา &quot;สถานที่&quot; ที่มีอ่างอาบน้ำ (เช่น ห้องน้ำขนาดมหึมา) สถานที่นี้แหละคือ <strong>สถานที่เกิดเหตุจริง</strong> ของคดีนั้น!
              </p>
            </div>

            <div className="murdle-card-compact">
              <h4 className="text-lg font-bold mb-3 text-black flex items-center gap-2"><span className="text-2xl">📌</span> คำใบ้แบบ &quot;ถ้า...ไม่ใช่...ก็คือ...&quot;</h4>
              <div className="bg-murdle-paper p-3 border-[2px] border-black mb-2 text-sm italic">
                <strong>ตัวอย่าง:</strong> &quot;ไม่เชือกก็ลูกดอกอาบยาพิษนี่แหละที่ถูกพบอยู่ใกล้กำแพงกราฟฟิตี้&quot;
              </div>
              <p className="text-black text-sm">
                <strong>วิธีคิด:</strong> ถ้าคุณพี่รู้จากคำใบ้อื่นแล้วว่าเชือกไม่ได้อยู่ที่นั่น แสดงว่าลูกดอกต้องอยู่ที่กำแพงกราฟฟิตี้แน่นอน
              </p>
            </div>

            <div className="murdle-panel">
              <h4 className="text-lg font-bold mb-3 text-black flex items-center gap-2"><span className="text-2xl">📌</span> คำใบ้รหัสลับ - ระดับยาก!</h4>
              <p className="text-murdle-muted mb-2">บางครั้งชมรมนักสืบจะส่งรหัสลับมาให้ ซึ่งมักจะเป็นรหัสแบบแทนที่ตัวอักษร หรือผสมคำในชุดเดียวกัน</p>
              <div className="bg-murdle-bg p-3 border-[2px] border-black mb-2 text-sm font-mono text-murdle-accent">
                <strong>ตัวอย่าง:</strong> &quot;ZTVMG RMP SZW Z NVWRFN-DVRTSG DVZKLM&quot;
              </div>
              <p className="text-murdle-muted text-sm">
                <strong>วิธีคิด:</strong> เมื่อถอดรหัสออกมาจะได้ความว่า <em>&quot;AGENT INK HAD A MEDIUM-WEIGHT WEAPON&quot;</em> (เอเยนต์อิงค์พกอาวุธน้ำหนักปานกลาง) คุณพี่ต้องลองสังเกตตัวอักษรที่สลับกันดูนะคะ!
              </p>
            </div>
          </div>
        </section>

        <section className="murdle-card mb-10">
          <h3 className="text-xl font-bold mb-4 text-black border-b-[2px] border-black pb-2 inline-block">3. ขั้นตอนการลงมือสืบ</h3>
          <ol className="space-y-4 text-black font-bold list-decimal list-inside marker:font-bold marker:text-lg">
            <li className="pl-2 border-l-[3px] border-black mb-2"><strong className="text-lg">อ่านเนื้อเรื่อง:</strong> เพื่อหาจุดเริ่มต้น (เช่น พบศพที่ไหน หรือใครทำอะไรอยู่)</li>
            <li className="pl-2 border-l-[3px] border-black mb-2"><strong className="text-lg">เก็บข้อมูลประวัติ:</strong> ดูว่าใครสูงเท่าไหร่, ถนัดข้างไหน หรือตาสีอะไร ข้อมูลพวกนี้ใช้ร่วมกับคำใบ้ได้บ่อยมาก</li>
            <li className="pl-2 border-l-[3px] border-black mb-2"><strong className="text-lg">เติมตาราง:</strong> ค่อยๆ ไล่จากคำใบ้ที่ชัดเจนที่สุดไปหาจุดที่ซับซ้อน</li>
            <li className="pl-2 border-l-[3px] border-black mb-2"><strong className="text-lg">กล่าวหา:</strong> เมื่อตารางสมบูรณ์และได้ข้อสรุป &quot;ใคร-อะไร-ที่ไหน&quot; ที่เชื่อมโยงกันแล้ว ให้กดฟ้องศาลได้เลย!</li>
          </ol>
        </section>

        <section className="murdle-card !bg-murdle-accent text-white">
          <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">✨ ทริคจากอลิซ:</h3>
          <p className="text-lg font-bold italic leading-relaxed">
            &quot;อย่าลืมดู <strong className="bg-murdle-paper text-black px-2 py-1 border border-black">น้ำหนักอาวุธ</strong> (เบา, ปานกลาง, มาก) ในรายละเอียดอาวุธนะคะ บางคำใบ้จะบอกแค่น้ำหนัก ไม่บอกชื่ออาวุธโดยตรง เป็นจุดที่คนร้ายมักจะพลาดทิ้งร่องรอยไว้บ่อยๆ ค่ะ!&quot;
          </p>
        </section>

      </div>
    </div>
  );
}

function LevelSelect({ setScreen, setSelectedLevel, solvedCases }: { setScreen: (s: ScreenState) => void, setSelectedLevel: (l: number) => void, solvedCases: string[] }) {
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

function CaseSelect({ level, setScreen, setSelectedCase, solvedCases }: { level: number, setScreen: (s: ScreenState) => void, setSelectedCase: (c: LevelData) => void, solvedCases: string[] }) {
  const cases = allCases[level as keyof typeof allCases] || [];

  return (
    <div className="animate-fadeIn">
      <h2 className="murdle-section-title mb-6 flex items-center gap-2">📂 รายการคดีระดับ {level}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cases.map((c: LevelData) => {
          const isSolved = solvedCases.includes(c.id);

          const caseNum = parseInt(c.id.replace('case_', ''), 10);
          const isUnlocked = caseNum === 1 || solvedCases.includes('case_' + String(caseNum - 1).padStart(2, '0'));

          return (
            <button key={c.id}
              onClick={() => { if (isUnlocked) { setSelectedCase(c); setScreen('GAME'); } }}
              disabled={!isUnlocked}
              className={`murdle-card-compact relative text-left flex flex-col justify-between h-full min-h-36 transition
                ${!isUnlocked
                  ? 'opacity-60 !bg-murdle-surface text-murdle-muted cursor-not-allowed'
                  : isSolved
                    ? '!bg-murdle-success hover:-translate-y-1 cursor-pointer'
                    : 'hover:-translate-y-1 cursor-pointer'}`}>

              {!isUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <span className="text-6xl drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">🔒</span>
                </div>
              )}

              <div className={!isUnlocked ? "opacity-30" : ""}>
                <h3 className="font-bold text-lg leading-tight text-black">{c.level_name}</h3>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 border border-black text-black uppercase tracking-wider bg-white">หมายเลขคดี: {c.id}</span>
                </div>
              </div>
              {isSolved && <div className="mt-4 text-black font-bold self-end flex items-center gap-1">✅ ปิดคดี</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

type ProfileCategoryKey = keyof Profiles;
type SetSolvedCases = React.Dispatch<React.SetStateAction<string[]>>;

function getProfileItems(profiles: Profiles | undefined, key: ProfileCategoryKey): ProfileItem[] {
  return profiles?.[key] ?? [];
}

function GamePlay({ levelData, setSolvedCases, solvedCases }: { levelData: LevelData, setSolvedCases: SetSolvedCases, solvedCases: string[] }) {
  const { getCellState, toggleCell, resetGrid, undo, saveGridState, loadGridState, canUndo } = useGameLogic(levelData.categories, []);
  const [testimonyStates, setTestimonyStates] = useState<Record<number, number>>({});
  const [accusation, setAccusation] = useState({ suspect: '', weapon: '', location: '', motive: '' });
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | null }>({ message: '', type: null });
  const [activeView, setActiveView] = useState<'clues' | 'grid'>('clues');
  const [activeTab, setActiveTab] = useState<'suspects' | 'weapons' | 'locations' | 'motives'>('suspects');
  const [selectedLegendCategory, setSelectedLegendCategory] = useState<Category | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [cluesScrollY, setCluesScrollY] = useState(0);
  const [selectedProfileIndex, setSelectedProfileIndex] = useState<number | null>(null);
  const [showExhibitB, setShowExhibitB] = useState(false);
  const [showExhibitC, setShowExhibitC] = useState(false);
  const [showExhibitD, setShowExhibitD] = useState(false);
  const [showDecrypter, setShowDecrypter] = useState(false);
  const [cipherInput, setCipherInput] = useState('');
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [gridExportStatus, setGridExportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [manualCopyText, setManualCopyText] = useState('');

  useEffect(() => {
    const loaded = loadGridState(levelData.id);
    if (loaded) {
      window.setTimeout(() => {
        setTestimonyStates(loaded.testimonyStates);
        setNotes(loaded.notes);
      }, 0);
    }
  }, [levelData.id, loadGridState]);

  useEffect(() => {
    if (activeView === 'grid') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeView]);

  const hasMotives = levelData.categories.some(c => c.id === 'motives');

  const handleCheckAnswer = () => {
    const correct = levelData.correct_accusation;
    const isCorrect = 
      accusation.suspect === correct.suspect &&
      accusation.weapon === correct.weapon &&
      accusation.location === correct.location &&
      (!hasMotives || accusation.motive === correct.motive);

    if (isCorrect) {
      setFeedback({ message: "🎉 ยินดีด้วย! คุณไขคดีสำเร็จแล้ว!", type: 'success' });
      if (!solvedCases.includes(levelData.id)) {
        const newSolved = [...solvedCases, levelData.id];
        setSolvedCases(newSolved);
        localStorage.setItem('solvedCases', JSON.stringify(newSolved));
      }
    } else {
      setFeedback({ message: "❌ สรุปรูปคดีของคุณยังไม่ถูกต้อง ลองทบทวนเบาะแสอีกครั้งนะ", type: 'error' });
      setTimeout(() => setFeedback({ message: '', type: null }), 3000);
    }
  };

  const getOptions = (catId: string) => levelData.categories.find(c => c.id === catId)?.items || [];

  const exportToAI = () => {
    const caseNumber = parseInt(levelData.id.replace('case_', ''), 10);
    const hasMotives = levelData.categories.some(c => c.id === 'motives');

    let prompt = `ฉันกำลังเล่นเกมสืบสวนตรรกะ (Logic Puzzle) ระดับความยาก Level ${levelData.difficulty}\n`;
    prompt += `ชื่อคดี: คดีที่ ${caseNumber}\n\n`;

    if (levelData.story_intro) {
      prompt += `เนื้อเรื่อง: ${levelData.story_intro}\n\n`;
    }

    prompt += `📌 ข้อมูลที่ต้องสืบหา:\n`;

    const suspects = levelData.categories.find(c => c.id === 'suspects')?.items || [];
    if (suspects.length > 0) {
      prompt += `${suspects.map(name => {
        const data = dailyMasterData.suspects.find(s => s.name === name);
        if (!data) return `- 👤 ${name}`;
        const attrs = [];
        if (data.height && data.height !== '-') attrs.push(`สูง: ${data.height}`);
        if (data.hair && data.hair !== '-') attrs.push(`ผม: ${data.hair}`);
        if (data.eye && data.eye !== '-') attrs.push(`ตา: ${data.eye}`);
        if (data.zodiac && data.zodiac !== '-') attrs.push(`ราศี: ${data.zodiac}`);

        let result = `- 👤 ${name}`;
        if (attrs.length > 0) result += ` (${attrs.join(', ')})`;
        if (data.lore) result += `: ${data.lore}`;
        return result;
      }).join('\n')}\n`;
    }

    const locations = levelData.categories.find(c => c.id === 'locations')?.items || [];
    if (locations.length > 0) {
      prompt += `${locations.map(name => {
        const data = dailyMasterData.locations.find(l => l.name === name);
        if (!data) return `- 📍 ${name}`;
        const attrs = [];
        if (data.type && data.type !== '-') attrs.push(`โซน: ${data.type}`);

        let result = `- 📍 ${name}`;
        if (attrs.length > 0) result += ` (${attrs.join(', ')})`;
        if (data.lore) result += `: ${data.lore}`;
        return result;
      }).join('\n')}\n`;
    }

    const weapons = levelData.categories.find(c => c.id === 'weapons')?.items || [];
    if (weapons.length > 0) {
      prompt += `${weapons.map(name => {
        const data = dailyMasterData.weapons.find(w => w.name === name);
        if (!data) return `- 🔪 ${name}`;
        const attrs = [];
        if (data.weight && data.weight !== '-') attrs.push(`น้ำหนัก: ${data.weight}`);
        if (data.material && data.material !== '-') attrs.push(`วัสดุ/ชนิด: ${data.material}`);

        let result = `- 🔪 ${name}`;
        if (attrs.length > 0) result += ` (${attrs.join(', ')})`;
        if (data.lore) result += `: ${data.lore}`;
        return result;
      }).join('\n')}\n`;
    }

    if (hasMotives) {
      const motives = levelData.categories.find(c => c.id === 'motives')?.items || [];
      if (motives.length > 0) {
        prompt += `${motives.map(name => {
          const data = dailyMasterData.motives.find(m => m.name === name);
          if (!data || !data.detail) return `- 💡 ${name}`;
          return `- 💡 ${name}: ${data.detail}`;
        }).join('\n')}\n`;
      }
    }

    prompt += `\n📝 คำให้การและเบาะแส:\n`;
    levelData.clues.forEach((clue, index) => {
      prompt += `${index + 1}. ${clue}\n`;
    });

    if (levelData.testimonies && levelData.testimonies.length > 0) {
      levelData.testimonies.forEach((t, index) => {
        prompt += `${levelData.clues.length + index + 1}. คำให้การของ ${t.suspect}: "${t.statement}"\n`;
      });
    }

    prompt += `\n⚠️ กฎของคดีนี้:\n`;
    if (levelData.difficulty === 1 || levelData.difficulty === 3) {
      prompt += `เบาะแสและคำให้การทุกอย่างเป็นความจริง 100%\n`;
    } else if (levelData.difficulty === 2 || levelData.difficulty === 4) {
      prompt += `มีผู้ต้องสงสัย 1 คนที่โกหกเสมอ และคนที่โกหกคือ "คนร้าย" เท่านั้น ส่วนคนบริสุทธิ์จะพูดความจริงเสมอ\n`;
    }

    prompt += `\n🤖 คำสั่งสำหรับคุณ (AI):\n`;
    prompt += `คุณคือ "อลิซ" ผู้ช่วยนักสืบสุดร่าเริงของฉัน\n`;
    prompt += `1. **ห้ามเฉลยคำตอบ ตัวคนร้าย หรือสรุปตารางให้ฉันเด็ดขาด!** (สำคัญมาก)\n`;
    prompt += `2. ให้คุณอ่านข้อมูลคดีนี้เพื่อทำความเข้าใจเงียบๆ\n`;
    prompt += `3. ทักทายฉันแบบร่าเริง แล้วถามฉันว่า "คุณพี่นักสืบสงสัยใครเป็นพิเศษไหมคะ? เรามาลองสมมติว่าคนนั้นโกหกดูไหม?"\n`;
    prompt += `4. ช่วยฉันคิดวิเคราะห์ทีละสเตป เพื่อฝึกให้ฉันหาจุดขัดแย้งของตรรกะด้วยตัวเอง`;
    prompt += `5. **วิธีการตีความคำใบ้ (Strict Logic Grid Rules):** 
คดีนี้คือตรรกะแบบตัดช้อยส์ 1:1 (Boolean Matrix) ห้ามจินตนาการเนื้อเรื่องเพิ่มเด็ดขาด! 
ให้ตีความตรงไปตรงมา เช่น:
- "A รู้จักกับคนที่ใช้พลั่ว" แปลว่า A ไม่ได้ใช้พลั่ว (A ❌ พลั่ว)
- "B สูงกว่าคนที่อยู่ในครัว" แปลว่า B ไม่ได้อยู่ในครัว (B ❌ ครัว) และคนที่อยู่ในครัวไม่ใช่คนที่สูงที่สุด
ช่วยฉันจับคู่ หรือตัดช้อยส์ (✅/❌) ด้วยตรรกะคณิตศาสตร์เท่านั้น`;

    return prompt;
  };

  const copyTextWithFallback = async (textToCopy: string) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(textToCopy);
      return;
    }

    const textarea = document.createElement('textarea');
    textarea.value = textToCopy;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    document.body.removeChild(textarea);

    if (!copied) throw new Error('Clipboard fallback failed');
  };

  const handleCopyFailure = (textToCopy: string) => {
    setManualCopyText(textToCopy);
  };

  const handleExportAI = async () => {
    const textToCopy = exportToAI();
    try {
      await copyTextWithFallback(textToCopy);
      setExportStatus('success');
      setTimeout(() => setExportStatus('idle'), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      handleCopyFailure(textToCopy);
      setExportStatus('error');
      setTimeout(() => setExportStatus('idle'), 3000);
    }
  };

  const exportGridStateToAI = () => {
    if (levelData.categories.length === 0) return '';
    const primaryCat = levelData.categories[0];
    const otherCats = levelData.categories.slice(1);

    const catEmojis: Record<string, string> = { suspects: '👤', weapons: '🔪', locations: '📍', motives: '💬' };

    // Build Headers
    const headers = [
      `${catEmojis[primaryCat.id] || ''} ${primaryCat.name}`,
      ...otherCats.map(c => `${catEmojis[c.id] || ''} ${c.name}`)
    ];

    let prompt = `| ${headers.join(' | ')} |\n`;
    prompt += `|${headers.map(() => '---').join('|')}|\n`;

    // Build Rows
    primaryCat.items.forEach(primaryItem => {
      const rowData = [primaryItem];
      otherCats.forEach(otherCat => {
        const cellInputs: string[] = [];
        otherCat.items.forEach(otherItem => {
          const state = getCellState(primaryCat, otherCat, primaryItem, otherItem);
          if (state === 'O') cellInputs.push(`✅ ${otherItem}`);
          else if (state === 'X') cellInputs.push(`❌ ${otherItem}`);
          else if (state === '?') cellInputs.push(`❓ ${otherItem}`);
        });
        rowData.push(cellInputs.length > 0 ? cellInputs.join(', ') : '-');
      });
      prompt += `| ${rowData.join(' | ')} |\n`;
    });

    return prompt.trim();
  };

  const handleGridExportAI = async () => {
    const textToCopy = exportGridStateToAI();
    try {
      await copyTextWithFallback(textToCopy);
      setGridExportStatus('success');
      setTimeout(() => setGridExportStatus('idle'), 2000);
    } catch (err) {
      console.error('Failed to copy grid state: ', err);
      handleCopyFailure(textToCopy);
      setGridExportStatus('error');
      setTimeout(() => setGridExportStatus('idle'), 3000);
    }
  };

  const handleToggleView = () => {
    if (activeView === 'clues') {
      // Going to Grid: Save current scroll, then jump to top
      setCluesScrollY(window.scrollY);
      setActiveView('grid');
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      // Going to Clues: Switch view, then restore old scroll position
      setActiveView('clues');
      setTimeout(() => {
        window.scrollTo({ top: cluesScrollY, behavior: 'instant' });
      }, 10); // Small timeout to allow DOM to render the clues first
    }
  };

  return (
    <div className="animate-fadeIn max-w-4xl mx-auto relative pb-24">
      {activeView === 'clues' && (
        <div className="animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="murdle-section-title text-black">{levelData.level_name}</h2>
          </div>

          <div className="murdle-card mb-8 italic text-lg">
            {levelData.story_intro}
          </div>

          {/* แฟ้มประวัติ Profiles (Tabbed View) */}
          {levelData.profiles && (
            <div className="murdle-card mb-8">
              <h3 className="text-lg font-bold mb-4 border-b-[3px] border-black pb-2 flex items-center gap-2 text-black uppercase tracking-widest">📋 ข้อมูลเพิ่มเติม</h3>

              {/* Tabs Row */}
              <div className="flex flex-wrap gap-2 mb-6">
                {(['suspects', 'weapons', 'locations', 'motives'] as const).map(tabKey => {
                  if (getProfileItems(levelData.profiles, tabKey).length === 0) return null;
                  const isActive = activeTab === tabKey;
                  const label = tabKey === 'suspects' ? 'ผู้ต้องสงสัย' : tabKey === 'weapons' ? 'อาวุธ' : tabKey === 'locations' ? 'สถานที่' : 'แรงจูงใจ';

                  return (
                    <button
                      key={tabKey}
                      onClick={() => setActiveTab(tabKey)}
                      className={`murdle-tab flex items-center gap-2 tracking-wider
                        ${isActive ? 'murdle-tab-active' : ''}
                      `}
                    >
                      <i aria-hidden="true" className={`${getIconClass(tabKey)} text-base sm:text-2xl leading-none inline-block [text-shadow:2px_2px_0_#000]`} style={{ color: getIconColor(0, String(levelData.id), tabKey) }}></i> {label}
                    </button>
                  );
                })}
              </div>

              {/* Active Tab Content (Mini-Tiles) */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {getProfileItems(levelData.profiles, activeTab).map((item, index) => {
                  const catData = levelData.categories.find(c => c.id === activeTab);
                  const trueIndex = catData ? catData.items.findIndex(i => i.replace(/\s*\(.*?\)\s*/g, '').trim() === item.name.replace(/\s*\(.*?\)\s*/g, '').trim()) : index;
                  const finalIndex = trueIndex >= 0 ? trueIndex : index;

                  return (
                    <button
                      key={item.name}
                      onClick={() => setSelectedProfileIndex(index)}
                      className="murdle-card-compact hover:-translate-y-1 hover:shadow-[6px_6px_0_#1DACD6] transition-all flex flex-col items-center justify-center !p-3 aspect-square"
                    >
                      <div className="mb-2">
                        <i aria-hidden="true" className={`${getIconClass(activeTab, item.name)} text-3xl sm:text-4xl leading-none inline-block [text-shadow:2px_2px_0_#000]`} style={{ color: getIconColor(finalIndex, String(levelData.id), activeTab) }}></i>
                      </div>
                      <div className="font-bold text-black text-xs text-center break-words w-full">
                        {extractEmojiAndText(item.name).text}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pop-up Modal */}
          {selectedProfileIndex !== null && levelData.profiles && (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedProfileIndex(null)}>
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="profile-modal-title"
                className="murdle-modal max-w-sm w-full p-6 flex flex-col items-center relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Content */}
                <div className="murdle-card-compact w-24 h-24 flex items-center justify-center mb-4 !p-2">
                  {(() => {
                    const itemName = getProfileItems(levelData.profiles, activeTab)[selectedProfileIndex].name;
                    const catData = levelData.categories.find(c => c.id === activeTab);
                    const trueIndex = catData ? catData.items.findIndex(i => i.replace(/\s*\(.*?\)\s*/g, '').trim() === itemName.replace(/\s*\(.*?\)\s*/g, '').trim()) : selectedProfileIndex;
                    const finalIndex = trueIndex >= 0 ? trueIndex : selectedProfileIndex;
                    return (
                      <i aria-hidden="true" className={`${getIconClass(activeTab, itemName)} text-5xl leading-none inline-block [text-shadow:2px_2px_0_#000]`} style={{ color: getIconColor(finalIndex, String(levelData.id), activeTab) }}></i>
                    );
                  })()}
                </div>

                <h3 id="profile-modal-title" className="murdle-section-title text-black mb-4 border-b-[3px] border-black pb-2 text-center w-full">
                  {extractEmojiAndText(getProfileItems(levelData.profiles, activeTab)[selectedProfileIndex].name).text}
                </h3>

                <p className="text-black text-base leading-relaxed mb-8 w-full">
                  {getProfileItems(levelData.profiles, activeTab)[selectedProfileIndex].detail}
                </p>

                {/* Navigation Buttons */}
                <div className="flex justify-between w-full mb-4">
                  <button
                    onClick={() => {
                      const total = getProfileItems(levelData.profiles, activeTab).length;
                      setSelectedProfileIndex((selectedProfileIndex - 1 + total) % total);
                    }}
                    className="murdle-button-secondary !px-4 !py-2"
                  >
                    ⬅️ ก่อนหน้า
                  </button>
                  <button
                    onClick={() => {
                      const total = getProfileItems(levelData.profiles, activeTab).length;
                      setSelectedProfileIndex((selectedProfileIndex + 1) % total);
                    }}
                    className="murdle-button-secondary !px-4 !py-2"
                  >
                    ถัดไป ➡️
                  </button>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setSelectedProfileIndex(null)}
                  className="murdle-button-primary w-full text-lg uppercase tracking-widest"
                >
                  ❌ ปิด
                </button>
              </div>
            </div>
          )}

          {/* Clues & Testimonies */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="murdle-card">
              <div className="flex items-center justify-between mb-5 border-b-[3px] border-black pb-2">
                <h3 className="text-xl font-bold flex items-center gap-2 text-black">🔍 เบาะแส</h3>
                {levelData.difficulty === 2 && (
                  <button onClick={() => setShowExhibitB(true)} className="murdle-button-primary ml-auto !px-3 !py-1 !min-h-11 text-sm flex items-center gap-1">
                    📖 คู่มือ Exhibit B
                  </button>
                )}
                {levelData.difficulty === 3 && (
                  <button onClick={() => setShowExhibitC(true)} className="murdle-button-primary ml-auto !px-3 !py-1 !min-h-11 text-sm flex items-center gap-1">
                    📖 คู่มือ Exhibit C
                  </button>
                )}
                {levelData.difficulty === 4 && (
                  <button onClick={() => setShowExhibitD(true)} className="murdle-button-primary ml-auto !px-3 !py-1 !min-h-11 text-sm flex items-center gap-1">
                    📖 แผนผัง Exhibit D
                  </button>
                )}
              </div>
              <ul className="space-y-4">
                {levelData.clues.map((clue, idx) => {
                  return (
                    <li key={idx} className="flex gap-4 items-start text-black">
                      <span className="font-bold text-black bg-murdle-paper border-[2px] border-black px-2 py-1 text-xl leading-none shadow-[2px_2px_0_#1DACD6]">{idx + 1}</span>
                      <span className="leading-relaxed font-bold">{clue}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {levelData.testimonies && levelData.testimonies.length > 0 && (
              <div className="murdle-card border-l-[8px] border-l-neo-accent">
                <h3 className="text-xl font-bold mb-5 border-b-[3px] border-black pb-2 text-murdle-accent flex items-center gap-2">🗣️ คำให้การ</h3>
                <ul className="space-y-4">
                  {levelData.testimonies.map((t, idx) => {
                    const state = testimonyStates[idx] || 0;
                    return (
                      <li key={idx} className="murdle-panel flex flex-col gap-3">
                        <div className="flex justify-between items-center border-b-[2px] border-black pb-2">
                          <span className="font-bold text-black">{t.suspect}</span>
                          <button
                            onClick={() => setTestimonyStates({...testimonyStates, [idx]: (state + 1) % 3})}
                            className={`text-[10px] px-3 py-1 font-bold border-[2px] border-black transition-all uppercase tracking-widest ${
                              state === 1 ? 'murdle-status-success shadow-[2px_2px_0_#1DACD6]' :
                              state === 2 ? 'bg-murdle-accent text-white shadow-[2px_2px_0_#1DACD6]' :
                              'bg-white text-black'
                            }`}
                          >
                            {state === 1 ? '✓ พูดจริง' : state === 2 ? '✗ โกหก' : 'สถานะ ?'}
                          </button>
                        </div>
                        <p className="text-black italic font-bold leading-relaxed">&quot;{t.statement}&quot;</p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

          </div>

          {/* Final Accusation */}
          <div className="murdle-card !bg-murdle-paper flex flex-col items-center">
            <h3 className="text-2xl font-bold mb-8 tracking-[0.2em] uppercase text-murdle-accent">⚖️ สรุปรูปคดี</h3>
            <div className="flex flex-wrap items-center justify-center gap-6 text-xl mb-10">
              <div className="flex flex-col items-center gap-2">
                <label htmlFor="accuse-suspect" className="text-[10px] uppercase font-bold text-black tracking-widest bg-white border-2 border-black px-2">คนร้าย</label>
                <select id="accuse-suspect" className="murdle-input !min-h-11 !py-2 text-sm" value={accusation.suspect} onChange={e => setAccusation({...accusation, suspect: e.target.value})}>
                  <option value="">- เลือกผู้ต้องสงสัย -</option>
                  {getOptions('suspects').map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>

              <div className="flex flex-col items-center gap-2">
                <label htmlFor="accuse-weapon" className="text-[10px] uppercase font-bold text-black tracking-widest bg-white border-2 border-black px-2">อาวุธ</label>
                <select id="accuse-weapon" className="murdle-input !min-h-11 !py-2 text-sm" value={accusation.weapon} onChange={e => setAccusation({...accusation, weapon: e.target.value})}>
                  <option value="">- เลือกอาวุธ -</option>
                  {getOptions('weapons').map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>

              <div className="flex flex-col items-center gap-2">
                <label htmlFor="accuse-location" className="text-[10px] uppercase font-bold text-black tracking-widest bg-white border-2 border-black px-2">สถานที่</label>
                <select id="accuse-location" className="murdle-input !min-h-11 !py-2 text-sm" value={accusation.location} onChange={e => setAccusation({...accusation, location: e.target.value})}>
                  <option value="">- เลือกสถานที่ -</option>
                  {getOptions('locations').map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>

              {hasMotives && (
                <div className="flex flex-col items-center gap-2">
                  <label htmlFor="accuse-motive" className="text-[10px] uppercase font-bold text-black tracking-widest bg-white border-2 border-black px-2">แรงจูงใจ</label>
                  <select id="accuse-motive" className="murdle-input !min-h-11 !py-2 text-sm" value={accusation.motive} onChange={e => setAccusation({...accusation, motive: e.target.value})}>
                    <option value="">- เลือกแรงจูงใจ -</option>
                    {getOptions('motives').map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
              )}
            </div>

            <button onClick={handleCheckAnswer} className="murdle-button-primary px-12 py-5 text-xl uppercase tracking-widest">
              ตรวจคำตอบ
            </button>

            {feedback.type && (
              <div className={`mt-8 w-full max-w-md px-6 py-4 font-bold text-center text-lg shadow-[4px_4px_0_#1DACD6] border-[3px] border-black ${feedback.type === 'success' ? 'murdle-status-success' : 'murdle-status-error'}`}>
                {feedback.message}
              </div>
            )}

            {/* AI Export Button */}
            <div className="mt-8 mb-4 w-full">
              <button
                onClick={handleExportAI}
                className={`murdle-button-primary w-full text-xl uppercase tracking-widest ${
                  exportStatus === 'success'
                    ? 'murdle-status-success'
                    : exportStatus === 'error'
                      ? 'murdle-status-error'
                      : 'bg-murdle-teal text-black hover:bg-murdle-shadow'
                }`}
              >
                {exportStatus === 'success'
                  ? '✅ คัดลอกสำเร็จ!'
                  : exportStatus === 'error'
                    ? '❌ คัดลอกไม่สำเร็จ'
                    : '🕵🏻‍♀️ ปรึกษาผู้ช่วยอลิซ'}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeView === 'grid' && (
        <div className="fixed inset-x-0 bottom-0 top-[var(--app-header-height)] [--grid-vertical-chrome:13rem] overflow-y-auto overflow-x-hidden flex flex-col items-center justify-start bg-neo-bg z-0 animate-in fade-in duration-300 gap-2 px-1 pt-2 pb-[calc(env(safe-area-inset-bottom)+5.5rem)]">

          {/* Smart Legend Bar */}
          <div className="flex flex-nowrap justify-start sm:justify-center gap-2 w-full max-w-3xl overflow-x-auto px-2 sm:px-4 py-1 shrink-0">
            {levelData.categories.map(cat => {
              const catEmojis: Record<string, string> = { suspects: '👤', weapons: '🔪', locations: '📍', motives: '💬' };
              const emoji = catEmojis[cat.id] || '❓';
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedLegendCategory(cat)}
                  className="murdle-button-secondary !px-2 sm:!px-3 !py-1.5 sm:!py-2 !min-h-11 flex items-center gap-1 sm:gap-2 whitespace-nowrap"
                >
                  <span className="text-lg sm:text-xl [text-shadow:2px_2px_0_#000] max-md:[text-shadow:none]">{emoji}</span>
                  <span className="font-bold uppercase tracking-wide text-[10px] sm:text-sm">{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Logic Grid */}
          <section className="bg-white border-[3px] border-black shadow-[4px_4px_0_#1DACD6] overflow-hidden flex shrink-0 flex-col w-[calc(100vw-0.5rem)] max-w-3xl">
            <div className="overflow-hidden p-0 flex justify-center items-start bg-neo-bg flex-1 min-h-0 w-full">
              <LogicGrid categories={levelData.categories} getCellState={getCellState} toggleCell={toggleCell} seedString={String(levelData.id)} />
            </div>
          </section>

          {/* AI Grid Export Button */}
          <div className="w-full max-w-3xl px-2 sm:px-4 mt-1 mb-1 shrink-0">
            <button
              onClick={handleGridExportAI}
              className={`murdle-button-secondary w-full text-sm sm:text-lg uppercase tracking-widest ${
                gridExportStatus === 'success'
                  ? 'murdle-status-success'
                  : gridExportStatus === 'error'
                    ? 'murdle-status-error'
                    : 'bg-murdle-paper text-black hover:bg-murdle-teal'
              }`}
            >
              {gridExportStatus === 'success'
                ? '✅ คัดลอกกระดานสำเร็จ!'
                : gridExportStatus === 'error'
                  ? '❌ คัดลอกไม่สำเร็จ'
                  : '📊 ให้คู่หูช่วยตรวจกระดาน'}
            </button>
          </div>

          {/* Grid Action Menu */}
          <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+1rem)] left-1/2 -translate-x-1/2 z-50 bg-murdle-surface text-black px-4 sm:px-6 py-3 border-[3px] border-black shadow-[4px_4px_0_#1DACD6] flex items-center gap-3 sm:gap-4 max-w-[95vw] overflow-x-auto whitespace-nowrap">
            <button onClick={() => setShowDecrypter(true)} aria-label="เปิดเครื่องมือคำใบ้และถอดรหัส" className="hover:text-murdle-accent transition-colors flex flex-col items-center gap-1">
              <span className="text-xl">💡</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">คำใบ้</span>
            </button>
            <div className="w-[3px] h-8 bg-black"></div>
            <button onClick={() => saveGridState(testimonyStates, notes, levelData.id)} aria-label="บันทึกกระดานปัจจุบัน" className="hover:text-murdle-accent transition-colors flex flex-col items-center gap-1">
              <span className="text-xl">💾</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">บันทึก</span>
            </button>
            <div className="w-[3px] h-8 bg-black"></div>
            <button onClick={undo} disabled={!canUndo} aria-label="ย้อนกลับการแก้ไขล่าสุด" className={`transition-colors flex flex-col items-center gap-1 ${canUndo ? 'hover:text-murdle-accent' : 'opacity-50 cursor-not-allowed'}`}>
              <span className="text-xl">♻️</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">ย้อน</span>
            </button>
            <div className="w-[3px] h-8 bg-black"></div>
            <button onClick={resetGrid} aria-label="รีเซ็ตกระดานตรรกะ" className="hover:text-murdle-accent transition-colors flex flex-col items-center gap-1 text-murdle-accent">
              <span className="text-xl">🗑️</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">ล้าง</span>
            </button>
          </div>
        </div>
      )}

      {/* Main View Toggle FAB */}
      <button
        onClick={handleToggleView}
        className="murdle-button-primary fixed bottom-[calc(env(safe-area-inset-bottom)+1rem)] right-4 sm:right-6 z-50 !p-4 text-2xl flex items-center justify-center w-14 h-14"
        aria-label={activeView === 'clues' ? "Switch to Grid" : "Switch to Clues"}
      >
        {activeView === 'clues' ? '📔' : '🔍'}
      </button>

      {/* Exhibit B Modal */}
      {showExhibitB && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowExhibitB(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="exhibit-b-title"
            className="murdle-modal max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="exhibit-b-title" className="text-2xl sm:text-3xl font-bold text-black mb-2 border-b-[4px] border-black pb-2 text-center w-full uppercase tracking-widest">
              {exhibitBData.exhibit_b.title_th}
            </h3>
            <p className="text-black text-sm sm:text-base font-bold text-center mb-6">
              {exhibitBData.exhibit_b.description}
            </p>

            {/* Astrological Primer */}
            <div className="mb-8">
              <h4 className="murdle-section-title mb-4 bg-murdle-accent text-white inline-block px-4 py-1 border-[2px] border-black shadow-[4px_4px_0_#1DACD6]">
                ✨ จักรราศี
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {(Object.values(exhibitBData.exhibit_b.zodiac_signs) as ZodiacSign[]).map((sign) => (
                  <div key={sign.name_en} className="murdle-card-compact !p-3 flex flex-col items-center text-center">
                    <span className="text-4xl mb-2">{sign.symbol}</span>
                    <span className="font-bold text-black text-sm">{sign.name_th}</span>
                    <span className="text-xs font-bold bg-murdle-paper px-2 py-0.5 mt-1 border border-black">{sign.element_th}</span>
                    <span className="text-[10px] mt-2 font-bold">{sign.dates_th}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Alchemical Symbols */}
            <div className="mb-6">
              <h4 className="murdle-section-title mb-4 bg-murdle-accent text-white inline-block px-4 py-1 border-[2px] border-black shadow-[4px_4px_0_#1DACD6]">
                ⚗️ สัญลักษณ์การเล่นแร่แปรธาตุ
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {(Object.values(exhibitBData.exhibit_b.alchemical_symbols) as AlchemicalSymbol[]).map((symbol) => (
                  <div key={symbol.name_en} className="murdle-card-compact !border-[3px] !shadow-[2px_2px_0_#1DACD6] !p-2 flex flex-col items-center text-center">
                    <span className="text-3xl mb-1">{symbol.symbol}</span>
                    <span className="font-bold text-black text-[10px] sm:text-xs leading-tight">{symbol.name_th}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowExhibitB(false)}
              aria-label="ปิดเอกสาร Exhibit B"
              className="murdle-button-primary mt-auto w-full text-xl uppercase tracking-widest sticky bottom-0"
            >
              ❌ ปิดเอกสาร
            </button>
          </div>
        </div>
      )}

      {/* Exhibit C Modal (Image View) */}
      {showExhibitC && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowExhibitC(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="exhibit-c-title"
            className="murdle-modal p-6 max-w-4xl max-h-[90vh] overflow-y-auto w-full flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="exhibit-c-title" className="text-2xl sm:text-3xl font-bold text-black mb-2 border-b-[4px] border-black pb-2 text-center w-full uppercase tracking-widest font-mono">
              Exhibit C: วงกตบนซากปรักหักพังโบราณ
            </h3>
            <p className="text-black text-sm sm:text-base font-bold text-center mb-6">
              แผนผังความสัมพันธ์เชิงตรรกะที่สลักไว้บนหินโบราณ
            </p>

            <div className="mb-6 flex justify-center w-full relative h-[50vh] sm:h-[60vh] md:h-[70vh]">
              <div className="relative w-full h-full border-[3px] border-black shadow-[4px_4px_0_#1DACD6] bg-white overflow-hidden">
                <Image
                  src="/Exhibit C.webp"
                  alt="Exhibit C"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            <button
              onClick={() => setShowExhibitC(false)}
              aria-label="ปิดเอกสาร Exhibit C"
              className="murdle-button-primary mt-auto w-full text-xl uppercase tracking-widest sticky bottom-0"
            >
              ❌ ปิด
            </button>
          </div>
        </div>
      )}

      {/* Exhibit D Modal */}
      {showExhibitD && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowExhibitD(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="exhibit-d-title"
            className="murdle-modal p-6 max-w-4xl max-h-[90vh] overflow-y-auto w-full flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="exhibit-d-title" className="text-2xl sm:text-3xl font-bold text-black mb-2 border-b-[4px] border-black pb-2 text-center w-full uppercase tracking-widest font-mono">
              Exhibit D: แผนผังประกอบคดี
            </h3>
            <p className="text-black text-sm sm:text-base font-bold text-center mb-6">
              ใช้แผนผังนี้เพื่อระบุตำแหน่งที่ตั้งและทิศทางของสถานที่ต่างๆ ในคดี
            </p>

            <div className="mb-6 flex justify-center w-full relative h-[50vh] sm:h-[60vh] md:h-[70vh]">
              <div className="relative w-full h-full border-[3px] border-black shadow-[4px_4px_0_#1DACD6] bg-white overflow-hidden">
                <Image
                  src="/Exhibit D.webp"
                  alt="Exhibit D"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowExhibitD(false)}
              aria-label="ปิดเอกสาร Exhibit D"
              className="murdle-button-primary mt-auto w-full text-xl uppercase tracking-widest sticky bottom-0"
            >
              ❌ ปิด
            </button>
          </div>
        </div>
      )}

      {/* Decrypter Modal */}
      {showDecrypter && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowDecrypter(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="decrypter-title"
            className="murdle-modal max-w-md w-full p-6 flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="decrypter-title" className="murdle-section-title text-black mb-4 border-b-[4px] border-black pb-2 flex items-center gap-2">
              <span className="text-3xl">🧮</span> เครื่องมือถอดรหัส
            </h3>

            <div className="mb-6">
              <label className="block text-black font-bold mb-2 uppercase tracking-widest text-sm">ใส่รหัสลับที่นี่:</label>
              <textarea
                className="murdle-input h-24 font-bold"
                placeholder="เช่น ZTVMG..."
                value={cipherInput}
                onChange={(e) => setCipherInput(e.target.value)}
              />
            </div>

            <div className="space-y-4 mb-8">
              <div className="murdle-card-compact !border-[2px] !p-3 !shadow-[2px_2px_0_#1DACD6]">
                <div className="text-[10px] bg-murdle-accent text-white px-2 py-1 inline-block font-bold uppercase tracking-widest mb-2 border border-black">Next Letter Code (ขยับอักษร +1)</div>
                <div className="font-mono text-murdle-accent font-bold break-words min-h-[1.5rem]">
                  {cipherInput.split('').map((char, idx) => {
                    if (/[a-zA-Z]/.test(char)) {
                      const isUpper = char === char.toUpperCase();
                      const code = char.charCodeAt(0);
                      const base = isUpper ? 65 : 97;
                      return <span key={idx}>{String.fromCharCode(base + ((code - base + 1) % 26))}</span>;
                    }
                    return <span key={idx}>{char}</span>;
                  })}
                  {!cipherInput && '-'}
                </div>
              </div>

              <div className="murdle-card-compact !border-[2px] !p-3 !shadow-[2px_2px_0_#1DACD6]">
                <div className="text-[10px] bg-murdle-accent text-white px-2 py-1 inline-block font-bold uppercase tracking-widest mb-2 border border-black">Atbash (A=Z, Z=A)</div>
                <div className="font-mono text-murdle-accent font-bold break-words min-h-[1.5rem]">
                  {cipherInput.split('').map((char, idx) => {
                    if (/[a-zA-Z]/.test(char)) {
                      const isUpper = char === char.toUpperCase();
                      const code = char.charCodeAt(0);
                      const base = isUpper ? 65 : 97;
                      return <span key={idx}>{String.fromCharCode(base + (25 - (code - base)))}</span>;
                    }
                    return <span key={idx}>{char}</span>;
                  })}
                  {!cipherInput && '-'}
                </div>
              </div>

              <div className="murdle-card-compact !border-[2px] !p-3 !shadow-[2px_2px_0_#1DACD6]">
                <div className="text-[10px] bg-murdle-accent text-white px-2 py-1 inline-block font-bold uppercase tracking-widest mb-2 border border-black">Smart Anagram (ค้นหาคำศัพท์)</div>
                <div className="font-mono font-bold break-words min-h-[1.5rem] flex flex-wrap gap-1">
                  {cipherInput.split(/\s+/).map((word, idx) => {
                    const cleanWord = word.replace(/[^a-zA-Z]/g, '');
                    if (!cleanWord) return <span key={idx} className="text-black">{word}</span>;

                    const sorted = cleanWord.toLowerCase().split('').sort().join('');
                    const matched = (anagramDict as Record<string, string>)[sorted];

                    return matched
                      ? <span key={idx} className="text-black bg-murdle-success px-1 border border-green-600">{matched}</span>
                      : <span key={idx} className="text-murdle-accent">{sorted}</span>;
                  })}
                  {!cipherInput && '-'}
                </div>
                <div className="text-[10px] text-murdle-muted mt-2 font-bold leading-tight">
                  <span className="text-black">สีเขียว:</span> เจอคำศัพท์ในฐานข้อมูล <br/>
                  <span className="text-murdle-accent">สีฟ้า:</span> ไม่เจอคำศัพท์ (เรียง A-Z ให้เฉยๆ)
                </div>
              </div>
            </div>

            <button
              onClick={() => { setShowDecrypter(false); setCipherInput(''); }}
              aria-label="ปิดเครื่องมือถอดรหัส"
              className="murdle-button-primary w-full text-lg uppercase tracking-widest"
            >
              ❌ ปิด
            </button>
          </div>
        </div>
      )}


      {/* Manual Clipboard Fallback Modal */}
      {manualCopyText && (
        <div className="fixed inset-0 bg-black/80 z-[110] flex items-center justify-center p-4" onClick={() => setManualCopyText('')}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="manual-copy-title"
            className="murdle-modal p-6 max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="manual-copy-title" className="text-xl font-bold text-black mb-3 border-b-[4px] border-black pb-2">คัดลอกด้วยตนเอง</h3>
            <p className="text-sm font-bold mb-3">เบราว์เซอร์ไม่อนุญาตให้คัดลอกอัตโนมัติ กรุณาเลือกข้อความด้านล่างแล้วคัดลอกเอง</p>
            <textarea
              className="murdle-input h-56 text-sm"
              value={manualCopyText}
              readOnly
              onFocus={(e) => e.currentTarget.select()}
              aria-label="ข้อความสำหรับคัดลอกด้วยตนเอง"
            />
            <button
              onClick={() => setManualCopyText('')}
              className="murdle-button-primary mt-4 w-full text-lg uppercase tracking-widest"
            >
              ปิด
            </button>
          </div>
        </div>
      )}

      {/* Smart Legend Modal */}
      {selectedLegendCategory && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4" onClick={() => setSelectedLegendCategory(null)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="legend-modal-title"
            className="murdle-modal p-6 max-w-sm w-full relative max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedLegendCategory(null)}
              aria-label="ปิดคำอธิบายสัญลักษณ์"
              className="absolute top-2 right-2 p-2 text-2xl font-bold hover:text-murdle-accent transition-colors"
            >
              ❌
            </button>
            <h3 id="legend-modal-title" className="murdle-section-title text-black mb-4 border-b-[4px] border-black pb-2 uppercase tracking-widest text-center">
              {selectedLegendCategory.name}
            </h3>
            <div className="overflow-y-auto pr-2 flex flex-col gap-3 custom-scrollbar">
              {selectedLegendCategory.items.map((item, idx) => (
                <div key={idx} className="murdle-card-compact !border-[2px] !p-3 flex items-center gap-3">
                  <i
                    className={`${getIconClass(selectedLegendCategory.id, item)} text-2xl [text-shadow:2px_2px_0_#000] max-md:[text-shadow:none]`}
                    style={{ color: getIconColor(idx, String(levelData.id), selectedLegendCategory.id) }}
                  ></i>
                  <span className="font-bold text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
