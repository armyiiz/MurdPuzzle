"use client";

import React, { useState, useEffect } from 'react';
import { LevelData, Category } from '../types/level';
import { useGameLogic } from '../hooks/useGameLogic';
import { LogicGrid } from '../components/LogicGrid';
import { allCases } from '../data/allCases';
import { getCategoryEmoji } from '../utils/emojiHelper';

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
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-24">
      <header className="bg-slate-800 text-white p-4 shadow-md sticky top-0 z-10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {screen !== 'MENU' && (
            <button onClick={handleBack} className="p-2 hover:bg-slate-700 rounded-full transition-colors text-xl">
              ⬅️
            </button>
          )}
          <h1 className="text-xl font-bold">🕵️‍♂️ แฟ้มคดีปริศนา โลจิโก</h1>
        </div>
        {screen !== 'MENU' && (
          <button onClick={() => setScreen('MENU')} className="text-xs bg-slate-700 px-3 py-1 rounded hover:bg-slate-600 transition-colors">
            หน้าหลัก
          </button>
        )}
      </header>

      <main className="max-w-6xl mx-auto mt-6 px-4">
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
      <h1 className="text-4xl font-extrabold text-slate-800 mb-8 tracking-tight text-center">🕵️‍♂️ คดีฆาตกรรมปริศนา <br/> ฉบับภาษาไทย</h1>
      <button onClick={() => setScreen('LEVEL_SELECT')} className="bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-4 px-12 rounded-full shadow-lg transition transform hover:scale-105 active:scale-95">
        เริ่มไขคดี
      </button>
    </div>
  );
}

