import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAnimeDetails } from '@/hooks/useAnime';
import { Play, Pause, Volume2, VolumeX, Maximize, ChevronLeft, List, ThumbsUp, ThumbsDown, Search, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { getImageUrl } from '@/lib/api';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { getAnimeVideo } from '@/lib/api/details';

const WatchPage = () => {
  const { id } = useParams<{ id: string; }>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const episodeParam = queryParams.get('episode');
  const seasonParam = queryParams.get('season');
  const animeId = parseInt(id || '0');
  const [currentEpisode, setCurrentEpisode] = useState(episodeParam ? parseInt(episodeParam) : 1);
  const [currentSeason, setCurrentSeason] = useState(seasonParam ? parseInt(seasonParam) : 1);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showEpisodeList, setShowEpisodeList] = useState(true);
  const [searchEpisode, setSearchEpisode] = useState('');
  const [currentEpisodePage, setCurrentEpisodePage] = useState(1);
  const [currentVideoId, setCurrentVideoId] = useState('');
  const episodesPerPage = 30;

  const navigate = useNavigate();
  
  const { data: anime, isLoading: isLoadingAnime } = useAnimeDetails(animeId);
  
  useEffect(() => {
    const fetchVideo = async () => {
      if (anime && anime.name) {
        const videoId = await getAnimeVideo(
          animeId,
          anime.name || anime.title || '',
          currentSeason,
          currentEpisode
        );
        setCurrentVideoId(videoId);
      }
    };
    
    fetchVideo();
  }, [anime, animeId, currentSeason, currentEpisode]);
  
  const isLoading = isLoadingAnime || !currentVideoId;
  const title = anime?.name || anime?.title || 'Loading...';
  const totalEpisodes = currentSeason === 1 ? anime?.number_of_episodes || 24 : Math.floor(10 + Math.random() * 115);
  const episodes = Array.from({ length: totalEpisodes }, (_, i) => i + 1);
  
  const filteredEpisodes = searchEpisode ? 
    episodes.filter(ep => ep.toString().includes(searchEpisode)) : 
    episodes;

  const totalPages = Math.ceil(filteredEpisodes.length / episodesPerPage);
  const currentPageEpisodes = filteredEpisodes.slice(
    (currentEpisodePage - 1) * episodesPerPage,
    currentEpisodePage * episodesPerPage
  );

  const handleEpisodeClick = (episode: number) => {
    setCurrentEpisode(episode);
    navigate(`/watch/${animeId}?season=${currentSeason}&episode=${episode}`);
  };

  const handleSeasonChange = (season: number) => {
    setCurrentSeason(season);
    setCurrentEpisode(1);
    setCurrentEpisodePage(1);
    navigate(`/watch/${animeId}?season=${season}&episode=1`);
  };

  const totalSeasons = anime?.seasons?.length || anime?.number_of_seasons || Math.floor(1 + Math.random() * 4);
  const seasons = Array.from({ length: totalSeasons }, (_, i) => i + 1);

  const toggleMute = () => setIsMuted(!isMuted);
  const togglePlay = () => setIsPlaying(!isPlaying);

  const handlePageChange = (page: number) => {
    setCurrentEpisodePage(page);
  };

  useEffect(() => {
    if (currentEpisode) {
      const pageIndex = Math.ceil(currentEpisode / episodesPerPage);
      setCurrentEpisodePage(pageIndex || 1);
    }
  }, [currentEpisode, episodesPerPage]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex flex-col h-screen">
        <div className="p-4 bg-neutral-900">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="text-white mr-4" onClick={() => navigate(`/anime/${animeId}`)}>
              <ChevronLeft size={20} />
              <span>Back</span>
            </Button>
            
            <Link to="/" className="text-white hover:text-gray-300 mr-4">Home</Link>
            <span className="text-gray-500 mx-2">•</span>
            <Link to="/tv" className="text-white hover:text-gray-300 mr-4">TV</Link>
            <span className="text-gray-500 mx-2">•</span>
            <Link to="/trending" className="text-white hover:text-gray-300 mr-4">Trending</Link>
            <span className="text-gray-500 mx-2">•</span>
            <Link to="/top-rated" className="text-white hover:text-gray-300 mr-4">Top Rated</Link>
            <span className="text-gray-500 mx-2">•</span>
            <span className="text-gray-400">Watching {title}</span>
          </div>
        </div>
        
        <div className="flex flex-1">
          {showEpisodeList && (
            <div className="w-80 bg-gray-900 border-r border-gray-800 flex flex-col">
              <div className="p-4 bg-neutral-950">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">List of episodes:</h3>
                  <Button variant="ghost" size="sm" className="text-white" onClick={() => setShowEpisodeList(false)}>
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
                        onClick={() => handleSeasonChange(season)} 
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
                      onClick={() => handleEpisodeClick(episode)}
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
          )}
          
          <div className="flex-1 flex flex-col">
            <div className="relative w-full bg-black" style={{ height: "65vh" }}>
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div>
              ) : (
                <div className="h-full w-full">
                  <iframe 
                    src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1&mute=${isMuted ? 1 : 0}&rel=0&showinfo=0&modestbranding=1&controls=1&disablekb=1&fs=1&iv_load_policy=3&loop=0&origin=${window.location.origin}&enablejsapi=1&widgetid=1&cc_load_policy=0&hl=en-US&cc_lang_pref=en-US&playsinline=1&annotations=0&color=white&hl=en&playlist=${currentVideoId}&nologo=1`} 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    allow="autoplay; fullscreen" 
                    allowFullScreen 
                    title="Anime Video Player" 
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%'
                    }}
                  ></iframe>
                </div>
              )}
              
              {!showEpisodeList && (
                <Button variant="ghost" size="sm" className="absolute top-4 left-4 bg-black/50 text-white" onClick={() => setShowEpisodeList(true)}>
                  <List size={16} className="mr-2" />
                  <span>Show Episodes</span>
                </Button>
              )}
            </div>
            
            <div className="p-4 bg-neutral-900">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  {title} - S{currentSeason} E{currentEpisode}
                </h2>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="bg-gray-700">
                    <ThumbsUp size={16} className="mr-1" />
                    {Math.floor(Math.random() * 1000) + 100}
                  </Button>
                  <Button variant="outline" size="sm" className="bg-gray-700">
                    <ThumbsDown size={16} className="mr-1" />
                    {Math.floor(Math.random() * 100)}
                  </Button>
                </div>
              </div>
            </div>
            
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
                  onClick={() => currentEpisode > 1 && handleEpisodeClick(currentEpisode - 1)}
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
                  onClick={() => currentEpisode < totalEpisodes && handleEpisodeClick(currentEpisode + 1)}
                  disabled={currentEpisode >= totalEpisodes}
                  className="bg-gray-800/50 border-gray-700"
                >
                  Next
                  <ChevronRight size={16} className="ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
