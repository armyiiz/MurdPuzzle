import React from 'react';
import Image from 'next/image';
import FocusTrap from 'focus-trap-react';

export function ExhibitC({ onClose }: { onClose: () => void }) {
  return (
    <FocusTrap active={true}>
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="exhibit-c-title"
          className="murdle-modal p-6 max-w-4xl max-h-[90vh] overflow-y-auto w-full flex flex-col relative"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 id="exhibit-c-title" className="text-2xl sm:text-3xl font-bold text-black mb-2 border-b-[4px] border-black pb-2 text-center w-full uppercase tracking-widest font-mono">
            Exhibit C: วงกตบนซากปรักหักพังโบราณ
          </h3>
          <p className="text-black text-sm sm:text-base font-bold text-center mb-6">
            แผนผังความสัมพันธ์เชิงตรรกะที่สลักไว้บนหินโบราณ
          </p>

          <div className="mb-6 flex justify-center w-full relative h-[50vh] sm:h-[60vh] md:h-[70vh]">
            <div className="relative w-full h-full border-[3px] border-black shadow-[4px_4px_0_#1DACD6] bg-white overflow-hidden">
              <Image
                src="/Exhibit C.webp"
                alt="Exhibit C"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="ปิดเอกสาร Exhibit C"
            className="murdle-button-primary mt-auto w-full text-xl uppercase tracking-widest sticky bottom-0"
          >
            ❌ ปิด
          </button>
        </div>
      </div>
    </FocusTrap>
  );
}