function LevelSelect({ setScreen, setSelectedLevel }: { setScreen: (s: ScreenState) => void, setSelectedLevel: (l: number) => void }) {
  const levels = [
    { id: 1, name: "ระดับ 1: มือใหม่หัดสืบ", desc: "ตาราง 3x3 คดีตรงไปตรงมา" },
    { id: 2, name: "ระดับ 2: นักสืบฝึกหัด", desc: "ตาราง 3x3 มีคนโกหก 1 คน" },
    { id: 3, name: "ระดับ 3: ยอดนักสืบ", desc: "ตาราง 4x4 เพิ่มแรงจูงใจ" },
    { id: 4, name: "ระดับ 4: ปรมาจารย์", desc: "ตาราง 4x4 มีคนโกหก 1 คน" },
  ];

  return (
    <div className="animate-fadeIn">
      <h2 className="text-2xl font-bold mb-6 text-center">เลือกระดับความยาก</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {levels.map(l => (
          <button key={l.id} onClick={() => { setSelectedLevel(l.id); setScreen('CASE_SELECT'); }} 
            className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-slate-200 text-left transition hover:border-blue-400">
            <h3 className="text-xl font-bold text-slate-800">{l.name}</h3>
            <p className="text-slate-500 mt-2 text-sm">{l.desc}</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cases.map((c: LevelData) => {
          const isSolved = solvedCases.includes(c.id);
          return (
            <button key={c.id} onClick={() => { setSelectedCase(c); setScreen('GAME'); }} 
              className={`p-5 rounded-2xl shadow-sm border text-left flex flex-col justify-between h-full transition ${isSolved ? 'bg-green-50 border-green-300' : 'bg-white hover:border-blue-400'}`}>
              <div>
                <h3 className="font-bold text-lg leading-tight">{c.level_name}</h3>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 rounded text-slate-500 uppercase tracking-wider">Case ID: {c.id}</span>
                </div>
              </div>
              {isSolved && <div className="mt-4 text-green-600 font-bold self-end flex items-center gap-1">✅ สำเร็จ</div>}
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
  const [notes, setNotes] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'suspects' | 'weapons' | 'locations' | 'motives'>('suspects');

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

  return (
    <div className="animate-fadeIn max-w-4xl mx-auto relative pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-slate-800">{levelData.level_name}</h2>
      </div>

      {activeView === 'clues' && (
        <div className="animate-in fade-in duration-300">
          <div className="bg-white p-5 rounded-2xl shadow-sm border-l-8 border-slate-800 italic mb-8 text-lg text-slate-700 leading-relaxed">
            {levelData.story_intro}
          </div>

          {/* แฟ้มประวัติ Profiles (Tab System) */}
          {levelData.profiles && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">📋 ข้อมูลเพิ่มเติม</h3>

              <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-100 pb-2">
                {Object.keys(levelData.profiles).map(key => {
                  const items = (levelData.profiles as any)[key];
                  if (!items || items.length === 0) return null;
                  const isActive = activeTab === key;
                  const label = key === 'suspects' ? '👤 ผู้ต้องสงสัย' : key === 'weapons' ? '🔪 อาวุธ' : key === 'locations' ? '📍 สถานที่' : '❓ แรงจูงใจ';

                  return (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key as any)}
                      className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                        isActive ? 'bg-slate-800 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(levelData.profiles as any)[activeTab]?.map((item: any, index: number) => (
                  <div key={item.name} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2">
                    <div className="font-bold text-slate-800 border-b pb-2 flex items-center gap-3 text-lg">
                      {getCategoryEmoji(activeTab, index)}
                      <span>{item.name}</span>
                    </div>
                    <div className="text-slate-600 text-sm leading-relaxed mt-1">{item.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clues & Testimonies */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
              <h3 className="text-xl font-bold mb-5 border-b pb-2 flex items-center gap-2">🔍 เบาะแส (Facts)</h3>
              <ul className="space-y-4">
                {levelData.clues.map((clue, idx) => (
                  <li key={idx} className="flex gap-4 items-start text-slate-700">
                    <span className="font-black text-slate-200 text-2xl leading-none">{idx + 1}</span>
                    <span className="leading-relaxed font-medium">{clue}</span>
                  </li>
                ))}
              </ul>
            </div>

            {levelData.testimonies && levelData.testimonies.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6 border-l-8 border-red-500 border border-slate-200">
                <h3 className="text-xl font-bold mb-5 border-b pb-2 text-red-700 flex items-center gap-2">🗣️ คำให้การ (Testimonies)</h3>
                <ul className="space-y-4">
                  {levelData.testimonies.map((t, idx) => {
                    const state = testimonyStates[idx] || 0;
                    return (
                      <li key={idx} className="bg-slate-50 p-4 rounded-xl flex flex-col gap-3">
                        <div className="flex justify-between items-center border-b pb-2">
                          <span className="font-bold text-slate-800">{t.suspect}</span>
                          <button
                            onClick={() => setTestimonyStates({...testimonyStates, [idx]: (state + 1) % 3})}
                            className={`text-[10px] px-3 py-1 font-black rounded-full transition-all uppercase tracking-widest ${
                              state === 1 ? 'bg-green-500 text-white shadow-md' :
                              state === 2 ? 'bg-red-500 text-white shadow-md' :
                              'bg-slate-200 text-slate-500'
                            }`}
                          >
                            {state === 1 ? '✓ พูดจริง' : state === 2 ? '✗ โกหก' : 'สถานะ ?'}
                          </button>
                        </div>
                        <p className="text-slate-600 italic font-medium leading-relaxed">"{t.statement}"</p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          {/* Final Accusation */}
          <div className="bg-slate-900 text-white p-10 rounded-3xl shadow-2xl flex flex-col items-center">
            <h3 className="text-2xl font-black mb-8 tracking-[0.2em] uppercase text-blue-400">⚖️ สรุปรูปคดี (Accusation)</h3>
            <div className="flex flex-wrap items-center justify-center gap-6 text-xl mb-10">
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">คนร้าย</span>
                <select className="bg-slate-800 border-b-2 border-slate-600 p-2 outline-none focus:border-blue-500 transition-colors rounded-t text-sm" value={accusation.suspect} onChange={e => setAccusation({...accusation, suspect: e.target.value})}>
                  <option value="">- เลือกผู้ต้องสงสัย -</option>
                  {getOptions('suspects').map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>

              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">อาวุธ</span>
                <select className="bg-slate-800 border-b-2 border-slate-600 p-2 outline-none focus:border-blue-500 transition-colors rounded-t text-sm" value={accusation.weapon} onChange={e => setAccusation({...accusation, weapon: e.target.value})}>
                  <option value="">- เลือกอาวุธ -</option>
                  {getOptions('weapons').map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>

              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">สถานที่</span>
                <select className="bg-slate-800 border-b-2 border-slate-600 p-2 outline-none focus:border-blue-500 transition-colors rounded-t text-sm" value={accusation.location} onChange={e => setAccusation({...accusation, location: e.target.value})}>
                  <option value="">- เลือกสถานที่ -</option>
                  {getOptions('locations').map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>

              {hasMotives && (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">แรงจูงใจ</span>
                  <select className="bg-slate-800 border-b-2 border-slate-600 p-2 outline-none focus:border-blue-500 transition-colors rounded-t text-sm" value={accusation.motive} onChange={e => setAccusation({...accusation, motive: e.target.value})}>
                    <option value="">- เลือกแรงจูงใจ -</option>
                    {getOptions('motives').map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
              )}
            </div>

            <button onClick={handleCheckAnswer} className="bg-blue-600 hover:bg-blue-500 px-12 py-5 rounded-full font-black text-xl shadow-lg transition-transform hover:scale-105 active:scale-95 uppercase tracking-widest">
              ตรวจคำตอบ
            </button>

            {feedback.type && (
              <div className={`mt-8 w-full max-w-md px-6 py-4 rounded-2xl font-bold text-center text-lg animate-bounce shadow-xl ${feedback.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                {feedback.message}
              </div>
            )}
          </div>
        </div>
      )}

      {activeView === 'grid' && (
        <div className="animate-in fade-in duration-300">
          {/* Logic Grid */}
          <section className="bg-white shadow-sm border border-gray-200 mb-8 rounded-2xl overflow-hidden">
            <div className="bg-slate-50 p-3 text-[10px] text-slate-400 border-b text-center uppercase tracking-widest font-bold">
              คลิก 1 ครั้ง = ❌ | คลิก 2 ครั้ง = ⭕
            </div>
            <div className="overflow-x-auto p-4 flex justify-center">
              <LogicGrid categories={levelData.categories} getCellState={getCellState} toggleCell={toggleCell} />
            </div>
          </section>

          {/* Notepad Area */}
          <section className="bg-white shadow-sm border border-gray-200 mb-20 rounded-2xl overflow-hidden p-6">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">📝 สมุดโน้ต (Scratchpad)</h3>
            <textarea
              className="w-full h-32 p-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow resize-none"
              placeholder="จดบันทึกของคุณที่นี่..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
            ></textarea>
          </section>

          {/* Grid Action Menu */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-800 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-4">
            <button onClick={() => console.log('Hint clicked')} className="hover:scale-110 transition-transform flex flex-col items-center gap-1">
              <span className="text-xl">💡</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">คำใบ้</span>
            </button>
            <div className="w-px h-8 bg-slate-600"></div>
            <button onClick={() => saveGridState(testimonyStates, notes, levelData.id)} className="hover:scale-110 transition-transform flex flex-col items-center gap-1">
              <span className="text-xl">💾</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">บันทึก</span>
            </button>
            <div className="w-px h-8 bg-slate-600"></div>
            <button onClick={undo} disabled={!canUndo} className={`transition-transform flex flex-col items-center gap-1 ${canUndo ? 'hover:scale-110' : 'opacity-50 cursor-not-allowed'}`}>
              <span className="text-xl">♻️</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">ย้อน</span>
            </button>
            <div className="w-px h-8 bg-slate-600"></div>
            <button onClick={resetGrid} className="hover:scale-110 transition-transform flex flex-col items-center gap-1 text-red-400">
              <span className="text-xl">🗑️</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">ล้าง</span>
            </button>
          </div>
        </div>
      )}

      {/* Main View Toggle FAB */}
      <button
        onClick={() => setActiveView(activeView === 'clues' ? 'grid' : 'clues')}
        className="fixed bottom-6 right-6 z-50 rounded-full shadow-2xl p-4 bg-slate-800 text-white text-2xl hover:scale-110 transition-transform flex items-center justify-center w-14 h-14"
        aria-label={activeView === 'clues' ? "Switch to Grid" : "Switch to Clues"}
      >
        {activeView === 'clues' ? '📔' : '🔍'}
      </button>

    </div>
  );
}
