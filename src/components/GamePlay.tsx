/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect, react-hooks/purity */
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { LevelData } from '../types/level';
import { getCategoryEmoji, extractEmojiAndText } from '../utils/emojiHelper';
import { useGameLogic } from '../hooks/useGameLogic';
import { LogicGrid } from './LogicGrid';
import exhibitBData from '../data/ExhibitB.json';

export function GamePlay({ levelData, onSolve, isSolved }: { levelData: LevelData, onSolve: (attempts: number, timeInSeconds: number) => void, isSolved?: boolean }) {
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
  const [showExhibitC, setShowExhibitC] = useState(false);
  const [showExhibitD, setShowExhibitD] = useState(false);

  // Stats tracking
  const [attempts, setAttempts] = useState(0);
  const [startTime] = useState(Date.now());
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const loaded = loadGridState(levelData.id);
    if (loaded) {
      setTestimonyStates(loaded.testimonyStates);
      setNotes(loaded.notes);
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

  useEffect(() => {
    if (isSolved) return;
    const interval = setInterval(() => {
       setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [isSolved, startTime]);

  const hasMotives = levelData.categories.some(c => c.id === 'motives');

  const handleCheckAnswer = () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    const correct = levelData.correct_accusation;
    const isCorrect =
      accusation.suspect === correct.suspect &&
      accusation.weapon === correct.weapon &&
      accusation.location === correct.location &&
      (!hasMotives || accusation.motive === correct.motive);

    if (isCorrect) {
      setFeedback({ message: "🎉 ยินดีด้วย! คุณไขคดีสำเร็จแล้ว!", type: 'success' });
      onSolve(newAttempts, timeElapsed);
    } else {
      setFeedback({ message: "❌ สรุปรูปคดีของคุณยังไม่ถูกต้อง ลองทบทวนเบาะแสอีกครั้งนะ", type: 'error' });
      setTimeout(() => setFeedback({ message: '', type: null }), 3000);
    }
  };

  const getOptions = (catId: string) => levelData.categories.find(c => c.id === catId)?.items || [];

  const handleToggleView = () => {
    if (activeView === 'clues') {
      setCluesScrollY(window.scrollY);
      setActiveView('grid');
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      setActiveView('clues');
      setTimeout(() => {
        window.scrollTo({ top: cluesScrollY, behavior: 'instant' });
      }, 10);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="animate-fadeIn max-w-4xl mx-auto relative pb-24">
      {activeView === 'clues' && (
        <div className="animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-black">{levelData.level_name}</h2>
            <div className="bg-white border-[2px] border-black px-3 py-1 font-bold shadow-[2px_2px_0_#000]">
              ⏱️ {formatTime(timeElapsed)}
            </div>
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
              <div className="flex items-center justify-between mb-5 border-b-[3px] border-black pb-2">
                <h3 className="text-xl font-bold flex items-center gap-2 text-black">🔍 เบาะแส</h3>
                {levelData.difficulty === 2 && (
                  <button onClick={() => setShowExhibitB(true)} className="ml-auto bg-neo-accent text-white px-3 py-1 text-sm font-bold border-[2px] border-black shadow-[2px_2px_0_#222222] hover:-translate-y-0.5 transition-transform flex items-center gap-1">
                    📖 คู่มือ Exhibit B
                  </button>
                )}
                {levelData.difficulty === 3 && (
                  <button onClick={() => setShowExhibitC(true)} className="ml-auto bg-neo-accent text-white px-3 py-1 text-sm font-bold border-[2px] border-black shadow-[2px_2px_0_#222222] hover:-translate-y-0.5 transition-transform flex items-center gap-1">
                    📖 คู่มือ Exhibit C
                  </button>
                )}
                {levelData.difficulty === 4 && (
                  <button onClick={() => setShowExhibitD(true)} className="ml-auto bg-neo-accent text-white px-3 py-1 text-sm font-bold border-[2px] border-black shadow-[2px_2px_0_#222222] hover:-translate-y-0.5 transition-transform flex items-center gap-1">
                    📖 แผนผัง Exhibit D
                  </button>
                )}
              </div>
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

            <button onClick={handleCheckAnswer} disabled={isSolved} className={`bg-black text-white px-12 py-5 font-black text-xl border-[3px] border-black shadow-[4px_4px_0_#222222] transition-transform uppercase tracking-widest ${isSolved ? 'opacity-50' : 'hover:bg-neo-accent hover:-translate-y-1'}`}>
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
        <div className="fixed inset-0 top-[65px] bottom-0 overflow-hidden flex flex-col items-center justify-center bg-neo-bg z-0 animate-in fade-in duration-300">
          {/* Logic Grid */}
          <section className="bg-white border-[3px] border-black shadow-[4px_4px_0_#222222] overflow-hidden mb-24 max-h-[calc(100vh-180px)] flex flex-col w-full max-w-3xl">
            <div className="bg-neo-notebook p-2 sm:p-3 text-[10px] text-black border-b-[3px] border-black text-center uppercase tracking-widest font-bold shrink-0">
              คลิก 1 ครั้ง = ❌ | คลิก 2 ครั้ง = ⭕
            </div>
            <div className="overflow-auto p-0 flex justify-center items-center bg-neo-bg flex-1 min-h-0 w-full">
              <LogicGrid categories={levelData.categories} getCellState={getCellState} toggleCell={toggleCell} />
            </div>
          </section>

          {/* Grid Action Menu */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black text-white px-4 sm:px-6 py-3 border-[3px] border-black shadow-[4px_4px_0_#222222] flex items-center gap-3 sm:gap-4 max-w-[95vw] overflow-x-auto whitespace-nowrap">
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

      {/* Exhibit C Modal */}
      {showExhibitC && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowExhibitC(false)}>
          <div
            className="bg-neo-notebook border-[3px] border-black shadow-[8px_8px_0_#222222] p-6 max-w-md max-h-[90vh] overflow-y-auto w-full flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl sm:text-3xl font-black text-black mb-2 border-b-[4px] border-black pb-2 text-center w-full uppercase tracking-widest">
              🏛️ คู่มือ Exhibit C: วงกตบนซากปรักหักพังโบราณ
            </h3>
            <p className="text-black text-sm sm:text-base font-bold text-center mb-6">
              แผนผังความสัมพันธ์เชิงตรรกะที่สลักไว้บนหินโบราณ โดยใช้การเชื่อมโยงระหว่าง &quot;หมายเลขห้อง (Chambers)&quot; และ &quot;กลุ่มตัวอักษร (Letters)&quot; เพื่อใช้ถอดรหัสคำใบ้
            </p>

            <div className="mb-6">
              <h4 className="text-xl font-bold mb-4 bg-black text-white inline-block px-4 py-1 border-[2px] border-black shadow-[4px_4px_0_#222222]">
                โครงสร้างการเชื่อมต่อ (Chamber Mapping)
              </h4>
              <ul className="list-none space-y-3 font-bold text-black">
                <li className="flex items-start gap-2"><span className="text-xl">▪️</span> <span><strong>ห้องหมายเลข 1:</strong> เชื่อมต่อกับกลุ่มตัวอักษร O, A และ N</span></li>
                <li className="flex items-start gap-2"><span className="text-xl">▪️</span> <span><strong>ห้องหมายเลข 2:</strong> เชื่อมต่อกับกลุ่มตัวอักษร N, I และ R</span></li>
                <li className="flex items-start gap-2"><span className="text-xl">▪️</span> <span><strong>ห้องหมายเลข 3:</strong> เชื่อมต่อกับกลุ่มตัวอักษร U, L และ E</span></li>
              </ul>
            </div>

            <div className="mb-6">
              <h4 className="text-xl font-bold mb-4 bg-black text-white inline-block px-4 py-1 border-[2px] border-black shadow-[4px_4px_0_#222222]">
                ตารางอ้างอิงตัวอักษร (Letter Lookup)
              </h4>
              <table className="border-[2px] border-black w-full text-center text-black font-bold">
                <thead>
                  <tr className="bg-white border-b-[2px] border-black">
                    <th className="border-r-[2px] border-black p-2">ตัวอักษร</th>
                    <th className="p-2">ห้องที่สังกัด (Chamber)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b-[2px] border-black bg-neo-bg">
                    <td className="border-r-[2px] border-black p-2">U, L, E</td>
                    <td className="p-2">ห้องหมายเลข 3</td>
                  </tr>
                  <tr className="border-b-[2px] border-black bg-white">
                    <td className="border-r-[2px] border-black p-2">I, R, N</td>
                    <td className="p-2">ห้องหมายเลข 2</td>
                  </tr>
                  <tr className="bg-neo-bg">
                    <td className="border-r-[2px] border-black p-2">O, A, N</td>
                    <td className="p-2">ห้องหมายเลข 1</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-yellow-200 p-4 border-[2px] border-black mt-4 mb-6 shadow-[4px_4px_0_#222222]">
              <h4 className="text-lg font-black text-black mb-2 flex items-center gap-2">💡 วิธีใช้งานเพื่อการสืบสวน</h4>
              <p className="text-black font-bold text-sm leading-relaxed mb-2">ในการไขคดีระดับสูง คำใบ้มักจะไม่บอกความจริงตรงๆ เช่น:</p>
              <ul className="list-none space-y-1 text-black font-bold text-sm italic mb-2 ml-4">
                <li>- &quot;ตัวอักษรลำดับที่ X ของชื่อผู้ต้องสงสัย เชื่อมต่อกับห้องหมายเลข Y&quot;</li>
              </ul>
              <p className="text-black font-bold text-sm leading-relaxed">
                เพียงแค่ดูว่า <strong>ตัวอักษร</strong> ที่โจทย์ให้มา ตรงกับ <strong>เลขห้อง</strong> ใดใน Exhibit นี้ แล้วนำเลขห้องนั้นไปเทียบหาความเชื่อมโยงถัดไป!
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowExhibitC(false)}
              className="mt-auto bg-black text-white w-full border-[3px] border-black py-4 font-black text-xl shadow-[4px_4px_0_#222222] hover:bg-neo-accent hover:-translate-y-1 transition-all uppercase tracking-widest sticky bottom-0"
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
            className="bg-neo-notebook border-[3px] border-black shadow-[8px_8px_0_#222222] p-6 max-w-4xl max-h-[90vh] overflow-y-auto w-full flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl sm:text-3xl font-black text-black mb-2 border-b-[4px] border-black pb-2 text-center w-full uppercase tracking-widest font-mono">
              Exhibit D: แผนผังประกอบคดี
            </h3>
            <p className="text-black text-sm sm:text-base font-bold text-center mb-6">
              ใช้แผนผังนี้เพื่อระบุตำแหน่งที่ตั้งและทิศทางของสถานที่ต่างๆ ในคดี
            </p>

            <div className="mb-6 flex justify-center w-full relative h-[50vh] sm:h-[60vh] md:h-[70vh]">
              <div className="relative w-full h-full border-[3px] border-black shadow-[4px_4px_0_rgba(0,0,0,1)] bg-white overflow-hidden">
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
              className="mt-auto bg-black text-white w-full border-[3px] border-black py-4 font-black text-xl shadow-[4px_4px_0_rgba(0,0,0,1)] uppercase tracking-widest sticky bottom-0"
            >
              ❌ ปิด
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
