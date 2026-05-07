import dailyMasterData from '../data/dailymasterdata.json';

const TINT_COLORS = [
  '#000000', // 0 Black
  '#A30B37', // 1 Deep Red
  '#228B22', // 2 Forest Green
  '#1E90FF', // 3 Royal Blue
  '#FF1493', // 4 Hot Pink
  '#FF4500', // 5 Orange Red
  '#8A2BE2', // 6 Blue Violet
  '#B8860B', // 7 Dark Goldenrod
  '#00CED1', // 8 Dark Turquoise
  '#8B4513', // 9 Saddle Brown
  '#4682B4', // 10 Steel Blue
  '#DC143C', // 11 Crimson
  '#556B2F', // 12 Dark Olive Green
  '#4B0082', // 13 Indigo
  '#D2691E', // 14 Chocolate
  '#708090', // 15 Slate Gray
];

const CAT_OFFSETS: Record<string, number> = {
  suspects: 0,
  weapons: 4,
  locations: 8,
  motives: 12,
};

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

    const masterDataByCategory = {
      suspects: dailyMasterData.suspects,
      weapons: dailyMasterData.weapons,
      locations: dailyMasterData.locations,
      motives: dailyMasterData.motives,
    } satisfies Record<string, Array<{ name: string; icon?: string }>>;

    const foundIcon = masterDataByCategory[category as keyof typeof masterDataByCategory]
      ?.find((item) => normalizeString(item.name) === cleanName)
      ?.icon;

    if (foundIcon) {
      iconClassToRender = foundIcon;
    } else if (process.env.NODE_ENV === 'development') {
      console.warn(`[Icon Warning] Missing icon for item: "${itemName}" (cleaned: "${cleanName}") in category "${category}"`);
    }
  }

  return iconClassToRender;
};

export const getIconColor = (index: number, seedString: string = '', categoryId: string = ''): string => {
  const catOffset = CAT_OFFSETS[categoryId] || 0;
  const combinedSeed = seedString; // Use only level ID for hashing to keep shifts consistent within the case
  const hash = combinedSeed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const finalIndex = (index + catOffset + hash) % TINT_COLORS.length;
  return TINT_COLORS[finalIndex];
};
