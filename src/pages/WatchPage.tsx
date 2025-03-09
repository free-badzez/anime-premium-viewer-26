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
  const {
    data: videoId,
    isLoading: isLoadingVideo
  } = useAnimeVideo(anime?.title || anime?.name || '');
  const title = anime?.name || anime?.title || 'Loading...';
  const isLoading = isLoadingAnime || isLoadingVideo;

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

  return <div className="min-h-screen bg-black text-white">
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
            <span className="text-gray-400">Watching {title}</span>
          </div>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Episode list sidebar */}
          {showEpisodeList && <div className="w-80 bg-gray-900 overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">List of episodes:</h3>
                  <Button variant="ghost" size="sm" className="text-white" onClick={() => setShowEpisodeList(false)}>
                    <ChevronLeft size={16} />
                  </Button>
                </div>
                
                <div className="flex items-center space-x-2 mb-4">
                  <List size={16} />
                  <span>EPS: 001-100</span>
                </div>
                
                <div className="grid grid-cols-5 gap-2">
                  {episodes.map(episode => <Button key={episode} variant={currentEpisode === episode ? "default" : "ghost"} size="sm" className={cn("h-10 w-full aspect-square", currentEpisode === episode ? "bg-yellow-500 text-black hover:bg-yellow-600" : "bg-gray-800 hover:bg-gray-700")} onClick={() => handleEpisodeClick(episode)}>
                      {episode}
                    </Button>)}
                </div>
              </div>
            </div>}
          
          {/* Main content */}
          <div className="flex-1 flex flex-col">
            {/* Video player */}
            <div className="relative w-full aspect-video bg-black flex-1">
              {isLoading ? <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div> : <div className="h-full w-full">
                  <iframe 
                    src={`https://www.dailymotion.com/embed/video/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&queue-enable=0&ui-highlight=FFC300&ui-logo=0&sharing-enable=0&end-screen-enable=0&related-videos=0&related-enable=0`} 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    allow="autoplay; fullscreen" 
                    allowFullScreen 
                    title="Anime Video Player"
                  ></iframe>
                  
                  {/* Custom controls overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-4">
                        
                        
                        <Button variant="ghost" size="icon" className="text-white" onClick={toggleMute}>
                          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </Button>
                        
                        <div className="text-sm text-white">
                          00:00 / 24:37
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon" className="text-white">
                          <Maximize size={20} />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="w-full h-1 bg-gray-700 rounded-full">
                      <div className="w-1/4 h-full bg-yellow-500 rounded-full"></div>
                    </div>
                  </div>
                </div>}
              
              {/* Button to show episode list when hidden */}
              {!showEpisodeList && <Button variant="ghost" size="sm" className="absolute top-4 left-4 bg-black/50 text-white" onClick={() => setShowEpisodeList(true)}>
                  <List size={16} className="mr-2" />
                  <span>Show Episodes</span>
                </Button>}
            </div>
            
            {/* Anime info section */}
            <div className="bg-gray-900 p-6">
              <div className="flex">
                <div className="w-40 h-56 mr-6">
                  {anime?.poster_path ? <img src={getImageUrl(anime.poster_path, 'w300')} alt={title} className="w-full h-full object-cover rounded" /> : <div className="w-full h-full bg-gray-800 rounded flex items-center justify-center">
                      <span>No Image</span>
                    </div>}
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
                    <h3 className="font-medium mb-2 text-yellow-400">Watching options:</h3>
                    <div className="flex space-x-4">
                      <div className="flex flex-col">
                        <span className="text-gray-400 mb-1">SUB:</span>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="bg-yellow-500 text-black hover:bg-yellow-600">VidSrc</Button>
                          <Button size="sm" variant="outline" className="bg-gray-800 hover:bg-gray-700">MegaCloud</Button>
                        </div>
                      </div>
                      
                      <div className="flex flex-col">
                        <span className="text-gray-400 mb-1">DUB:</span>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="bg-gray-800 hover:bg-gray-700">VidSrc</Button>
                          <Button size="sm" variant="outline" className="bg-gray-800 hover:bg-gray-700">MegaCloud</Button>
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
    </div>;
};

export default WatchPage;
