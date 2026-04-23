import React from 'react';
import { getCategoryEmoji } from '../utils/emojiHelper';

interface ImageWithFallbackProps {
  category: string;
  index: number;
  itemName?: string;
}

export function ImageWithFallback({ category, index, itemName }: ImageWithFallbackProps) {
  return (
    <div className="w-24 h-24 flex-shrink-0 bg-neo-notebook border-r-[3px] border-black flex items-center justify-center text-5xl">
      {getCategoryEmoji(category, index, itemName)}
    </div>
  );
}
