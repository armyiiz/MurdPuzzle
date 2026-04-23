import React, { ReactNode } from 'react';

const SHADOW_COLORS = [
  'drop-shadow-[0_0_0_rgba(0,0,0,0.8)]',          // 0: Black
  'drop-shadow-[0_0_0_rgba(239,68,68,0.8)]',      // 1: Red
  'drop-shadow-[0_0_0_rgba(59,130,246,0.8)]',     // 2: Blue
  'drop-shadow-[0_0_0_rgba(34,197,94,0.8)]',      // 3: Green
  'drop-shadow-[0_0_0_rgba(168,85,247,0.8)]',     // 4: Purple
];

const BASE_EMOJIS: Record<string, string> = {
  suspects: '👤',
  weapons: '🔪',
  locations: '📍',
  motives: '❓',
};

// Extractor logic
export const extractEmojiAndText = (itemName: string) => {
  const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/u;
  const match = itemName.match(emojiRegex);
  if (match) {
    const emoji = match[0];
    const text = itemName.replace(emoji, '').trim();
    return { emoji, text };
  }
  return { emoji: null, text: itemName };
};

export const getCategoryEmoji = (category: string, index: number, itemName?: string): ReactNode => {
  const colorClass = SHADOW_COLORS[index % SHADOW_COLORS.length];
  let emojiToRender = BASE_EMOJIS[category] || '❓';

  if (itemName) {
    const { emoji } = extractEmojiAndText(itemName);
    if (emoji) {
      emojiToRender = emoji;
    }
  }

  return (
    <span className={`${colorClass} text-base leading-none inline-block`} title={itemName}>
      {emojiToRender}
    </span>
  );
};
