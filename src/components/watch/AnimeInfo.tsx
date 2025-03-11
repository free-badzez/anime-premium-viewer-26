
import React from 'react';
import { ThumbsUp, ThumbsDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getImageUrl } from '@/lib/api';
import { AnimeDetail } from '@/types/anime';

interface AnimeInfoProps {
  anime: AnimeDetail | undefined;
  title: string;
  currentSeason: number;
  currentEpisode: number;
  totalEpisodes: number;
  onPreviousEpisode: () => void;
  onNextEpisode: () => void;
}

const AnimeInfo: React.FC<AnimeInfoProps> = ({
  anime,
  title,
  currentSeason,
  currentEpisode,
  totalEpisodes,
  onPreviousEpisode,
  onNextEpisode
}) => {
  return (
    <div className="flex-1 p-6 bg-zinc-900 overflow-y-auto">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-40 h-56 flex-shrink-0">
          {anime?.poster_path ? (
            <img 
              src={getImageUrl(anime.poster_path, 'w300')} 
              alt={title} 
              className="w-full h-full object-cover rounded-lg shadow-lg" 
            />
          ) : (
            <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center">
              <span>No Image</span>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{title}</h1>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-4">
            <div className="px-3 py-1 bg-gray-800/80 rounded text-sm text-center">PG-13</div>
            <div className="px-3 py-1 bg-gray-800/80 rounded text-sm text-center">HD</div>
            <div className="px-3 py-1 bg-yellow-600/90 rounded text-sm text-center font-medium">SUB</div>
            <div className="px-3 py-1 bg-gray-800/80 rounded text-sm text-center">TV</div>
            <div className="px-3 py-1 bg-gray-800/80 rounded text-sm text-center">24m</div>
            <div className="flex items-center justify-center px-3 py-1 bg-green-900/70 rounded text-sm">
              <span className="text-green-400 mr-1">★</span> 
              <span>{anime?.vote_average?.toFixed(1) || '0.0'}</span>
            </div>
          </div>
          
          <p className="text-gray-300 mb-5 line-clamp-3 hover:line-clamp-none transition-all duration-300 text-sm leading-relaxed">
            {anime?.overview}
          </p>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2 text-yellow-400">Language Options:</h3>
              <div className="flex flex-wrap gap-3">
                <Button size="sm" variant="outline" className="bg-yellow-500 text-black hover:bg-yellow-600">SUB</Button>
                <Button size="sm" variant="outline" className="bg-gray-800 hover:bg-gray-700">DUB</Button>
                <Button size="sm" variant="outline" className="bg-yellow-500 text-black hover:bg-yellow-600">HD</Button>
                <Button size="sm" variant="outline" className="bg-gray-800 hover:bg-gray-700">SD</Button>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="gradient" className="text-black">
                Vote Now
              </Button>
              
              <Button variant="glow">
                Add to List
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-6 px-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onPreviousEpisode}
          disabled={currentEpisode <= 1}
          className="bg-gray-800/50 border-gray-700"
        >
          <ChevronLeft size={16} className="mr-1" />
          Previous
        </Button>
        
        <span className="text-sm text-gray-400">Episode {currentEpisode} of {totalEpisodes}</span>
        
        <Button 
          variant="outline"
          size="sm"
          onClick={onNextEpisode}
          disabled={currentEpisode >= totalEpisodes}
          className="bg-gray-800/50 border-gray-700"
        >
          Next
          <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default AnimeInfo;
