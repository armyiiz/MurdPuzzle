import React, { useState } from 'react';
import { getCategoryEmoji } from '../utils/emojiHelper';

interface ImageWithFallbackProps {
  category: string;
  index: number;
}

export function ImageWithFallback({ category, index }: ImageWithFallbackProps) {
  const [imgError, setImgError] = useState(false);
  const letter = category.charAt(0).toLowerCase();
  const id = `${letter}${index + 1}`;
  const src = `/images/${category}/${id}.webp`;

  if (imgError) {
    return (
      <div className="w-full aspect-square bg-neo-notebook border-b-[3px] border-black flex items-center justify-center text-4xl">
        {getCategoryEmoji(category, index)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`${category} ${index}`}
      onError={() => setImgError(true)}
      className="w-full aspect-square object-cover border-b-[3px] border-black"
    />
  );
}
