import React, { ReactNode } from 'react';
import dailyMasterData from '../data/dailymasterdata.json';

const TINT_COLORS = [
  '#000000', // 0: Black
  '#A30B37', // 1: Deep Red
  '#228B22', // 2: Forest Green
  '#1E90FF', // 3: Royal Blue
];

const BASE_ICONS: Record<string, string> = {
  suspects: 'fa-solid fa-user',
  weapons: 'fa-solid fa-khanda',
  locations: 'fa-solid fa-house',
  motives: 'fa-solid fa-comment-dots',
};

// Normalize names (remove parenthesis contents and trim)
const normalizeString = (str: string) => {
  if (!str) return '';
  return str.replace(/\s*\(.*?\)\s*/g, '').trim();
};

export const extractEmojiAndText = (itemName: string) => {
  // Keeping this for backwards compatibility if needed for text formatting,
  // but it's largely obsolete if everything moves to FA.
  const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/u;
  const match = itemName.match(emojiRegex);
  if (match) {
    const emoji = match[0];
    const text = itemName.replace(emoji, '').trim();
    return { emoji, text };
  }
  return { emoji: null, text: itemName };
};

export const getIconClass = (category: string, itemName?: string): string => {
  let iconClassToRender = BASE_ICONS[category] || 'fa-solid fa-circle-question';

  if (itemName) {
    const cleanName = normalizeString(itemName);

    // Look up in dailyMasterData
    let foundIcon = null;
    if (category === 'suspects' && dailyMasterData.suspects) {
      const item = dailyMasterData.suspects.find((s: any) => normalizeString(s.name) === cleanName);
      if (item && item.icon) foundIcon = item.icon;
    } else if (category === 'weapons' && dailyMasterData.weapons) {
      const item = dailyMasterData.weapons.find((w: any) => normalizeString(w.name) === cleanName);
      if (item && item.icon) foundIcon = item.icon;
    } else if (category === 'locations' && dailyMasterData.locations) {
      const item = dailyMasterData.locations.find((l: any) => normalizeString(l.name) === cleanName);
      if (item && item.icon) foundIcon = item.icon;
    } else if (category === 'motives' && dailyMasterData.motives) {
      const item = dailyMasterData.motives.find((m: any) => normalizeString(m.name) === cleanName);
      if (item && item.icon) foundIcon = item.icon;
    }

    if (foundIcon) {
      iconClassToRender = foundIcon;
    }
  }

  return iconClassToRender;
};

export const getIconColor = (index: number): string => {
  return TINT_COLORS[index % TINT_COLORS.length];
};
