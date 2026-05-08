import React from 'react';
import FocusTrap from 'focus-trap-react';
import anagramDict from '../../data/anagramDictionary.json';

interface DecrypterProps {
  onClose: () => void;
  cipherInput: string;
  setCipherInput: (input: string) => void;
}

export function Decrypter({ onClose, cipherInput, setCipherInput }: DecrypterProps) {
  return (
    <FocusTrap active={true}>
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => { onClose(); setCipherInput(''); }}>
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
            onClick={() => { onClose(); setCipherInput(''); }}
            aria-label="ปิดเครื่องมือถอดรหัส"
            className="murdle-button-primary w-full text-lg uppercase tracking-widest"
          >
            ❌ ปิด
          </button>
        </div>
      </div>
    </FocusTrap>
  );
}
