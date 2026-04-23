import React, { ReactNode } from 'react';

const shadowColors = [
  'drop-shadow-[0_0_0_rgba(0,0,0,0.8)]',      // 0: Black
  'drop-shadow-[0_0_0_rgba(239,68,68,0.8)]',  // 1: Red
  'drop-shadow-[0_0_0_rgba(59,130,246,0.8)]', // 2: Blue
  'drop-shadow-[0_0_0_rgba(34,197,94,0.8)]',  // 3: Green
];

export const getCategoryEmoji = (category: string, index: number): ReactNode => {
  let baseEmoji = '';
  if (category === 'suspects') baseEmoji = '👤';
  else if (category === 'weapons') baseEmoji = '🔪';
  else if (category === 'locations') baseEmoji = '📍';
  else baseEmoji = '❓'; // fallback for motives or others

  const dropShadow = shadowColors[index % shadowColors.length];

  return (
    <span className={`text-xl ${dropShadow} inline-block leading-none`}>
      {baseEmoji}
    </span>
  );
};
