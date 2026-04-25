/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { LevelData, Category } from '../types/level';
import { getCategoryEmoji, extractEmojiAndText } from '../utils/emojiHelper';
import { GamePlay } from '../components/GamePlay';
import { allCases } from '../data/allCases';


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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [screen, selectedCase]);

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
        {screen === 'GAME' && selectedCase && <GamePlay levelData={selectedCase} onSolve={() => {
          if (!solvedCases.includes(selectedCase.id)) {
            const newSolved = [...solvedCases, selectedCase.id];
            setSolvedCases(newSolved);
            localStorage.setItem('solvedCases', JSON.stringify(newSolved));
          }
        }} isSolved={solvedCases.includes(selectedCase.id)} />}
      </main>
    </div>
  );
}

function MainMenu({ setScreen }: { setScreen: (s: ScreenState) => void }) {
  return (
    <div className="flex flex-col items-center justify-center mt-20 space-y-6">
      <h1 className="text-4xl font-extrabold text-black mb-8 tracking-tight text-center">🕵️‍♂️ ไขคดีปริศนา <br/> ฉบับภาษาไทย</h1>
      <a href="/daily" className="bg-black text-white hover:bg-[#A30B37] hover:-translate-y-1 transition-all text-xl font-bold py-4 px-12 border-[3px] border-black shadow-[4px_4px_0_#222222] text-center w-full max-w-xs block">
        คดีประจำวัน (Daily)
      </a>
      <button onClick={() => setScreen('LEVEL_SELECT')} className="bg-white text-black hover:bg-gray-100 hover:-translate-y-1 transition-all text-lg font-bold py-3 px-8 border-[3px] border-black shadow-[4px_4px_0_#222222] w-full max-w-xs">
        เริ่มไขคดี
      </button>
      <button onClick={() => setScreen('HOW_TO_PLAY')} className="bg-white text-black hover:bg-gray-100 hover:-translate-y-1 transition-all text-lg font-bold py-3 px-8 border-[3px] border-black shadow-[4px_4px_0_#222222] w-full max-w-xs">
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

