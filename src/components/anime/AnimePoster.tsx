
import React, { useState } from 'react';
import { getImageUrl, getCustomImageUrl } from '@/lib/api';
import { ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimePosterProps {
  animeId: number;
  posterPath: string | null;
  title: string;
}

const AnimePoster: React.FC<AnimePosterProps> = ({ animeId, posterPath, title }) => {
  const [posterLoaded, setPosterLoaded] = useState(false);
  const [posterError, setPosterError] = useState(false);
  
  const customImage = getCustomImageUrl(animeId);
  const posterImage = customImage || (posterError || !posterPath
    ? '/placeholder.svg'
    : getImageUrl(posterPath, 'w500'));

  return (
    <div className="relative aspect-[2/3] w-full max-w-[250px] md:max-w-none mx-auto md:mx-0 rounded-lg overflow-hidden shadow-xl">
      <div className={cn(
        "absolute inset-0 bg-gray-100",
        !posterLoaded && "animate-pulse"
      )} />
      
      <img
        src={posterImage}
        alt={title}
        className="w-full h-full object-cover"
        onLoad={() => setPosterLoaded(true)}
        onError={() => setPosterError(true)}
      />
      
      {posterError && !customImage && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 bg-opacity-80 text-gray-500">
          <ImageIcon size={32} />
          <span className="mt-2 text-sm text-center">No poster available</span>
          <p className="text-xs text-center mt-2 px-2">
            Add a custom image by updating CUSTOM_ANIME_IMAGES in src/lib/api/core.ts
          </p>
        </div>
      )}
    </div>
  );
};

export default AnimePoster;
