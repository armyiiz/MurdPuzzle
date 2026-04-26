/* eslint-disable react-hooks/set-state-in-effect, @next/next/no-html-link-for-pages */
"use client";

import React, { useState, useEffect } from 'react';
import { GamePlay } from '../../components/GamePlay';
import { DailyMurdleEngine, GeneratedCase } from '../../data/dailyGenerator';
import masterData from '../../data/dailymasterdata.json';

export default function DailyCasePage() {
  const [dailyCase, setDailyCase] = useState<GeneratedCase | null>(null);
  const [solvedStats, setSolvedStats] = useState<{ attempts: number, time: number } | null>(null);
  const [todayStr, setTodayStr] = useState<string>('');

  useEffect(() => {
    // Determine today's date in local time string YYYY-MM-DD
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateSeed = `${year}-${month}-${day}`;
    setTodayStr(dateSeed);

    // Check if already solved today
    const savedDaily = localStorage.getItem(`dailySolved_${dateSeed}`);
    if (savedDaily) {
      setSolvedStats(JSON.parse(savedDaily));
    }

    // Generate case
    let result: GeneratedCase | null = null;
    let seedModifier = "";
    let safeGuard = 0;
    while (!result && safeGuard < 10) {
      safeGuard++;
      const engine = new DailyMurdleEngine(dateSeed + seedModifier);
      result = engine.generate(masterData, dateSeed);
      seedModifier += "x";
    }

    setDailyCase(result);
  }, []);

  const handleSolve = (attempts: number, time: number) => {
    const stats = { attempts, time };
    setSolvedStats(stats);
    localStorage.setItem(`dailySolved_${todayStr}`, JSON.stringify(stats));
  };

  const handleShare = () => {
    if (!solvedStats) return;

    // Grid Emojis based on attempts
    // If it took 1 attempt, it's 4 greens.
    // If more, we simulate some reds then greens.
    // The requirement: "Show only the final result row (e.g., 🟩🟩🟩🟩) followed by the time and total attempts."

    // Actually the requirement specifies: "🟩 = Correct selection in the final accusation. 🟥 = Incorrect selection."
    // Since we only know they solved it (all correct in the end), the final result row is all greens.
    // Let's generate a string of 🟩 based on the number of categories.
    const numCats = dailyCase?.categories.length || 3;
    const finalGrid = Array(numCats).fill('🟩').join('');

    const timeStr = `${Math.floor(solvedStats.time / 60)}:${String(solvedStats.time % 60).padStart(2, '0')}`;
    const shareText = `Murdle Daily #${todayStr}\n${finalGrid}\nSolved in ${timeStr} / ${solvedStats.attempts} attempts`;

    navigator.clipboard.writeText(shareText).then(() => {
      alert('คัดลอกผลลัพธ์ลงคลิปบอร์ดแล้ว!');
    }).catch(err => {
      console.error('Could not copy text: ', err);
      // fallback
      prompt('คัดลอกข้อความด้านล่างนี้เพื่อแชร์:', shareText);
    });
  };



  return (
    <div className="min-h-screen bg-neo-bg text-black font-mono pb-24">
      <header className="bg-black text-white p-4 sticky top-0 z-10 flex justify-between items-center border-b-[3px] border-black shadow-[0_4px_0_#222222]">
        <h1 className="text-xl font-bold tracking-widest uppercase">📅 คดีประจำวัน</h1>
        <a href="/" className="text-xs bg-white text-black px-3 py-1 border-[2px] border-black hover:bg-neo-accent hover:text-white transition-colors uppercase font-bold tracking-wider">
          กลับหน้าหลัก
        </a>
      </header>

      <main className="max-w-6xl mx-auto mt-6">
        {solvedStats ? (
          <div className="animate-fadeIn max-w-xl mx-auto px-4 mt-20">
            <div className="bg-white border-[3px] border-black shadow-[8px_8px_0_#000] p-8 text-center flex flex-col items-center">
              <h2 className="text-4xl font-black mb-6 text-neo-accent uppercase tracking-widest">🎉 ปิดคดีสำเร็จ!</h2>
              <p className="text-lg font-bold mb-4">คุณได้ไขคดีประจำวันที่ {todayStr} เรียบร้อยแล้ว</p>

              <div className="bg-neo-notebook border-[2px] border-black p-4 mb-8 w-full shadow-[inset_2px_2px_0_rgba(0,0,0,0.1)]">
                <div className="text-3xl tracking-widest mb-4">
                  {Array(dailyCase?.categories.length || 3).fill('🟩').join('')}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center">
                    <span className="text-xs uppercase font-bold tracking-widest bg-black text-white px-2 py-0.5 mb-1">เวลาที่ใช้</span>
                    <span className="text-2xl font-black">{Math.floor(solvedStats.time / 60)}:{String(solvedStats.time % 60).padStart(2, '0')}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs uppercase font-bold tracking-widest bg-black text-white px-2 py-0.5 mb-1">จำนวนครั้งที่ตอบ</span>
                    <span className="text-2xl font-black">{solvedStats.attempts}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleShare}
                className="bg-black text-white hover:bg-neo-accent hover:-translate-y-1 transition-all text-lg font-bold py-3 px-8 border-[3px] border-black shadow-[4px_4px_0_#222222] w-full flex items-center justify-center gap-2"
              >
                <span>📋</span> แชร์ผลลัพธ์
              </button>

              <p className="mt-8 text-sm font-bold opacity-70">กลับมาใหม่พรุ่งนี้สำหรับคดีต่อไป!</p>
            </div>
          </div>
        ) : dailyCase ? (
          <GamePlay
            levelData={dailyCase}
            onSolve={handleSolve}
            isSolved={false}
          />
        ) : (
          <div className="flex flex-col justify-center items-center min-h-[50vh] gap-4">
            <h2 className="text-2xl font-black font-mono animate-pulse text-black">
              กำลังเตรียมคดีปริศนา... 🕵️‍♀️
            </h2>
          </div>
        )}
      </main>
    </div>
  );
}
