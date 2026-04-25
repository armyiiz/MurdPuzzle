/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode } from 'react';
import motivesData from '../data/Motive.json';
import suspectsData from '../data/suspect_details.json';
import masterData from '../data/masterdata.json';

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

const SUSPECT_EMOJIS = Object.values(suspectsData).map((s: any) => s.emoji).filter(Boolean);
const WEAPON_EMOJIS = masterData.weapons_master.map((w: any) => w.emoji).filter(Boolean);
const LOCATION_EMOJIS = masterData.rooms_master.map((r: any) => r.emoji).filter(Boolean);
const MOTIVE_EMOJIS = Object.values(motivesData).map((m: any) => m.emoji).filter(Boolean);

const hashString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash += str.charCodeAt(i);
  }
  return hash;
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
    const { emoji, text } = extractEmojiAndText(itemName);
    if (emoji) {
      emojiToRender = emoji;
    } else {
      const cleanName = text.trim();
      let foundExact = false;

      if (category === 'suspects') {
        const suspect = (suspectsData as Record<string, any>)[cleanName];
        if (suspect && suspect.emoji) { emojiToRender = suspect.emoji; foundExact = true; }
      } else if (category === 'motives') {
        const motive = (motivesData as Record<string, any>)[cleanName];
        if (motive && motive.emoji) { emojiToRender = motive.emoji; foundExact = true; }
      } else if (category === 'weapons') {
        const weapon = masterData.weapons_master.find(w => w.name === cleanName);
        if (weapon && weapon.emoji) { emojiToRender = weapon.emoji; foundExact = true; }
      } else if (category === 'locations') {
        const room = masterData.rooms_master.find(r => r.name === cleanName);
        if (room && room.emoji) { emojiToRender = room.emoji; foundExact = true; }
      }

      if (!foundExact) {
        let pool: string[] | null = null;
        if (category === 'suspects' && SUSPECT_EMOJIS.length > 0) pool = SUSPECT_EMOJIS;
        else if (category === 'weapons' && WEAPON_EMOJIS.length > 0) pool = WEAPON_EMOJIS;
        else if (category === 'locations' && LOCATION_EMOJIS.length > 0) pool = LOCATION_EMOJIS;
        else if (category === 'motives' && MOTIVE_EMOJIS.length > 0) pool = MOTIVE_EMOJIS;

        if (pool) {
          const hashIndex = hashString(cleanName) % pool.length;
          emojiToRender = pool[hashIndex] || BASE_EMOJIS[category] || '❓';
        }
      }
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
