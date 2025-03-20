
import React, { useState, useEffect } from 'react';
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
  const [fallbackImage, setFallbackImage] = useState<string | null>(null);
  
  const customImage = getCustomImageUrl(animeId);
  
  // Try to find a fallback image from different sources
  useEffect(() => {
    if (posterError && !customImage) {
      // Try to fetch a fallback image from an external API
      fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(title)}&limit=1`)
        .then(response => response.json())
        .then(data => {
          if (data.data && data.data.length > 0 && data.data[0].images?.jpg?.image_url) {
            setFallbackImage(data.data[0].images.jpg.image_url);
          }
        })
        .catch(err => {
          console.error('Error fetching fallback image:', err);
        });
    }
  }, [posterError, customImage, title]);
  
  const posterImage = customImage || (fallbackImage && posterError) 
    ? fallbackImage
    : (posterError || !posterPath
      ? '/placeholder.svg'
      : getImageUrl(posterPath, 'w500'));

  return (
    <div className="relative aspect-[2/3] w-full max-w-[250px] md:max-w-none mx-auto md:mx-0 rounded-lg overflow-hidden shadow-xl">
      <div className={cn(
        "absolute inset-0 bg-gray-100 dark:bg-gray-800",
        !posterLoaded && "animate-pulse"
      )} />
      
      <img
        src={posterImage}
        alt={title}
        className="w-full h-full object-cover"
        onLoad={() => setPosterLoaded(true)}
        onError={() => {
          if (!fallbackImage && !customImage) {
            setPosterError(true);
          } else if (fallbackImage) {
            // If we're showing the fallback image and it succeeds, mark as loaded
            setPosterLoaded(true);
          }
        }}
      />
      
      {posterError && !customImage && !fallbackImage && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 dark:bg-gray-800 bg-opacity-80 text-gray-500">
          <ImageIcon size={32} />
          <span className="mt-2 text-sm text-center">No poster available</span>
        </div>
      )}
    </div>
  );
};

export default AnimePoster;
