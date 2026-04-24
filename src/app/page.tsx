"use client";

import React, { useState, useEffect } from 'react';
import { LevelData, Category } from '../types/level';
import { getCategoryEmoji, extractEmojiAndText } from '../utils/emojiHelper';
import { useGameLogic } from '../hooks/useGameLogic';
import { LogicGrid } from '../components/LogicGrid';
import { allCases } from '../data/allCases';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { generateFlavorText } from '../utils/storyGenerator';

type ScreenState = 'MENU' | 'LEVEL_SELECT' | 'CASE_SELECT' | 'GAME';

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
          <h1 className="text-xl font-bold tracking-widest uppercase">🕵️‍♂️ แฟ้มลับ คดีปริศนา</h1>
        </div>
        {screen !== 'MENU' && (
          <button onClick={() => setScreen('MENU')} className="text-xs bg-white text-black px-3 py-1 border-[2px] border-black hover:bg-neo-accent hover:text-white transition-colors uppercase font-bold tracking-wider">
            หน้าหลัก
          </button>
        )}
      </header>

      <main className="max-w-6xl mx-auto mt-6">
        {screen === 'MENU' && <MainMenu setScreen={setScreen} />}
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
      <h1 className="text-4xl font-extrabold text-black mb-8 tracking-tight text-center">🕵️‍♂️ คดีฆาตกรรมปริศนา <br/> ฉบับภาษาไทย</h1>
      <button onClick={() => setScreen('LEVEL_SELECT')} className="bg-black text-white hover:bg-[#A30B37] hover:-translate-y-1 transition-all text-xl font-bold py-4 px-12 border-[3px] border-black shadow-[4px_4px_0_#222222]">
        เริ่มไขคดี
      </button>
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
      const killerProfile = levelData.profiles?.suspects?.find(s => s.name === correct.suspect);
      const confessionText = killerProfile?.confession ? `คำสารภาพ: "${killerProfile.confession}"` : "🎉 ยินดีด้วย! คุณไขคดีสำเร็จแล้ว!";

      setFeedback({ message: confessionText, type: 'success' });
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

              {/* Active Tab Content (Profile Cards) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {levelData.profiles && (levelData.profiles as any)[activeTab]?.map((item: any, index: number) => {
                  return (
                    <div key={item.name} className="bg-neo-notebook border-[3px] border-black shadow-[4px_4px_0_#222222] flex flex-row items-stretch h-full overflow-hidden">
                      <ImageWithFallback category={activeTab} index={index} itemName={item.name} />
                      <div className="p-3 flex flex-col justify-center flex-grow">
                        <div className="font-black text-black border-b-[2px] border-black mb-2 pb-2 text-lg flex items-center gap-2">
                          <span>{extractEmojiAndText(item.name).text}</span>
                        </div>
                        <div className="text-black text-sm leading-relaxed flex-grow">{item.detail}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Clues & Testimonies */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white border-[3px] border-black shadow-[4px_4px_0_#222222] p-6">
              <h3 className="text-xl font-bold mb-5 border-b-[3px] border-black pb-2 flex items-center gap-2 text-black">🔍 เบาะแส</h3>
              <ul className="space-y-4">
                {levelData.clues.map((clue, idx) => {
                  const clueText = typeof clue === 'string'
                    ? clue
                    : generateFlavorText(clue.subject, clue.relation, clue.object);
                    
                  return (
                    <li key={idx} className="flex gap-4 items-start text-black">
                      <span className="font-black text-black bg-white border-[2px] border-black px-2 py-1 text-xl leading-none shadow-[2px_2px_0_#222222]">{idx + 1}</span>
                      <span className="leading-relaxed font-bold">{clueText}</span>
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
                        <p className="text-black italic font-bold leading-relaxed">"{t.statement}"</p>
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
            <div className="overflow-x-auto py-4 px-0 flex justify-center bg-neo-bg">
              <LogicGrid categories={levelData.categories} getCellState={getCellState} toggleCell={toggleCell} />
            </div>
          </section>

          {/* Grid Action Menu */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black text-white px-6 py-3 border-[3px] border-black shadow-[4px_4px_0_#222222] flex items-center gap-4">
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

    </div>
  );
}
