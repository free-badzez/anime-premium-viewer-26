
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Anime } from '@/types/anime';
import { getImageUrl } from '@/lib/api';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimeCardProps {
  anime: Anime;
  priority?: boolean;
}

const AnimeCard = ({ anime, priority = false }: AnimeCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const formattedRating = anime.vote_average.toFixed(1);
  const releaseYear = anime.first_air_date ? new Date(anime.first_air_date).getFullYear() : '???';
  
  return (
    <Link 
      to={`/anime/${anime.id}`}
      className="group h-full w-full overflow-hidden rounded-lg"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg transition-all duration-300 hover-scale">
        <div className={cn(
          "absolute inset-0 bg-gray-100",
          !imageLoaded && "animate-pulse"
        )} />
        
        <img
          src={getImageUrl(anime.poster_path, 'w500')}
          alt={anime.name}
          loading={priority ? "eager" : "lazy"}
          onLoad={() => setImageLoaded(true)}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
        />
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex items-center space-x-1">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-medium">{formattedRating}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-2 space-y-1 px-1">
        <h3 className="text-sm font-medium line-clamp-1 text-balance">
          {anime.name}
        </h3>
        <p className="text-xs text-gray-500">{releaseYear}</p>
      </div>
    </Link>
  );
};

export default AnimeCard;
