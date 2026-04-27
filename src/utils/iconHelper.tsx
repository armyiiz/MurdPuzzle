import React, { ReactNode } from 'react';
import dailyMasterData from '../data/dailymasterdata.json';

const TINT_COLORS = [
  '#000000', // 0: Black
  '#A30B37', // 1: Deep Red
  '#228B22', // 2: Forest Green
  '#1E90FF', // 3: Royal Blue
];

export const getIconClass = (category: string, itemName: string): string => {
  const cleanName = itemName.trim();
  let foundIcon = '';

  const categoryData = (dailyMasterData as any)[category];
  if (categoryData) {
    const item = categoryData.find((i: any) => i.name === cleanName);
    if (item && item.icon) {
      foundIcon = item.icon;
    }
  }

  // Fallback if not found
  if (!foundIcon) {
    if (category === 'suspects') foundIcon = 'fa-solid fa-user';
    else if (category === 'weapons') foundIcon = 'fa-solid fa-gun';
    else if (category === 'locations') foundIcon = 'fa-solid fa-house';
    else if (category === 'motives') foundIcon = 'fa-solid fa-comment-dots';
    else foundIcon = 'fa-solid fa-circle-question';
  }

  return foundIcon;
};

export const getCategoryIcon = (category: string, index: number, itemName?: string, className: string = "text-base sm:text-2xl leading-none inline-block"): ReactNode => {
  const hexColor = TINT_COLORS[index % TINT_COLORS.length];
  const iconClass = itemName ? getIconClass(category, itemName) : 'fa-solid fa-circle-question';

  return (
    <i
      className={`${iconClass} ${className}`}
      title={itemName}
      style={{ color: hexColor }}
    />
  );
};
