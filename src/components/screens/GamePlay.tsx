import React, { useState, useEffect } from 'react';
import { LevelData, Category, Profiles, ProfileItem } from '../../types/level';
import { getIconClass, getIconColor, extractEmojiAndText } from '../../utils/emojiHelper';
import { useGameLogic } from '../../hooks/useGameLogic';
import { LogicGrid } from '../LogicGrid';
import { ExhibitB } from '../modals/ExhibitB';
import { ExhibitC } from '../modals/ExhibitC';
import { ExhibitD } from '../modals/ExhibitD';
import { Decrypter } from '../modals/Decrypter';
import { ProfileModal } from '../modals/ProfileModal';
import dailyMasterData from '../../data/dailymasterdata.json';

type ProfileCategoryKey = keyof Profiles;
type SetSolvedCases = React.Dispatch<React.SetStateAction<string[]>>;

function getProfileItems(profiles: Profiles | undefined, key: ProfileCategoryKey): ProfileItem[] {
  return profiles?.[key] ?? [];
}

export function GamePlay({ levelData, setSolvedCases, solvedCases }: { levelData: LevelData, setSolvedCases: SetSolvedCases, solvedCases: string[] }) {
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

          {/* Pop-up Modal Profile */}
          {selectedProfileIndex !== null && levelData.profiles && (
            <ProfileModal
              levelDataId={String(levelData.id)}
              profiles={levelData.profiles}
              activeTab={activeTab}
              selectedProfileIndex={selectedProfileIndex}
              setSelectedProfileIndex={setSelectedProfileIndex}
              categories={levelData.categories}
            />
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
      {showExhibitB && <ExhibitB onClose={() => setShowExhibitB(false)} />}

      {/* Exhibit C Modal (Image View) */}
      {showExhibitC && <ExhibitC onClose={() => setShowExhibitC(false)} />}

      {/* Exhibit D Modal */}
      {showExhibitD && <ExhibitD onClose={() => setShowExhibitD(false)} />}

      {/* Decrypter Modal */}
      {showDecrypter && <Decrypter onClose={() => setShowDecrypter(false)} cipherInput={cipherInput} setCipherInput={setCipherInput} />}


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
