"use client";

import React, { useState, useEffect } from 'react';
import { LevelData, Category } from '../types/level';
import { getCategoryEmoji, extractEmojiAndText } from '../utils/emojiHelper';
import { useGameLogic } from '../hooks/useGameLogic';
import { LogicGrid } from '../components/LogicGrid';
import { allCases } from '../data/allCases';
import { ImageWithFallback } from '../components/ImageWithFallback';
import exhibitBData from '../data/ExhibitB.json';

type ScreenState = 'MENU' | 'HOW_TO_PLAY' | 'LEVEL_SELECT' | 'CASE_SELECT' | 'GAME';

export default function Home() {
  const [screen, setScreen] = useState<ScreenState>('MENU');
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [selectedCase, setSelectedCase] = useState<LevelData | null>(null);
  const [solvedCases, setSolvedCases] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('solvedCases');
    if (saved) setSolvedCases(JSON.parse(saved));
  }, []);

  // ฟังก์ชันจัดการปุ่มย้อนกลับตามลำดับ
  const handleBack = () => {
    if (screen === 'GAME') setScreen('CASE_SELECT');
    else if (screen === 'CASE_SELECT') setScreen('LEVEL_SELECT');
    else if (screen === 'LEVEL_SELECT') setScreen('MENU');
    else if (screen === 'HOW_TO_PLAY') setScreen('MENU');
  };

  return (
    <div className="min-h-screen bg-neo-bg text-black font-mono pb-24">
      <header className="bg-black text-white p-4 sticky top-0 z-10 flex justify-between items-center border-b-[3px] border-black shadow-[0_4px_0_#222222]">
        <div className="flex items-center gap-3">
          {screen !== 'MENU' && (
            <button onClick={handleBack} className="p-2 hover:text-neo-accent transition-colors text-xl font-bold">
              ⬅️
            </button>
          )}
          <h1 className="text-xl font-bold tracking-widest uppercase">🕵️‍♂️ ไขคดีปริศนา</h1>
        </div>
        {screen !== 'MENU' && (
          <button onClick={() => setScreen('MENU')} className="text-xs bg-white text-black px-3 py-1 border-[2px] border-black hover:bg-neo-accent hover:text-white transition-colors uppercase font-bold tracking-wider">
            หน้าหลัก
          </button>
        )}
      </header>

      <main className="max-w-6xl mx-auto mt-6">
        {screen === 'MENU' && <MainMenu setScreen={setScreen} />}
        {screen === 'HOW_TO_PLAY' && <HowToPlay />}
        {screen === 'LEVEL_SELECT' && <LevelSelect setScreen={setScreen} setSelectedLevel={setSelectedLevel} />}
        {screen === 'CASE_SELECT' && <CaseSelect level={selectedLevel} setScreen={setScreen} setSelectedCase={setSelectedCase} solvedCases={solvedCases} />}
        {screen === 'GAME' && selectedCase && <GamePlay levelData={selectedCase} setSolvedCases={setSolvedCases} solvedCases={solvedCases} />}
      </main>
    </div>
  );
}

function MainMenu({ setScreen }: { setScreen: (s: ScreenState) => void }) {
  return (
    <div className="flex flex-col items-center justify-center mt-20 space-y-6">
      <h1 className="text-4xl font-extrabold text-black mb-8 tracking-tight text-center">🕵️‍♂️ ไขคดีปริศนา <br/> ฉบับภาษาไทย</h1>
      <button onClick={() => setScreen('LEVEL_SELECT')} className="bg-black text-white hover:bg-[#A30B37] hover:-translate-y-1 transition-all text-xl font-bold py-4 px-12 border-[3px] border-black shadow-[4px_4px_0_#222222]">
        เริ่มไขคดี
      </button>
      <button onClick={() => setScreen('HOW_TO_PLAY')} className="bg-white text-black hover:bg-gray-100 hover:-translate-y-1 transition-all text-lg font-bold py-3 px-8 border-[3px] border-black shadow-[4px_4px_0_#222222]">
        วิธีการเล่น
      </button>
    </div>
  );
}

