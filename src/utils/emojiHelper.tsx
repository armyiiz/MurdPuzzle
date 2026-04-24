import React, { ReactNode } from 'react';

const TINT_COLORS = [
  '#000000', // 0: Black
  '#A30B37', // 1: Deep Red
  '#228B22', // 2: Forest Green
  '#1E90FF', // 3: Royal Blue
];

const BASE_EMOJIS: Record<string, string> = {
  suspects: '🕺',
  weapons: '🗡️',
  locations: '🏠',
  motives: '💬',
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

export const getCategoryEmoji = (category: string, index: number, itemName?: string, className: string = "text-base sm:text-2xl leading-none inline-block"): ReactNode => {
  const hexColor = TINT_COLORS[index % TINT_COLORS.length];
  let emojiToRender = BASE_EMOJIS[category] || '❓';

  if (itemName) {
    const { emoji } = extractEmojiAndText(itemName);
    if (emoji) {
      emojiToRender = emoji;
    }
  }

  return (
    <span
      className={className}
      title={itemName}
      style={{ color: 'transparent', textShadow: `0 0 0 ${hexColor}` }}
    >
      {emojiToRender}
    </span>
  );
};
