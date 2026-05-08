import React from 'react';
import FocusTrap from 'focus-trap-react';
import { Profiles, ProfileItem } from '../../types/level';
import { extractEmojiAndText, getIconClass, getIconColor } from '../../utils/emojiHelper';

type ProfileCategoryKey = keyof Profiles;

interface ProfileModalProps {
  levelDataId: string;
  profiles: Profiles;
  activeTab: ProfileCategoryKey;
  selectedProfileIndex: number;
  setSelectedProfileIndex: (index: number | null) => void;
  categories: { id: string; items: string[] }[];
}

export function ProfileModal({
  levelDataId,
  profiles,
  activeTab,
  selectedProfileIndex,
  setSelectedProfileIndex,
  categories,
}: ProfileModalProps) {
  const profileItems = profiles[activeTab] ?? [];
  const item = profileItems[selectedProfileIndex];

  if (!item) return null;

  const catData = categories.find(c => c.id === activeTab);
  const trueIndex = catData
    ? catData.items.findIndex(i => i.replace(/\s*\(.*?\)\s*/g, '').trim() === item.name.replace(/\s*\(.*?\)\s*/g, '').trim())
    : selectedProfileIndex;
  const finalIndex = trueIndex >= 0 ? trueIndex : selectedProfileIndex;

  return (
    <FocusTrap active={true}>
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedProfileIndex(null)}>
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-modal-title"
          className="murdle-modal max-w-sm w-full p-6 flex flex-col items-center relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Content */}
          <div className="murdle-card-compact w-24 h-24 flex items-center justify-center mb-4 !p-2">
            <i
              aria-hidden="true"
              className={`${getIconClass(activeTab, item.name)} text-5xl leading-none inline-block [text-shadow:2px_2px_0_#000]`}
              style={{ color: getIconColor(finalIndex, levelDataId, activeTab) }}
            ></i>
          </div>

          <h3 id="profile-modal-title" className="murdle-section-title text-black mb-4 border-b-[3px] border-black pb-2 text-center w-full">
            {extractEmojiAndText(item.name).text}
          </h3>

          <p className="text-black text-base leading-relaxed mb-8 w-full">
            {item.detail}
          </p>

          {/* Navigation Buttons */}
          <div className="flex justify-between w-full mb-4">
            <button
              onClick={() => {
                const total = profileItems.length;
                setSelectedProfileIndex((selectedProfileIndex - 1 + total) % total);
              }}
              className="murdle-button-secondary !px-4 !py-2"
            >
              ⬅️ ก่อนหน้า
            </button>
            <button
              onClick={() => {
                const total = profileItems.length;
                setSelectedProfileIndex((selectedProfileIndex + 1) % total);
              }}
              className="murdle-button-secondary !px-4 !py-2"
            >
              ถัดไป ➡️
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setSelectedProfileIndex(null)}
            className="murdle-button-primary w-full text-lg uppercase tracking-widest"
          >
            ❌ ปิด
          </button>
        </div>
      </div>
    </FocusTrap>
  );
}