function HowToPlay() {
  return (
    <div className="animate-fadeIn max-w-4xl mx-auto pb-24 px-4">
      <div className="bg-white border-[3px] border-black shadow-[4px_4px_0_#222222] p-6 sm:p-8">
        <h2 className="text-3xl font-black mb-6 border-b-[4px] border-black pb-4 flex items-center gap-3 text-black">
          <span className="text-4xl">🔍</span> คู่มือการสืบสวน: วิธีไขคดี Murdle
        </h2>

        <p className="text-lg text-black font-bold mb-8 leading-relaxed">
          สวมบทเป็น <strong className="bg-yellow-200 px-2 py-1 border-[2px] border-black">&quot;นักสืบโลจิโก&quot;</strong> แล้วออกไปลากคอคนร้ายมาลงโทษ! ในแต่ละคดี คุณต้องไขปริศนาให้ได้ว่า <strong className="text-red-600">ใคร</strong> คือคนร้าย, ใช้ <strong className="text-red-600">อาวุธ</strong> ชิ้นไหน และลงมือที่ <strong className="text-red-600">สถานที่</strong> ใด
        </p>

        <section className="mb-10 bg-neo-notebook border-[3px] border-black p-6 shadow-[4px_4px_0_#222222]">
          <h3 className="text-xl font-bold mb-4 text-black border-b-[2px] border-black pb-2 inline-block">1. เครื่องมือทำมาหากิน: ตารางตรรกะ</h3>
          <p className="text-black mb-4 font-bold">หัวใจของเกมนี้คือการเชื่อมโยงข้อมูล 3 หมวดหมู่ (ผู้ต้องสงสัย, อาวุธ, สถานที่) เข้าด้วยกัน</p>
          <ul className="space-y-3 text-black font-bold list-disc list-inside marker:text-black">
            <li><strong>แตะ 1 ครั้ง (❌):</strong> เพื่อตัดความเป็นไปได้ทิ้ง (เมื่อมั่นใจว่า &quot;ไม่ใช่&quot;)</li>
            <li><strong>แตะ 2 ครั้ง (✅):</strong> เพื่อยืนยันความถูกต้อง (เมื่อมั่นใจว่า &quot;ใช่!&quot;)</li>
            <li className="mt-4 p-3 bg-red-100 border-[2px] border-black">
              <strong>🚨 กฎเหล็ก:</strong> ในหนึ่งแถวหรือคอลัมน์ จะมี ✅ ได้เพียงช่องเดียวเท่านั้น ถ้าคุณพี่ใส่ ✅ แล้ว ระบบจะช่วยตัดช่องอื่นในแถวนั้นเป็น ❌ ให้ทันทีค่ะ
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h3 className="text-2xl font-black mb-6 text-black border-b-[3px] border-black pb-2">2. ตัวอย่างประเภทคำใบ้และการตีความ</h3>
          <p className="text-black mb-6 font-bold">ใน Murdle คำใบ้จะไม่บอกตรงๆ เสมอไป คุณพี่ต้องหัดอ่านใจคนร้ายและสังเกตสิ่งแวดล้อม ดังนี้ค่ะ:</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border-[3px] border-black p-5 shadow-[4px_4px_0_#222222]">
              <h4 className="text-lg font-bold mb-3 text-black flex items-center gap-2"><span className="text-2xl">📌</span> คำใบ้จากประวัติ</h4>
              <p className="text-black mb-2">บางครั้งคำใบ้จะพูดถึง &quot;ลักษณะทางกายภาพ&quot; ของผู้ต้องสงสัย</p>
              <div className="bg-gray-100 p-3 border-[2px] border-black mb-2 text-sm italic">
                <strong>ตัวอย่าง:</strong> &quot;ผู้ต้องสงสัยที่ตัวสูงที่สุดไม่เคยเฉียดเข้าไปในตู้โดยสารท้ายขบวนเลย&quot;
              </div>
              <p className="text-black text-sm">
                <strong>วิธีคิด:</strong> เปิดดู Profile เพื่อเช็คส่วนสูง (เช่น รองประธานมอฟ สูง 5&#39;8&quot; ซึ่งสูงที่สุด) แล้วไปกา ❌ ที่ช่อง รองประธานมอฟ + ตู้โดยสารท้ายขบวน
              </p>
            </div>

            <div className="bg-white border-[3px] border-black p-5 shadow-[4px_4px_0_#222222]">
              <h4 className="text-lg font-bold mb-3 text-black flex items-center gap-2"><span className="text-2xl">📌</span> คำใบ้จากสถานที่และวัตถุพยาน</h4>
              <div className="bg-gray-100 p-3 border-[2px] border-black mb-2 text-sm italic">
                <strong>ตัวอย่าง:</strong> &quot;ศพถูกพบอยู่ภายในอ่างอาบน้ำหินอ่อน&quot;
              </div>
              <p className="text-black text-sm">
                <strong>วิธีคิด:</strong> มองหา &quot;สถานที่&quot; ที่มีอ่างอาบน้ำ (เช่น ห้องน้ำขนาดมหึมา) สถานที่นี้แหละคือ <strong>สถานที่เกิดเหตุจริง</strong> ของคดีนั้น!
              </p>
            </div>

            <div className="bg-white border-[3px] border-black p-5 shadow-[4px_4px_0_#222222]">
              <h4 className="text-lg font-bold mb-3 text-black flex items-center gap-2"><span className="text-2xl">📌</span> คำใบ้แบบ &quot;ถ้า...ไม่ใช่...ก็คือ...&quot;</h4>
              <div className="bg-gray-100 p-3 border-[2px] border-black mb-2 text-sm italic">
                <strong>ตัวอย่าง:</strong> &quot;ไม่เชือกก็ลูกดอกอาบยาพิษนี่แหละที่ถูกพบอยู่ใกล้กำแพงกราฟฟิตี้&quot;
              </div>
              <p className="text-black text-sm">
                <strong>วิธีคิด:</strong> ถ้าคุณพี่รู้จากคำใบ้อื่นแล้วว่าเชือกไม่ได้อยู่ที่นั่น แสดงว่าลูกดอกต้องอยู่ที่กำแพงกราฟฟิตี้แน่นอน
              </p>
            </div>

            <div className="bg-black text-white border-[3px] border-black p-5 shadow-[4px_4px_0_#A30B37]">
              <h4 className="text-lg font-bold mb-3 text-white flex items-center gap-2"><span className="text-2xl">📌</span> คำใบ้รหัสลับ - ระดับยาก!</h4>
              <p className="text-gray-300 mb-2">บางครั้งชมรมนักสืบจะส่งรหัสลับมาให้ ซึ่งมักจะเป็นรหัสแบบแทนที่ตัวอักษร หรือผสมคำในชุดเดียวกัน</p>
              <div className="bg-gray-800 p-3 border-[2px] border-gray-600 mb-2 text-sm font-mono text-green-400">
                <strong>ตัวอย่าง:</strong> &quot;ZTVMG RMP SZW Z NVWRFN-DVRTSG DVZKLM&quot;
              </div>
              <p className="text-gray-300 text-sm">
                <strong>วิธีคิด:</strong> เมื่อถอดรหัสออกมาจะได้ความว่า <em>&quot;AGENT INK HAD A MEDIUM-WEIGHT WEAPON&quot;</em> (เอเยนต์อิงค์พกอาวุธน้ำหนักปานกลาง) คุณพี่ต้องลองสังเกตตัวอักษรที่สลับกันดูนะคะ!
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10 bg-white border-[3px] border-black p-6 shadow-[4px_4px_0_#222222]">
          <h3 className="text-xl font-bold mb-4 text-black border-b-[2px] border-black pb-2 inline-block">3. ขั้นตอนการลงมือสืบ</h3>
          <ol className="space-y-4 text-black font-bold list-decimal list-inside marker:font-black marker:text-lg">
            <li className="pl-2 border-l-[3px] border-black mb-2"><strong className="text-lg">อ่านเนื้อเรื่อง:</strong> เพื่อหาจุดเริ่มต้น (เช่น พบศพที่ไหน หรือใครทำอะไรอยู่)</li>
            <li className="pl-2 border-l-[3px] border-black mb-2"><strong className="text-lg">เก็บข้อมูลประวัติ:</strong> ดูว่าใครสูงเท่าไหร่, ถนัดข้างไหน หรือตาสีอะไร ข้อมูลพวกนี้ใช้ร่วมกับคำใบ้ได้บ่อยมาก</li>
            <li className="pl-2 border-l-[3px] border-black mb-2"><strong className="text-lg">เติมตาราง:</strong> ค่อยๆ ไล่จากคำใบ้ที่ชัดเจนที่สุดไปหาจุดที่ซับซ้อน</li>
            <li className="pl-2 border-l-[3px] border-black mb-2"><strong className="text-lg">กล่าวหา:</strong> เมื่อตารางสมบูรณ์และได้ข้อสรุป &quot;ใคร-อะไร-ที่ไหน&quot; ที่เชื่อมโยงกันแล้ว ให้กดฟ้องศาลได้เลย!</li>
          </ol>
        </section>

        <section className="bg-neo-accent text-white p-6 border-[3px] border-black shadow-[4px_4px_0_#222222]">
          <h3 className="text-2xl font-black mb-3 flex items-center gap-2">✨ ทริคจากอลิซ:</h3>
          <p className="text-lg font-bold italic leading-relaxed">
            &quot;อย่าลืมดู <strong className="bg-black px-2 py-1">น้ำหนักอาวุธ</strong> (เบา, ปานกลาง, มาก) ในรายละเอียดอาวุธนะคะ บางคำใบ้จะบอกแค่น้ำหนัก ไม่บอกชื่ออาวุธโดยตรง เป็นจุดที่คนร้ายมักจะพลาดทิ้งร่องรอยไว้บ่อยๆ ค่ะ!&quot;
          </p>
        </section>

      </div>
    </div>
  );
}

function LevelSelect({ setScreen, setSelectedLevel }: { setScreen: (s: ScreenState) => void, setSelectedLevel: (l: number) => void }) {
  const levels = [
    { id: 1, name: "ระดับ 1: มือใหม่หัดสืบ", desc: "ผู้ต้องสงสัย 3 คน" },
    { id: 2, name: "ระดับ 2: นักสืบฝึกหัด", desc: "ผู้ต้องสงสัย 3 คน พร้อมคำให้การ แต่จะมี 1 คนที่โกหก" },
    { id: 3, name: "ระดับ 3: ยอดนักสืบ", desc: "ผู้ต้องสงสัย 4 คน พร้อมแรงจูงใจ" },
    { id: 4, name: "ระดับ 4: ปรมาจารย์", desc: "ผู้ต้องสงสัย 4 คน พร้อมแรงจูงใจและคำให้การ" },
  ];

  return (
    <div className="animate-fadeIn">
      <h2 className="text-2xl font-bold mb-6 text-center">เลือกระดับความยาก</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {levels.map(l => (
          <button key={l.id} onClick={() => { setSelectedLevel(l.id); setScreen('CASE_SELECT'); }} 
            className="bg-neo-notebook p-6 border-[3px] border-black shadow-[4px_4px_0_#222222] text-left transition hover:-translate-y-1">
            <h3 className="text-xl font-bold text-black">{l.name}</h3>
            <p className="text-black mt-2 text-sm">{l.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function CaseSelect({ level, setScreen, setSelectedCase, solvedCases }: { level: number, setScreen: (s: ScreenState) => void, setSelectedCase: (c: LevelData) => void, solvedCases: string[] }) {
  const cases = (allCases as any)[level] || [];

  return (
    <div className="animate-fadeIn">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">📂 รายการคดีระดับ {level}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cases.map((c: LevelData) => {
          const isSolved = solvedCases.includes(c.id);
          return (
            <button key={c.id} onClick={() => { setSelectedCase(c); setScreen('GAME'); }} 
              className={`p-5 border-[3px] border-black shadow-[4px_4px_0_#222222] text-left flex flex-col justify-between h-full transition hover:-translate-y-1 ${isSolved ? 'bg-green-200' : 'bg-neo-notebook'}`}>
              <div>
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

function GamePlay({ levelData, setSolvedCases, solvedCases }: { levelData: LevelData, setSolvedCases: any, solvedCases: string[] }) {
  const { getCellState, toggleCell, resetGrid, undo, saveGridState, loadGridState, canUndo } = useGameLogic(levelData.categories, []);
  const [testimonyStates, setTestimonyStates] = useState<Record<number, number>>({});
  const [accusation, setAccusation] = useState({ suspect: '', weapon: '', location: '', motive: '' });
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | null }>({ message: '', type: null });
  const [activeView, setActiveView] = useState<'clues' | 'grid'>('clues');
  const [activeTab, setActiveTab] = useState<'suspects' | 'weapons' | 'locations' | 'motives'>('suspects');
  const [notes, setNotes] = useState<string>('');
  const [cluesScrollY, setCluesScrollY] = useState(0);
  const [selectedProfileIndex, setSelectedProfileIndex] = useState<number | null>(null);
  const [showExhibitB, setShowExhibitB] = useState(false);

  useEffect(() => {
    const loaded = loadGridState(levelData.id);
    if (loaded) {
      setTestimonyStates(loaded.testimonyStates);
      setNotes(loaded.notes);
    }
  }, [levelData.id, loadGridState]);

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
            <h2 className="text-2xl font-bold text-black">{levelData.level_name}</h2>
          </div>

          <div className="bg-white p-5 border-[3px] border-black shadow-[4px_4px_0_#222222] italic mb-8 text-lg text-black leading-relaxed">
            {levelData.story_intro}
          </div>

          {/* แฟ้มประวัติ Profiles (Tabbed View) */}
          {levelData.profiles && (
            <div className="bg-white p-6 border-[3px] border-black shadow-[4px_4px_0_#222222] mb-8">
              <h3 className="text-lg font-bold mb-4 border-b-[3px] border-black pb-2 flex items-center gap-2 text-black uppercase tracking-widest">📋 ข้อมูลเพิ่มเติม</h3>

              {/* Tabs Row */}
              <div className="flex flex-wrap gap-2 mb-6">
                {(['suspects', 'weapons', 'locations', 'motives'] as const).map(tabKey => {
                  if (!levelData.profiles || !(levelData.profiles as any)[tabKey]) return null;
                  const isActive = activeTab === tabKey;
                  const label = tabKey === 'suspects' ? 'ผู้ต้องสงสัย' : tabKey === 'weapons' ? 'อาวุธ' : tabKey === 'locations' ? 'สถานที่' : 'แรงจูงใจ';

                  return (
                    <button
                      key={tabKey}
                      onClick={() => setActiveTab(tabKey)}
                      className={`px-4 py-2 border-[2px] border-black text-sm font-bold transition-colors flex items-center gap-2 tracking-wider
                        ${isActive ? 'bg-black text-white shadow-[2px_2px_0_#A30B37]' : 'bg-white text-black hover:bg-neo-notebook shadow-[2px_2px_0_#222222]'}
                      `}
                    >
                      {getCategoryEmoji(tabKey, 0)} {label}
                    </button>
                  );
                })}
              </div>

              {/* Active Tab Content (Mini-Tiles) */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {levelData.profiles && (levelData.profiles as any)[activeTab]?.map((item: any, index: number) => {
                  return (
                    <button
                      key={item.name}
                      onClick={() => setSelectedProfileIndex(index)}
                      className="bg-white border-[3px] border-black shadow-[4px_4px_0_#222222] hover:-translate-y-1 hover:shadow-[6px_6px_0_#222222] transition-all flex flex-col items-center justify-center p-3 aspect-square"
                    >
                      <div className="mb-2">
                        {getCategoryEmoji(activeTab, index, item.name, "text-3xl sm:text-4xl leading-none inline-block")}
                      </div>
                      <div className="font-black text-black text-xs text-center break-words w-full">
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
                className="bg-neo-notebook border-[3px] border-black shadow-[8px_8px_0_#222222] max-w-sm w-full p-6 flex flex-col items-center relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Content */}
                <div className="bg-white border-[3px] border-black shadow-[4px_4px_0_#222222] w-24 h-24 flex items-center justify-center mb-4">
                  {getCategoryEmoji(activeTab, selectedProfileIndex, (levelData.profiles as any)[activeTab][selectedProfileIndex].name, "text-5xl leading-none inline-block")}
                </div>

                <h3 className="text-2xl font-black text-black mb-4 border-b-[3px] border-black pb-2 text-center w-full">
                  {extractEmojiAndText((levelData.profiles as any)[activeTab][selectedProfileIndex].name).text}
                </h3>

                <p className="text-black text-base leading-relaxed mb-8 w-full">
                  {(levelData.profiles as any)[activeTab][selectedProfileIndex].detail}
                </p>

                {/* Navigation Buttons */}
                <div className="flex justify-between w-full mb-4">
                  <button
                    onClick={() => {
                      const total = (levelData.profiles as any)[activeTab].length;
                      setSelectedProfileIndex((selectedProfileIndex - 1 + total) % total);
                    }}
                    className="bg-white border-[3px] border-black text-black px-4 py-2 font-bold shadow-[4px_4px_0_#222222] hover:bg-gray-100 hover:-translate-y-1 transition-all"
                  >
                    ⬅️ ก่อนหน้า
                  </button>
                  <button
                    onClick={() => {
                      const total = (levelData.profiles as any)[activeTab].length;
                      setSelectedProfileIndex((selectedProfileIndex + 1) % total);
                    }}
                    className="bg-white border-[3px] border-black text-black px-4 py-2 font-bold shadow-[4px_4px_0_#222222] hover:bg-gray-100 hover:-translate-y-1 transition-all"
                  >
                    ถัดไป ➡️
                  </button>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setSelectedProfileIndex(null)}
                  className="bg-black text-white w-full border-[3px] border-black py-3 font-black text-lg shadow-[4px_4px_0_#222222] hover:bg-neo-accent hover:-translate-y-1 transition-all uppercase tracking-widest"
                >
                  ❌ ปิด
                </button>
              </div>
            </div>
          )}

          {/* Clues & Testimonies */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white border-[3px] border-black shadow-[4px_4px_0_#222222] p-6">
              <h3 className="text-xl font-bold mb-5 border-b-[3px] border-black pb-2 flex items-center gap-2 text-black">🔍 เบาะแส</h3>
              <ul className="space-y-4">
                {levelData.clues.map((clue, idx) => {
                  return (
                    <li key={idx} className="flex gap-4 items-start text-black">
                      <span className="font-black text-black bg-white border-[2px] border-black px-2 py-1 text-xl leading-none shadow-[2px_2px_0_#222222]">{idx + 1}</span>
                      <span className="leading-relaxed font-bold">{clue}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {levelData.testimonies && levelData.testimonies.length > 0 && (
              <div className="bg-white border-[3px] border-black shadow-[4px_4px_0_#222222] p-6 border-l-[8px] border-l-neo-accent">
                <h3 className="text-xl font-bold mb-5 border-b-[3px] border-black pb-2 text-neo-accent flex items-center gap-2">🗣️ คำให้การ</h3>
                <ul className="space-y-4">
                  {levelData.testimonies.map((t, idx) => {
                    const state = testimonyStates[idx] || 0;
                    return (
                      <li key={idx} className="bg-neo-notebook p-4 border-[2px] border-black flex flex-col gap-3 shadow-[2px_2px_0_#222222]">
                        <div className="flex justify-between items-center border-b-[2px] border-black pb-2">
                          <span className="font-bold text-black">{t.suspect}</span>
                          <button
                            onClick={() => setTestimonyStates({...testimonyStates, [idx]: (state + 1) % 3})}
                            className={`text-[10px] px-3 py-1 font-black border-[2px] border-black transition-all uppercase tracking-widest ${
                              state === 1 ? 'bg-green-400 text-black shadow-[2px_2px_0_#222222]' :
                              state === 2 ? 'bg-neo-accent text-white shadow-[2px_2px_0_#222222]' :
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
          <div className="bg-neo-notebook text-black p-10 border-[3px] border-black shadow-[4px_4px_0_#222222] flex flex-col items-center">
            <h3 className="text-2xl font-black mb-8 tracking-[0.2em] uppercase text-neo-accent">⚖️ สรุปรูปคดี</h3>
            <div className="flex flex-wrap items-center justify-center gap-6 text-xl mb-10">
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-black tracking-widest bg-white border-2 border-black px-2">คนร้าย</span>
                <select className="bg-white border-[3px] border-black p-2 outline-none focus:border-neo-accent transition-colors text-sm text-black" value={accusation.suspect} onChange={e => setAccusation({...accusation, suspect: e.target.value})}>
                  <option value="">- เลือกผู้ต้องสงสัย -</option>
                  {getOptions('suspects').map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>

              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-black tracking-widest bg-white border-2 border-black px-2">อาวุธ</span>
                <select className="bg-white border-[3px] border-black p-2 outline-none focus:border-neo-accent transition-colors text-sm text-black" value={accusation.weapon} onChange={e => setAccusation({...accusation, weapon: e.target.value})}>
                  <option value="">- เลือกอาวุธ -</option>
                  {getOptions('weapons').map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>

              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-black tracking-widest bg-white border-2 border-black px-2">สถานที่</span>
                <select className="bg-white border-[3px] border-black p-2 outline-none focus:border-neo-accent transition-colors text-sm text-black" value={accusation.location} onChange={e => setAccusation({...accusation, location: e.target.value})}>
                  <option value="">- เลือกสถานที่ -</option>
                  {getOptions('locations').map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>

              {hasMotives && (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-black tracking-widest bg-white border-2 border-black px-2">แรงจูงใจ</span>
                  <select className="bg-white border-[3px] border-black p-2 outline-none focus:border-neo-accent transition-colors text-sm text-black" value={accusation.motive} onChange={e => setAccusation({...accusation, motive: e.target.value})}>
                    <option value="">- เลือกแรงจูงใจ -</option>
                    {getOptions('motives').map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
              )}
            </div>

            <button onClick={handleCheckAnswer} className="bg-black hover:bg-neo-accent text-white px-12 py-5 font-black text-xl border-[3px] border-black shadow-[4px_4px_0_#222222] transition-transform hover:-translate-y-1 uppercase tracking-widest">
              ตรวจคำตอบ
            </button>

            {feedback.type && (
              <div className={`mt-8 w-full max-w-md px-6 py-4 font-bold text-center text-lg shadow-[4px_4px_0_#222222] border-[3px] border-black ${feedback.type === 'success' ? 'bg-green-400 text-black' : 'bg-red-500 text-white'}`}>
                {feedback.message}
              </div>
            )}
          </div>
        </div>
      )}

      {activeView === 'grid' && (
        <div className="animate-in fade-in duration-300">
          {/* Logic Grid */}
          <section className="bg-white border-[3px] border-black shadow-[4px_4px_0_#222222] mb-8 overflow-hidden">
            <div className="bg-neo-notebook p-3 text-[10px] text-black border-b-[3px] border-black text-center uppercase tracking-widest font-bold">
              คลิก 1 ครั้ง = ❌ | คลิก 2 ครั้ง = ⭕
            </div>
            <div className="overflow-x-auto p-0 flex justify-center bg-neo-bg">
              <LogicGrid categories={levelData.categories} getCellState={getCellState} toggleCell={toggleCell} />
            </div>
          </section>

          {/* Grid Action Menu */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black text-white px-6 py-3 border-[3px] border-black shadow-[4px_4px_0_#222222] flex items-center gap-4">
            {levelData.difficulty >= 2 && (
              <>
                <button onClick={() => setShowExhibitB(true)} className="hover:text-neo-accent transition-colors flex flex-col items-center gap-1">
                  <span className="text-xl">📖</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Exhibit B</span>
                </button>
                <div className="w-[3px] h-8 bg-white"></div>
              </>
            )}
            <button onClick={() => console.log('Hint clicked')} className="hover:text-neo-accent transition-colors flex flex-col items-center gap-1">
              <span className="text-xl">💡</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">คำใบ้</span>
            </button>
            <div className="w-[3px] h-8 bg-white"></div>
            <button onClick={() => saveGridState(testimonyStates, notes, levelData.id)} className="hover:text-neo-accent transition-colors flex flex-col items-center gap-1">
              <span className="text-xl">💾</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">บันทึก</span>
            </button>
            <div className="w-[3px] h-8 bg-white"></div>
            <button onClick={undo} disabled={!canUndo} className={`transition-colors flex flex-col items-center gap-1 ${canUndo ? 'hover:text-neo-accent' : 'opacity-50 cursor-not-allowed'}`}>
              <span className="text-xl">♻️</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">ย้อน</span>
            </button>
            <div className="w-[3px] h-8 bg-white"></div>
            <button onClick={resetGrid} className="hover:text-neo-accent transition-colors flex flex-col items-center gap-1 text-neo-accent">
              <span className="text-xl">🗑️</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">ล้าง</span>
            </button>
          </div>
        </div>
      )}

      {/* Main View Toggle FAB */}
      <button
        onClick={handleToggleView}
        className="fixed bottom-6 right-6 z-50 border-[3px] border-black shadow-[4px_4px_0_#222222] p-4 bg-black text-white text-2xl hover:bg-neo-accent transition-colors flex items-center justify-center w-14 h-14"
        aria-label={activeView === 'clues' ? "Switch to Grid" : "Switch to Clues"}
      >
        {activeView === 'clues' ? '📔' : '🔍'}
      </button>

      {/* Exhibit B Modal */}
      {showExhibitB && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowExhibitB(false)}>
          <div
            className="bg-neo-notebook border-[3px] border-black shadow-[8px_8px_0_#222222] max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl sm:text-3xl font-black text-black mb-2 border-b-[4px] border-black pb-2 text-center w-full uppercase tracking-widest">
              {exhibitBData.exhibit_b.title_th}
            </h3>
            <p className="text-black text-sm sm:text-base font-bold text-center mb-6">
              {exhibitBData.exhibit_b.description}
            </p>

            {/* Astrological Primer */}
            <div className="mb-8">
              <h4 className="text-xl font-bold mb-4 bg-black text-white inline-block px-4 py-1 border-[2px] border-black shadow-[4px_4px_0_#222222]">
                ✨ จักรราศี
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {Object.values(exhibitBData.exhibit_b.zodiac_signs).map((sign: any) => (
                  <div key={sign.name_en} className="bg-white border-[3px] border-black shadow-[4px_4px_0_#222222] p-3 flex flex-col items-center text-center">
                    <span className="text-4xl mb-2">{sign.symbol}</span>
                    <span className="font-black text-black text-sm">{sign.name_th}</span>
                    <span className="text-xs font-bold bg-gray-200 px-2 py-0.5 mt-1 border border-black">{sign.element_th}</span>
                    <span className="text-[10px] mt-2 font-bold">{sign.dates_th}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Alchemical Symbols */}
            <div className="mb-6">
              <h4 className="text-xl font-bold mb-4 bg-black text-white inline-block px-4 py-1 border-[2px] border-black shadow-[4px_4px_0_#222222]">
                ⚗️ สัญลักษณ์การเล่นแร่แปรธาตุ
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {Object.values(exhibitBData.exhibit_b.alchemical_symbols).map((symbol: any) => (
                  <div key={symbol.name_en} className="bg-white border-[3px] border-black shadow-[2px_2px_0_#222222] p-2 flex flex-col items-center text-center">
                    <span className="text-3xl mb-1">{symbol.symbol}</span>
                    <span className="font-black text-black text-[10px] sm:text-xs leading-tight">{symbol.name_th}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowExhibitB(false)}
              className="mt-auto bg-black text-white w-full border-[3px] border-black py-4 font-black text-xl shadow-[4px_4px_0_#222222] hover:bg-neo-accent hover:-translate-y-1 transition-all uppercase tracking-widest sticky bottom-0"
            >
              ❌ ปิดเอกสาร
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
