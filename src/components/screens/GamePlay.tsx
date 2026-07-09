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
  const caseNumber = parseInt(levelData.id.replace('case_', ''), 10);
  const testimonyCount = levelData.testimonies?.length ?? 0;
  const profileCount = Object.values(levelData.profiles ?? {}).reduce((total, items) => total + (items?.length ?? 0), 0);
  const largestGridGroup = Math.max(...levelData.categories.map(category => category.items.length));
  const gridShapeLabel = `${levelData.categories.length}x${largestGridGroup}`;
  const gridChromeSize = levelData.categories.length >= 4 ? '14.75rem' : '12.75rem';

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

  const showGridView = () => {
    if (activeView !== 'grid') {
      setCluesScrollY(window.scrollY);
      setActiveView('grid');
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const showCluesView = () => {
    if (activeView !== 'clues') {
      setActiveView('clues');
      setTimeout(() => {
        window.scrollTo({ top: cluesScrollY, behavior: 'instant' });
      }, 10);
    }
  };

  const handleToggleView = () => {
    if (activeView === 'clues') {
      showGridView();
    } else {
      showCluesView();
    }
  };

  return (
    <div className="animate-fadeIn relative mx-auto max-w-5xl pb-28">
      {activeView === 'clues' && (
        <div className="animate-in fade-in duration-300">
          <section className="murdle-case-hero mb-6 px-4 py-5 sm:px-6 sm:py-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0">
                <div className="murdle-paper-strip murdle-mono mb-3 inline-flex px-3 py-1 text-xs font-bold uppercase tracking-widest">
                  Case {caseNumber}
                </div>
                <h2 className="murdle-section-title text-2xl sm:text-3xl">{levelData.level_name}</h2>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <div className="murdle-stat-chip flex-col">
                  <span className="text-[10px] text-murdle-muted">Level</span>
                  <span className="text-lg">{levelData.difficulty}</span>
                </div>
                <div className="murdle-stat-chip flex-col">
                  <span className="text-[10px] text-murdle-muted">Clues</span>
                  <span className="text-lg">{levelData.clues.length}</span>
                </div>
                <div className="murdle-stat-chip flex-col">
                  <span className="text-[10px] text-murdle-muted">Profiles</span>
                  <span className="text-lg">{profileCount}</span>
                </div>
                <button onClick={showGridView} className="murdle-stat-chip flex-col hover:bg-murdle-paper">
                  <span className="text-[10px] text-murdle-muted">Open</span>
                  <span className="text-lg">Grid</span>
                </button>
              </div>
            </div>
          </section>

          <div className="murdle-card mb-8 !bg-white text-base font-bold leading-relaxed sm:text-lg">
            <div className="murdle-paper-strip murdle-mono mb-3 inline-flex px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
              Story Brief
            </div>
            <p>{levelData.story_intro}</p>
          </div>

          {/* แฟ้มประวัติ Profiles (Tabbed View) */}
          {levelData.profiles && (
            <div className="murdle-card mb-8">
              <div className="mb-5 flex flex-col gap-3 border-b-[3px] border-black pb-4 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2 text-black uppercase tracking-widest">📋 ข้อมูลเพิ่มเติม</h3>
                <span className="murdle-stat-chip self-start !min-h-9 !px-2 !py-1 text-[10px] sm:self-auto">
                  {profileCount} records
                </span>
              </div>

              {/* Tabs Row */}
              <div className="mb-6 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
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
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                {getProfileItems(levelData.profiles, activeTab).map((item, index) => {
                  const catData = levelData.categories.find(c => c.id === activeTab);
                  const trueIndex = catData ? catData.items.findIndex(i => i.replace(/\s*\(.*?\)\s*/g, '').trim() === item.name.replace(/\s*\(.*?\)\s*/g, '').trim()) : index;
                  const finalIndex = trueIndex >= 0 ? trueIndex : index;

                  return (
                    <button
                      key={item.name}
                      onClick={() => setSelectedProfileIndex(index)}
                      className="murdle-card-compact murdle-case-tile flex aspect-square flex-col items-center justify-center !p-3 transition-all"
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
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8 mb-12">
            <div className="murdle-card">
              <div className="mb-5 flex flex-col gap-3 border-b-[3px] border-black pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2 text-black">🔍 เบาะแส</h3>
                  <p className="murdle-mono mt-1 text-[10px] font-bold uppercase tracking-widest text-murdle-muted">{levelData.clues.length} clues on file</p>
                </div>
                {levelData.difficulty === 2 && (
                  <button onClick={() => setShowExhibitB(true)} className="murdle-button-primary !px-3 !py-1 !min-h-11 text-sm flex items-center gap-1">
                    📖 คู่มือ Exhibit B
                  </button>
                )}
                {levelData.difficulty === 3 && (
                  <button onClick={() => setShowExhibitC(true)} className="murdle-button-primary !px-3 !py-1 !min-h-11 text-sm flex items-center gap-1">
                    📖 คู่มือ Exhibit C
                  </button>
                )}
                {levelData.difficulty === 4 && (
                  <button onClick={() => setShowExhibitD(true)} className="murdle-button-primary !px-3 !py-1 !min-h-11 text-sm flex items-center gap-1">
                    📖 แผนผัง Exhibit D
                  </button>
                )}
              </div>
              <ul className="space-y-3">
                {levelData.clues.map((clue, idx) => {
                  return (
                    <li key={idx} className="murdle-clue-item text-black">
                      <span className="murdle-clue-number">{idx + 1}</span>
                      <span className="leading-relaxed font-bold">{clue}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {levelData.testimonies && levelData.testimonies.length > 0 && (
              <div className="murdle-card border-l-[8px] border-l-neo-accent">
                <div className="mb-5 flex items-center justify-between gap-3 border-b-[3px] border-black pb-4">
                  <h3 className="text-xl font-bold text-murdle-accent flex items-center gap-2">🗣️ คำให้การ</h3>
                  <span className="murdle-stat-chip !min-h-9 !px-2 !py-1 text-[10px]">{testimonyCount} logs</span>
                </div>
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

            <div className={`murdle-card !bg-white ${levelData.testimonies && levelData.testimonies.length > 0 ? 'lg:col-span-2' : ''}`}>
              <div className="mb-4 flex flex-col gap-3 border-b-[3px] border-black pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2 text-black">📝 สมุดโน้ต</h3>
                  <p className="murdle-mono mt-1 text-[10px] font-bold uppercase tracking-widest text-murdle-muted">Saved with this case</p>
                </div>
                <button onClick={() => saveGridState(testimonyStates, notes, levelData.id)} className="murdle-button-secondary !min-h-11 !px-4 !py-2 text-sm">
                  💾 บันทึก
                </button>
              </div>
              <textarea
                className="murdle-input min-h-36 resize-y text-sm leading-relaxed"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="จดสมมติฐาน จุดขัดแย้ง หรือคู่ที่ตัดออกแล้ว..."
                aria-label="สมุดโน้ตสำหรับคดีนี้"
              />
            </div>

          </div>

          {/* Final Accusation */}
          <div className="murdle-card !bg-murdle-paper">
            <div className="mb-6 flex flex-col gap-3 border-b-[3px] border-black pb-4 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-2xl font-bold tracking-[0.12em] uppercase text-murdle-accent">⚖️ สรุปรูปคดี</h3>
              <span className="murdle-stat-chip self-start !min-h-9 !px-2 !py-1 text-[10px] sm:self-auto">Final report</span>
            </div>
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="accuse-suspect" className="murdle-mono text-[10px] uppercase font-bold text-black tracking-widest bg-white border-2 border-black px-2 self-start">คนร้าย</label>
                <select id="accuse-suspect" className="murdle-input !min-h-11 !py-2 text-sm" value={accusation.suspect} onChange={e => setAccusation({...accusation, suspect: e.target.value})}>
                  <option value="">- เลือกผู้ต้องสงสัย -</option>
                  {getOptions('suspects').map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="accuse-weapon" className="murdle-mono text-[10px] uppercase font-bold text-black tracking-widest bg-white border-2 border-black px-2 self-start">อาวุธ</label>
                <select id="accuse-weapon" className="murdle-input !min-h-11 !py-2 text-sm" value={accusation.weapon} onChange={e => setAccusation({...accusation, weapon: e.target.value})}>
                  <option value="">- เลือกอาวุธ -</option>
                  {getOptions('weapons').map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="accuse-location" className="murdle-mono text-[10px] uppercase font-bold text-black tracking-widest bg-white border-2 border-black px-2 self-start">สถานที่</label>
                <select id="accuse-location" className="murdle-input !min-h-11 !py-2 text-sm" value={accusation.location} onChange={e => setAccusation({...accusation, location: e.target.value})}>
                  <option value="">- เลือกสถานที่ -</option>
                  {getOptions('locations').map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>

              {hasMotives && (
                <div className="flex flex-col gap-2">
                  <label htmlFor="accuse-motive" className="murdle-mono text-[10px] uppercase font-bold text-black tracking-widest bg-white border-2 border-black px-2 self-start">แรงจูงใจ</label>
                  <select id="accuse-motive" className="murdle-input !min-h-11 !py-2 text-sm" value={accusation.motive} onChange={e => setAccusation({...accusation, motive: e.target.value})}>
                    <option value="">- เลือกแรงจูงใจ -</option>
                    {getOptions('motives').map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
              )}
            </div>

            <button onClick={handleCheckAnswer} className="murdle-button-primary w-full px-12 py-5 text-xl uppercase tracking-widest">
              ตรวจคำตอบ
            </button>

            {feedback.type && (
              <div className={`mt-6 w-full px-6 py-4 font-bold text-center text-lg shadow-[4px_4px_0_#1DACD6] border-[3px] border-black ${feedback.type === 'success' ? 'murdle-status-success' : 'murdle-status-error'}`}>
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
        <div
          className="murdle-grid-stage fixed inset-x-0 bottom-0 top-[var(--app-header-height)] overflow-hidden flex flex-col items-center justify-start z-0 animate-in fade-in duration-300 gap-1.5 px-2 pt-2 pb-[calc(env(safe-area-inset-bottom)+6.25rem)]"
          style={{ '--grid-vertical-chrome': gridChromeSize } as React.CSSProperties}
        >
          <div className="murdle-grid-hud w-full max-w-4xl">
            <div className="murdle-grid-stat">
              <span><i className="fa-solid fa-folder-open" aria-hidden="true"></i> Case</span>
              <strong>{caseNumber}</strong>
            </div>
            <div className="murdle-grid-stat">
              <span><i className="fa-solid fa-table-cells" aria-hidden="true"></i> Grid</span>
              <strong>{gridShapeLabel}</strong>
            </div>
            <button
              onClick={handleGridExportAI}
              className={`murdle-grid-stat ${
                gridExportStatus === 'success'
                  ? 'murdle-status-success'
                  : gridExportStatus === 'error'
                    ? 'murdle-status-error'
                    : ''
              }`}
            >
              <span><i className="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i> Export</span>
              <strong>
                {gridExportStatus === 'success'
                  ? 'Copied'
                  : gridExportStatus === 'error'
                    ? 'Retry'
                    : 'AI'}
              </strong>
            </button>
          </div>

          {/* Smart Legend Bar */}
          <div className="flex flex-nowrap justify-start sm:justify-center gap-2 w-full max-w-4xl overflow-x-auto px-1 py-1 shrink-0 custom-scrollbar">
            {levelData.categories.map(cat => {
              const catIcons: Record<string, string> = { suspects: 'fa-user-secret', weapons: 'fa-gavel', locations: 'fa-location-dot', motives: 'fa-comment-dots' };
              const icon = catIcons[cat.id] || 'fa-circle-question';
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedLegendCategory(cat)}
                  className="murdle-grid-legend-button murdle-button-secondary !px-2 sm:!px-3 !py-1.5 sm:!py-2 !min-h-11 flex items-center gap-1 sm:gap-2 whitespace-nowrap"
                >
                  <i className={`fa-solid ${icon} text-base sm:text-lg`} aria-hidden="true"></i>
                  <span className="font-bold uppercase tracking-wide text-[10px] sm:text-sm">{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Logic Grid */}
          <section className="murdle-grid-board flex min-h-0 w-full max-w-5xl flex-1 shrink overflow-hidden">
            <div className="flex min-h-0 w-full flex-1 items-start justify-center overflow-hidden bg-transparent p-1 sm:p-2">
              <LogicGrid categories={levelData.categories} getCellState={getCellState} toggleCell={toggleCell} seedString={String(levelData.id)} />
            </div>
          </section>
        </div>
      )}

      {/* Main Game Dock */}
      <nav className="murdle-bottom-dock" aria-label="เครื่องมือเล่นคดี">
        <button
          onClick={handleToggleView}
          className={`murdle-dock-button ${activeView === 'grid' ? 'murdle-dock-button-active' : ''}`}
          aria-label={activeView === 'clues' ? "เปิดกระดานตรรกะ" : "กลับไปหน้าเบาะแส"}
        >
          <i className={`fa-solid ${activeView === 'clues' ? 'fa-table-cells-large' : 'fa-magnifying-glass'} text-lg`} aria-hidden="true"></i>
          <span>{activeView === 'clues' ? 'Grid' : 'Clues'}</span>
        </button>
        <button onClick={() => setShowDecrypter(true)} aria-label="เปิดเครื่องมือคำใบ้และถอดรหัส" className="murdle-dock-button">
          <i className="fa-solid fa-lightbulb text-lg" aria-hidden="true"></i>
          <span>Hint</span>
        </button>
        <button onClick={() => saveGridState(testimonyStates, notes, levelData.id)} aria-label="บันทึกกระดานปัจจุบัน" className="murdle-dock-button">
          <i className="fa-solid fa-floppy-disk text-lg" aria-hidden="true"></i>
          <span>Save</span>
        </button>
        <button onClick={undo} disabled={!canUndo} aria-label="ย้อนกลับการแก้ไขล่าสุด" className="murdle-dock-button">
          <i className="fa-solid fa-rotate-left text-lg" aria-hidden="true"></i>
          <span>Undo</span>
        </button>
        <button onClick={resetGrid} aria-label="รีเซ็ตกระดานตรรกะ" className="murdle-dock-button text-murdle-accent">
          <i className="fa-solid fa-eraser text-lg" aria-hidden="true"></i>
          <span>Clear</span>
        </button>
      </nav>

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
