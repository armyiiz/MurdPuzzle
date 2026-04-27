import React from 'react';
import { getIconClass, getIconColor } from '../utils/emojiHelper';

interface ImageWithFallbackProps {
  category: string;
  index: number;
  itemName?: string;
  seedString?: string;
}

export function ImageWithFallback({ category, index, itemName, seedString }: ImageWithFallbackProps) {
  return (
    <div className="w-24 h-24 flex-shrink-0 bg-neo-notebook border-r-[3px] border-black flex items-center justify-center text-5xl">
      <i className={`${getIconClass(category, itemName)} text-5xl leading-none inline-block [text-shadow:2px_2px_0_#000]`} style={{ color: getIconColor(index, seedString) }}></i>
    </div>
  );
}
