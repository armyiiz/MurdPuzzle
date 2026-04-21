"use client";

import React, { useState, useEffect } from 'react';
import { LevelData, Category } from '../types/level';
import { useGameLogic } from '../hooks/useGameLogic';
import { LogicGrid } from '../components/LogicGrid';
import { allCases } from '../data/allCases';

type ScreenState = 'MENU' | 'LEVEL_SELECT' | 'CASE_SELECT' | 'GAME';

export default function Home() {
  const [screen, setScreen] = useState<ScreenState>('MENU');
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [selectedCase, setSelectedCase] = useState<LevelData | null>(null);
  const [solvedCases, setSolvedCases] = useState<string[]>([]);

  // โหลดข้อมูลเซฟเกม
  useEffect(() => {
    const saved = localStorage.getItem('solvedCases');
    if (saved) setSolvedCases(JSON.parse(saved));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-24">
      <header className="bg-slate-800 text-white p-4 shadow-md sticky top-0 z-10 flex justify-between items-center">
        <h1 className="text-xl font-bold">🕵️‍♂️ Murdle (TH)</h1>
        {screen !== 'MENU' && (
          <button onClick={() => setScreen('MENU')} className="text-sm bg-slate-700 px-3 py-1 rounded hover:bg-slate-600">
            กลับเมนูหลัก
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

// ------------------------------------------------------------------
// UI Components
// ------------------------------------------------------------------

function MainMenu({ setScreen }: { setScreen: (s: ScreenState) => void }) {
  return (
    <div className="flex flex-col items-center justify-center mt-20 space-y-6">
      <h1 className="text-4xl font-extrabold text-slate-800 mb-8 tracking-tight">แฟ้มคดีปริศนา โลจิโก</h1>
      <button onClick={() => setScreen('LEVEL_SELECT')} className="bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-4 px-12 rounded-lg shadow-lg transition transform hover:scale-105">
        เริ่มเล่น
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
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">เลือกระดับความยาก</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {levels.map(l => (
          <button key={l.id} onClick={() => { setSelectedLevel(l.id); setScreen('CASE_SELECT'); }} 
            className="bg-white p-6 rounded-lg shadow hover:shadow-md border border-slate-200 text-left transition">
            <h3 className="text-xl font-bold text-slate-800">{l.name}</h3>
            <p className="text-slate-500 mt-2">{l.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function CaseSelect({ level, setScreen, setSelectedCase, solvedCases }: { level: number, setScreen: (s: ScreenState) => void, setSelectedCase: (c: LevelData) => void, solvedCases: string[] }) {
  const cases = allCases[level] || [];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">คดีระดับที่ {level}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cases.map((c: LevelData) => {
          const isSolved = solvedCases.includes(c.id);
          return (
            <button key={c.id} onClick={() => { setSelectedCase(c); setScreen('GAME'); }} 
              className={`p-4 rounded-lg shadow border text-left flex flex-col justify-between h-full transition ${isSolved ? 'bg-green-50 border-green-300' : 'bg-white hover:border-blue-400'}`}>
              <div>
                <h3 className="font-bold text-lg">{c.level_name}</h3>
                <span className="text-xs font-semibold px-2 py-1 bg-slate-100 rounded mt-2 inline-block text-slate-600">ความยาก: {c.difficulty}</span>
              </div>
              {isSolved && <div className="mt-4 text-green-600 font-bold self-end text-xl">✅ ไขคดีแล้ว</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function GamePlay({ levelData, setSolvedCases, solvedCases }: { levelData: LevelData, setSolvedCases: any, solvedCases: string[] }) {
  const { getCellState, toggleCell } = useGameLogic(levelData.categories, []); 
  
  // State สำหรับคำให้การ (0 = ?, 1 = พูดจริง, 2 = โกหก)
  const [testimonyStates, setTestimonyStates] = useState<Record<number, number>>({});
  
  // State สำหรับฟอร์มสรุปคดี
  const [accusation, setAccusation] = useState({ suspect: '', weapon: '', location: '', motive: '' });
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | null }>({ message: '', type: null });

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
      setFeedback({ message: "❌ ลองใหม่อีกครั้ง! สรุปรูปคดีของคุณยังมีจุดผิดพลาดอยู่", type: 'error' });
      setTimeout(() => setFeedback({ message: '', type: null }), 3000);
    }
  };

  const getOptions = (catId: string) => levelData.categories.find(c => c.id === catId)?.items || [];

  return (
    <div className="animate-fadeIn">
      <h2 className="text-2xl font-bold mb-4">{levelData.level_name}</h2>
      
      {/* เนื้อเรื่อง */}
      <div className="bg-white p-4 rounded shadow-sm border-l-4 border-slate-800 italic mb-6">
        {levelData.story_intro}
      </div>

      {/* แฟ้มประวัติ Profiles */}
      {levelData.profiles && (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 mb-6">
          <h3 className="text-xl font-bold mb-4 border-b pb-2 flex items-center gap-2">
            📋 แฟ้มประวัติ (Profiles)
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(levelData.profiles).map(([key, items]) => (
              <div key={key} className="bg-slate-50 p-4 rounded-lg border border-slate-100 shadow-inner">
                <h4 className="font-extrabold text-blue-800 capitalize mb-3 pb-2 border-b border-slate-200 text-lg">
                  {key === 'suspects' ? 'ผู้ต้องสงสัย' : key === 'weapons' ? 'อาวุธ' : key === 'locations' ? 'สถานที่' : 'แรงจูงใจ'}
                </h4>
                <ul className="text-sm space-y-3 mt-2">
                  {items.map((item: any) => (
                    <li key={item.name} className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-start">
                      <span className="font-bold text-slate-700 bg-white px-3 py-1 rounded-md border border-slate-200 min-w-[150px] shrink-0 text-center shadow-sm">
                        {item.name}
                      </span>
                      <span className="text-slate-600 pt-1 leading-relaxed">
                        {item.detail}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ตาราง Logic Grid */}
      <section className="bg-white shadow-sm border border-gray-200 mb-6 overflow-x-auto">
        <LogicGrid categories={levelData.categories} getCellState={getCellState} toggleCell={toggleCell} />
      </section>

      {/* เบาะแส Clues */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-xl font-bold mb-4 border-b pb-2">🔍 เบาะแส (Clues)</h3>
        <ul className="space-y-2">
          {levelData.clues.map((clue, idx) => (
            <li key={idx} className="flex gap-3"><span className="font-bold text-slate-400">{idx + 1}.</span> <span>{clue}</span></li>
          ))}
        </ul>
      </div>

      {/* คำให้การ Testimonies */}
      {levelData.testimonies && levelData.testimonies.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-6 border-l-4 border-red-400">
          <h3 className="text-xl font-bold mb-4 border-b pb-2 text-red-700">🗣️ คำให้การ (มีคนโกหก 1 คน)</h3>
          <ul className="space-y-3">
            {levelData.testimonies.map((t, idx) => {
              const state = testimonyStates[idx] || 0;
              return (
                <li key={idx} className="flex flex-col sm:flex-row sm:items-center gap-3 bg-slate-50 p-2 rounded">
                  <button 
                    onClick={() => setTestimonyStates({...testimonyStates, [idx]: (state + 1) % 3})}
                    className={`px-3 py-1 font-bold rounded min-w-[80px] text-sm transition-colors ${state === 1 ? 'bg-green-500 text-white' : state === 2 ? 'bg-red-500 text-white' : 'bg-slate-300 text-slate-700'}`}
                  >
                    {state === 1 ? 'พูดจริง' : state === 2 ? 'โกหก' : '?'}
                  </button>
                  <div><span className="font-bold">{t.suspect}:</span> "{t.statement}"</div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* ฟอร์มสรุปรูปคดี Final Accusation */}
      <div className="bg-slate-100 border-2 border-slate-300 p-6 rounded-lg shadow-inner flex flex-col items-center mb-10">
        <h3 className="text-xl font-extrabold mb-4 text-slate-800 text-center">⚖️ สรุปรูปคดี</h3>
        <div className="flex flex-wrap items-center justify-center gap-3 text-lg font-medium text-slate-700">
          <span>คนร้ายคือ</span>
          <select className="p-2 border rounded shadow-sm bg-white" value={accusation.suspect} onChange={e => setAccusation({...accusation, suspect: e.target.value})}>
            <option value="">- ผู้ต้องสงสัย -</option>
            {getOptions('suspects').map(i => <option key={i} value={i}>{i}</option>)}
          </select>

          <span>ใช้</span>
          <select className="p-2 border rounded shadow-sm bg-white" value={accusation.weapon} onChange={e => setAccusation({...accusation, weapon: e.target.value})}>
            <option value="">- อาวุธ -</option>
            {getOptions('weapons').map(i => <option key={i} value={i}>{i}</option>)}
          </select>

          <span>ก่อเหตุที่</span>
          <select className="p-2 border rounded shadow-sm bg-white" value={accusation.location} onChange={e => setAccusation({...accusation, location: e.target.value})}>
            <option value="">- สถานที่ -</option>
            {getOptions('locations').map(i => <option key={i} value={i}>{i}</option>)}
          </select>

          {hasMotives && (
            <>
              <span>เพราะ</span>
              <select className="p-2 border rounded shadow-sm bg-white" value={accusation.motive} onChange={e => setAccusation({...accusation, motive: e.target.value})}>
                <option value="">- แรงจูงใจ -</option>
                {getOptions('motives').map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </>
          )}
        </div>

        <button onClick={handleCheckAnswer} className="mt-6 bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-8 rounded-lg shadow-lg text-lg transition transform hover:scale-105">
          ตรวจคำตอบ
        </button>

        {feedback.type && (
          <div className={`mt-4 w-full max-w-md px-6 py-4 rounded-lg font-bold text-center text-lg animate-pulse ${feedback.type === 'success' ? 'bg-green-100 text-green-800 border-2 border-green-400' : 'bg-red-100 text-red-800 border-2 border-red-400'}`}>
            {feedback.message}
          </div>
        )}
      </div>
    </div>
  );
}
