import React, { ReactNode } from 'react';
import dailyMasterData from '../data/dailymasterdata.json';

const TINT_COLORS = [
  '#000000', // Black
  '#A30B37', // Deep Red
  '#228B22', // Forest Green
  '#1E90FF', // Royal Blue
  '#FF1493', // Hot Pink
  '#FF4500', // Orange Red
  '#8A2BE2', // Blue Violet
  '#FFD700', // Bright Gold
  '#00CED1', // Dark Turquoise
  '#8B4513', // Saddle Brown
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
    } else if (process.env.NODE_ENV === 'development') {
      console.warn(`[Icon Warning] Missing icon for item: "${itemName}" (cleaned: "${cleanName}") in category "${category}"`);
    }
  }

  return iconClassToRender;
};

export const getIconColor = (index: number, seedString: string = '', categoryId: string = ''): string => {
  const combinedSeed = seedString + categoryId;
  const hash = combinedSeed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const offsetIndex = (index + hash) % TINT_COLORS.length;
  return TINT_COLORS[offsetIndex];
};
