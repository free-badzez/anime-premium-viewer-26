
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, Search, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { cn } from '@/lib/utils';

interface EpisodeListProps {
  animeId: number;
  seasons: number[];
  currentSeason: number;
  currentEpisode: number;
  totalEpisodes: number;
  onSeasonChange: (season: number) => void;
  onEpisodeClick: (episode: number) => void;
  onClose: () => void;
}

const EpisodeList: React.FC<EpisodeListProps> = ({
  animeId,
  seasons,
  currentSeason,
  currentEpisode,
  totalEpisodes,
  onSeasonChange,
  onEpisodeClick,
  onClose
}) => {
  const [searchEpisode, setSearchEpisode] = useState('');
  const [currentEpisodePage, setCurrentEpisodePage] = useState(1);
  const episodesPerPage = 30;

  const episodes = Array.from({ length: totalEpisodes }, (_, i) => i + 1);
  
  const filteredEpisodes = searchEpisode ? 
    episodes.filter(ep => ep.toString().includes(searchEpisode)) : 
    episodes;

  const totalPages = Math.ceil(filteredEpisodes.length / episodesPerPage);
  const currentPageEpisodes = filteredEpisodes.slice(
    (currentEpisodePage - 1) * episodesPerPage,
    currentEpisodePage * episodesPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentEpisodePage(page);
  };

  useEffect(() => {
    if (currentEpisode) {
      const pageIndex = Math.ceil(currentEpisode / episodesPerPage);
      setCurrentEpisodePage(pageIndex || 1);
    }
  }, [currentEpisode, episodesPerPage]);

  // Reset episode page when season changes
  useEffect(() => {
    setCurrentEpisodePage(1);
  }, [currentSeason]);

  return (
    <div className="w-80 bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="p-4 bg-neutral-950">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">List of episodes:</h3>
          <Button variant="ghost" size="sm" className="text-white" onClick={onClose}>
            <ChevronLeft size={16} />
          </Button>
        </div>
        
        <div className="mb-6">
          <h4 className="text-sm text-gray-400 mb-2">Season:</h4>
          <div className="flex flex-wrap gap-2">
            {seasons.map(season => (
              <Button 
                key={season} 
                variant={currentSeason === season ? "default" : "outline"} 
                size="sm" 
                onClick={() => onSeasonChange(season)} 
                className={cn(
                  "relative group overflow-hidden", 
                  currentSeason === season 
                    ? "bg-gradient-to-br from-yellow-500 to-amber-600 text-black hover:from-yellow-400 hover:to-amber-500 shadow-md shadow-yellow-500/20" 
                    : "bg-gray-800/70 backdrop-blur-sm hover:bg-gray-700 border border-gray-700/50 transition-all duration-300"
                )}
              >
                <span className="relative z-10">{season}</span>
                {currentSeason === season && <div className="absolute inset-0 bg-yellow-400/20 animate-pulse"></div>}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-yellow-500/20 to-transparent transition-opacity duration-300"></div>
              </Button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <List size={16} />
            <span>EPS: 001-{totalEpisodes}</span>
          </div>
          
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Episode #" 
              value={searchEpisode} 
              onChange={e => setSearchEpisode(e.target.value)} 
              className="pl-8 py-1 text-sm bg-gray-800 rounded w-28 focus:outline-none focus:ring-1 focus:ring-yellow-500" 
            />
          </div>
        </div>
        
        <div className="grid grid-cols-5 gap-2 mb-4">
          {currentPageEpisodes.map(episode => (
            <Button 
              key={episode} 
              variant={currentEpisode === episode ? "default" : "ghost"} 
              size="sm" 
              className={cn(
                "h-10 w-full relative group overflow-hidden", 
                currentEpisode === episode 
                  ? "bg-gradient-to-br from-yellow-500 to-amber-600 text-black hover:from-yellow-400 hover:to-amber-500 shadow-md shadow-yellow-500/20" 
                  : "bg-gray-800/70 backdrop-blur-sm hover:bg-gray-700 border border-gray-700/50 transition-all duration-300"
              )} 
              onClick={() => onEpisodeClick(episode)}
            >
              <span className="relative z-10">{episode}</span>
              {currentEpisode === episode && <div className="absolute inset-0 bg-yellow-400/20 animate-pulse"></div>}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-yellow-500/20 to-transparent transition-opacity duration-300"></div>
            </Button>
          ))}
        </div>
        
        {totalPages > 1 && (
          <Pagination className="mt-3">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(Math.max(1, currentEpisodePage - 1))}
                  className={currentEpisodePage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageToShow;
                if (totalPages <= 5) {
                  pageToShow = i + 1;
                } else if (currentEpisodePage <= 3) {
                  pageToShow = i + 1;
                } else if (currentEpisodePage >= totalPages - 2) {
                  pageToShow = totalPages - 4 + i;
                } else {
                  pageToShow = currentEpisodePage - 2 + i;
                }
                
                return (
                  <PaginationItem key={i}>
                    <PaginationLink 
                      onClick={() => handlePageChange(pageToShow)}
                      isActive={currentEpisodePage === pageToShow}
                      className={currentEpisodePage === pageToShow ? "bg-gradient-to-br from-yellow-500 to-amber-600 text-black" : ""}
                    >
                      {pageToShow}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(Math.min(totalPages, currentEpisodePage + 1))}
                  className={currentEpisodePage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
};

export default EpisodeList;
