import React from 'react';
import FocusTrap from 'focus-trap-react';
import exhibitBData from '../../data/ExhibitB.json';

type ZodiacSign = {
  name_en: string;
  symbol: string;
  name_th: string;
  element_th: string;
  dates_th: string;
};

type AlchemicalSymbol = {
  name_en: string;
  symbol: string;
  name_th: string;
};

export function ExhibitB({ onClose }: { onClose: () => void }) {
  return (
    <FocusTrap active={true}>
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="exhibit-b-title"
          className="murdle-modal max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 flex flex-col relative"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 id="exhibit-b-title" className="text-2xl sm:text-3xl font-bold text-black mb-2 border-b-[4px] border-black pb-2 text-center w-full uppercase tracking-widest">
            {exhibitBData.exhibit_b.title_th}
          </h3>
          <p className="text-black text-sm sm:text-base font-bold text-center mb-6">
            {exhibitBData.exhibit_b.description}
          </p>

          {/* Astrological Primer */}
          <div className="mb-8">
            <h4 className="murdle-section-title mb-4 bg-murdle-accent text-white inline-block px-4 py-1 border-[2px] border-black shadow-[4px_4px_0_#1DACD6]">
              ✨ จักรราศี
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {(Object.values(exhibitBData.exhibit_b.zodiac_signs) as ZodiacSign[]).map((sign) => (
                <div key={sign.name_en} className="murdle-card-compact !p-3 flex flex-col items-center text-center">
                  <span className="text-4xl mb-2">{sign.symbol}</span>
                  <span className="font-bold text-black text-sm">{sign.name_th}</span>
                  <span className="text-xs font-bold bg-murdle-paper px-2 py-0.5 mt-1 border border-black">{sign.element_th}</span>
                  <span className="text-[10px] mt-2 font-bold">{sign.dates_th}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Alchemical Symbols */}
          <div className="mb-6">
            <h4 className="murdle-section-title mb-4 bg-murdle-accent text-white inline-block px-4 py-1 border-[2px] border-black shadow-[4px_4px_0_#1DACD6]">
              ⚗️ สัญลักษณ์การเล่นแร่แปรธาตุ
            </h4>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {(Object.values(exhibitBData.exhibit_b.alchemical_symbols) as AlchemicalSymbol[]).map((symbol) => (
                <div key={symbol.name_en} className="murdle-card-compact !border-[3px] !shadow-[2px_2px_0_#1DACD6] !p-2 flex flex-col items-center text-center">
                  <span className="text-3xl mb-1">{symbol.symbol}</span>
                  <span className="font-bold text-black text-[10px] sm:text-xs leading-tight">{symbol.name_th}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="ปิดเอกสาร Exhibit B"
            className="murdle-button-primary mt-auto w-full text-xl uppercase tracking-widest sticky bottom-0"
          >
            ❌ ปิดเอกสาร
          </button>
        </div>
      </div>
    </FocusTrap>
  );
}
