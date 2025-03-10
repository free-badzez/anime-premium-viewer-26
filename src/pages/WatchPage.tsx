
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAnimeDetails, useAnimeVideo } from '@/hooks/useAnime';
import { Play, Pause, Volume2, VolumeX, Maximize, ChevronLeft, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { getImageUrl } from '@/lib/api';
import { cn } from '@/lib/utils';

const WatchPage = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const animeId = parseInt(id || '0');
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showEpisodeList, setShowEpisodeList] = useState(true);
  const navigate = useNavigate();
  
  const {
    data: anime,
    isLoading: isLoadingAnime
  } = useAnimeDetails(animeId);
  
  // Episode-specific video IDs (mock data - in a real app these would come from an API)
  const episodeVideoIds = React.useMemo(() => {
    const mockEpisodeIds = {
      1: 'o9lAlo3abBw',
      2: 'MGRm4IzK1SQ',
      3: 'VQGCKyvzIM4',
      4: 'pkKu9hLT-t8',
      5: 'QczGoCmX-pI',
      6: 'S8_YwFLCh4U',
      7: 'dQw4w9WgXcQ',
      8: 'o9lAlo3abBw',
      9: 'MGRm4IzK1SQ',
      10: 'VQGCKyvzIM4',
    };
    
    // Generate random IDs for other episodes
    const defaultVideoIds = [
      'o9lAlo3abBw', 'MGRm4IzK1SQ', 'VQGCKyvzIM4', 
      'pkKu9hLT-t8', 'QczGoCmX-pI', 'S8_YwFLCh4U'
    ];
    
    return Array.from({ length: 100 }, (_, i) => {
      const episodeNum = i + 1;
      return mockEpisodeIds[episodeNum] || 
        defaultVideoIds[Math.floor(Math.random() * defaultVideoIds.length)];
    });
  }, []);
  
  // Use the current episode's video ID
  const currentVideoId = episodeVideoIds[currentEpisode - 1];
  const isLoading = isLoadingAnime;
  
  const title = anime?.name || anime?.title || 'Loading...';
  
  // Generate dummy episode list
  const totalEpisodes = anime?.number_of_episodes || 100;
  const episodes = Array.from({
    length: totalEpisodes
  }, (_, i) => i + 1);
  
  const handleEpisodeClick = (episode: number) => {
    setCurrentEpisode(episode);
    // In a real app, you would fetch the video for the specific episode
  };
  
  const toggleMute = () => setIsMuted(!isMuted);
  const togglePlay = () => setIsPlaying(!isPlaying);
  
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="bg-gray-900 p-4">
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
        
        <div className="flex flex-1 overflow-hidden">
          {/* Episode list sidebar */}
          {showEpisodeList && (
            <div className="w-80 bg-gray-900 overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">List of episodes:</h3>
                  <Button variant="ghost" size="sm" className="text-white" onClick={() => setShowEpisodeList(false)}>
                    <ChevronLeft size={16} />
                  </Button>
                </div>
                
                <div className="flex items-center space-x-2 mb-4">
                  <List size={16} />
                  <span>EPS: 001-{totalEpisodes}</span>
                </div>
                
                <div className="grid grid-cols-5 gap-2">
                  {episodes.map(episode => (
                    <Button 
                      key={episode} 
                      variant={currentEpisode === episode ? "default" : "ghost"} 
                      size="sm" 
                      className={cn(
                        "h-10 w-full aspect-square", 
                        currentEpisode === episode 
                          ? "bg-yellow-500 text-black hover:bg-yellow-600" 
                          : "bg-gray-800 hover:bg-gray-700"
                      )} 
                      onClick={() => handleEpisodeClick(episode)}
                    >
                      {episode}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Main content */}
          <div className="flex-1 flex flex-col">
            {/* Video player */}
            <div className="relative w-full aspect-video bg-black flex-1">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div>
              ) : (
                <div className="h-full w-full">
                  <iframe 
                    src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1&mute=${isMuted ? 1 : 0}&rel=0&showinfo=0&modestbranding=1&controls=1&disablekb=1&fs=1&iv_load_policy=3&loop=0&origin=${window.location.origin}&enablejsapi=1&widgetid=1&cc_load_policy=0&hl=en-US&cc_lang_pref=en-US&playsinline=1&annotations=0&color=white&hl=en&playlist=${currentVideoId}`} 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    allow="autoplay; fullscreen" 
                    allowFullScreen 
                    title="Anime Video Player"
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  ></iframe>
                </div>
              )}
              
              {/* Button to show episode list when hidden */}
              {!showEpisodeList && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-4 left-4 bg-black/50 text-white" 
                  onClick={() => setShowEpisodeList(true)}
                >
                  <List size={16} className="mr-2" />
                  <span>Show Episodes</span>
                </Button>
              )}
            </div>
            
            {/* Anime info section */}
            <div className="bg-gray-900 p-6">
              <div className="flex">
                <div className="w-40 h-56 mr-6">
                  {anime?.poster_path ? (
                    <img 
                      src={getImageUrl(anime.poster_path, 'w300')} 
                      alt={title} 
                      className="w-full h-full object-cover rounded" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 rounded flex items-center justify-center">
                      <span>No Image</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{title}</h1>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
                    <div className="px-3 py-1 bg-gray-800 rounded text-sm">PG-13</div>
                    <div className="px-3 py-1 bg-gray-800 rounded text-sm">HD</div>
                    <div className="flex items-center px-3 py-1 bg-green-900 rounded text-sm">
                      <span className="text-green-400 mr-1">✓</span> 
                      <span>{anime?.vote_count || 0}</span>
                    </div>
                    <div className="flex items-center px-3 py-1 bg-red-900 rounded text-sm">
                      <span className="text-red-400 mr-1">✗</span> 
                      <span>{Math.floor((anime?.popularity || 0) / 10)}</span>
                    </div>
                    <div className="px-3 py-1 bg-gray-800 rounded text-sm">TV</div>
                    <div className="px-3 py-1 bg-gray-800 rounded text-sm">24m</div>
                  </div>
                  
                  <p className="text-gray-300 mb-4 line-clamp-3">{anime?.overview}</p>
                  
                  <div className="mb-4">
                    <h3 className="font-medium mb-2 text-yellow-400">Watching Episode {currentEpisode}:</h3>
                    <div className="flex space-x-4">
                      <div className="flex flex-col">
                        <span className="text-gray-400 mb-1">Language:</span>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="bg-yellow-500 text-black hover:bg-yellow-600">Japanese (SUB)</Button>
                          <Button size="sm" variant="outline" className="bg-gray-800 hover:bg-gray-700">English (DUB)</Button>
                        </div>
                      </div>
                      
                      <div className="flex flex-col">
                        <span className="text-gray-400 mb-1">Quality:</span>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="bg-yellow-500 text-black hover:bg-yellow-600">HD</Button>
                          <Button size="sm" variant="outline" className="bg-gray-800 hover:bg-gray-700">SD</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex items-center mr-4">
                      <span className="text-yellow-400 mr-2">★</span>
                      <span className="font-bold text-xl">{anime?.vote_average?.toFixed(1) || '0.0'}</span>
                    </div>
                    <Button variant="default" className="bg-gray-800 hover:bg-gray-700">
                      Vote now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
