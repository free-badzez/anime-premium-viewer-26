import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAnimeDetails, useAnimeVideo } from '@/hooks/useAnime';
import { Play, Pause, Volume2, VolumeX, Maximize, ChevronLeft, List, ThumbsUp, ThumbsDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { getImageUrl } from '@/lib/api';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
const WatchPage = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
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
  const navigate = useNavigate();
  const {
    data: anime,
    isLoading: isLoadingAnime
  } = useAnimeDetails(animeId);

  // Episode-specific video IDs based on anime ID
  const episodeVideoIds = React.useMemo(() => {
    // Video pool - different YouTube videos for different content
    const videoPool = ['o9lAlo3abBw', 'MGRm4IzK1SQ', 'VQGCKyvzIM4', 'pkKu9hLT-t8', 'QczGoCmX-pI', 'S8_YwFLCh4U', 'dQw4w9WgXcQ', 'kJQP7kiw5Fk', '9bZkp7q19f0', 'JGwWNGJdvx8', 'pRpeEdMmmQ0', 'hT_nvWreIhg', 'fJ9rUzIMcZQ', '60ItHLz5WEA', 'YqeW9_5kURI', 'RgKAFK5djSk', '0KSOMA3QBU0', 'ktvTqknDobU', 'PT2_F-1esPk', 'papuvlVeZg8', '1G4isv_Fylg', 'YykjpeuMNEk', '2vjPBrBU-TM', 'rYEDA3JcQqw'];

    // Use anime ID to determine starting point in the pool
    const startIndex = animeId % videoPool.length;

    // Generate unique IDs per episode and season
    const videoMap = {};

    // For each season, generate episode videos
    for (let s = 1; s <= 10; s++) {
      videoMap[s] = {};
      for (let e = 1; e <= 25; e++) {
        // Create a "unique" index based on anime ID, season and episode
        const videoIndex = (startIndex + s * 5 + e) % videoPool.length;
        videoMap[s][e] = videoPool[videoIndex];
      }
    }
    return videoMap;
  }, [animeId]);

  // Use the current episode's video ID for the current season
  const currentVideoId = episodeVideoIds[currentSeason]?.[currentEpisode] || 'dQw4w9WgXcQ';
  const isLoading = isLoadingAnime;
  const title = anime?.name || anime?.title || 'Loading...';

  // Generate episode list based on season
  const totalEpisodes = currentSeason === 1 ? anime?.number_of_episodes || 24 : Math.floor(10 + Math.random() * 15); // Random number of episodes for other seasons

  const episodes = Array.from({
    length: totalEpisodes
  }, (_, i) => i + 1);
  const filteredEpisodes = searchEpisode ? episodes.filter(ep => ep.toString().includes(searchEpisode)) : episodes;
  const handleEpisodeClick = (episode: number) => {
    setCurrentEpisode(episode);
    navigate(`/watch/${animeId}?season=${currentSeason}&episode=${episode}`);
  };
  const handleSeasonChange = (season: number) => {
    setCurrentSeason(season);
    setCurrentEpisode(1);
    navigate(`/watch/${animeId}?season=${season}&episode=1`);
  };

  // Get total seasons
  const totalSeasons = anime?.seasons?.length || anime?.number_of_seasons || Math.floor(1 + Math.random() * 4);
  const seasons = Array.from({
    length: totalSeasons
  }, (_, i) => i + 1);
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
            <Link to="/trending" className="text-white hover:text-gray-300 mr-4">Trending</Link>
            <span className="text-gray-500 mx-2">•</span>
            <Link to="/top-rated" className="text-white hover:text-gray-300 mr-4">Top Rated</Link>
            <span className="text-gray-500 mx-2">•</span>
            <span className="text-gray-400">Watching {title}</span>
          </div>
        </div>
        
        <div className="flex flex-1">
          {/* Episode list sidebar */}
          {showEpisodeList && <div className="w-80 bg-gray-900 border-r border-gray-800">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">List of episodes:</h3>
                  <Button variant="ghost" size="sm" className="text-white" onClick={() => setShowEpisodeList(false)}>
                    <ChevronLeft size={16} />
                  </Button>
                </div>
                
                {/* Season selector */}
                <div className="mb-6">
                  <h4 className="text-sm text-gray-400 mb-2">Season:</h4>
                  <div className="flex flex-wrap gap-2">
                    {seasons.map(season => <Button key={season} variant={currentSeason === season ? "default" : "outline"} size="sm" onClick={() => handleSeasonChange(season)} className="bg-[#e0a830] text-slate-950">
                        {season}
                      </Button>)}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <List size={16} />
                    <span>EPS: 001-{totalEpisodes}</span>
                  </div>
                  
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="text" placeholder="Episode #" value={searchEpisode} onChange={e => setSearchEpisode(e.target.value)} className="pl-8 py-1 text-sm bg-gray-800 rounded w-28 focus:outline-none focus:ring-1 focus:ring-yellow-500" />
                  </div>
                </div>
                
                <div className="h-[calc(100vh-220px)] pr-1">
                  <div className="grid grid-cols-5 gap-2">
                    {filteredEpisodes.map(episode => <Button key={episode} variant={currentEpisode === episode ? "default" : "ghost"} size="sm" className={cn("h-10 w-full relative group overflow-hidden", currentEpisode === episode ? "bg-gradient-to-br from-yellow-500 to-amber-600 text-black hover:from-yellow-400 hover:to-amber-500 shadow-md shadow-yellow-500/20" : "bg-gray-800/70 backdrop-blur-sm hover:bg-gray-700 border border-gray-700/50 transition-all duration-300")} onClick={() => handleEpisodeClick(episode)}>
                        <span className="relative z-10">{episode}</span>
                        {currentEpisode === episode && <div className="absolute inset-0 bg-yellow-400/20 animate-pulse"></div>}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-yellow-500/20 to-transparent transition-opacity duration-300"></div>
                      </Button>)}
                  </div>
                </div>
              </div>
            </div>}
          
          {/* Main content */}
          <div className="flex-1 flex flex-col">
            {/* Video player section */}
            <div className="relative w-full bg-black" style={{
            height: "65vh"
          }}>
              {isLoading ? <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div> : <div className="h-full w-full">
                  <iframe src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1&mute=${isMuted ? 1 : 0}&rel=0&showinfo=0&modestbranding=1&controls=1&disablekb=1&fs=1&iv_load_policy=3&loop=0&origin=${window.location.origin}&enablejsapi=1&widgetid=1&cc_load_policy=0&hl=en-US&cc_lang_pref=en-US&playsinline=1&annotations=0&color=white&hl=en&playlist=${currentVideoId}`} width="100%" height="100%" frameBorder="0" allow="autoplay; fullscreen" allowFullScreen title="Anime Video Player" style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
              }}></iframe>
                </div>}
              
              {/* Button to show episode list when hidden */}
              {!showEpisodeList && <Button variant="ghost" size="sm" className="absolute top-4 left-4 bg-black/50 text-white" onClick={() => setShowEpisodeList(true)}>
                  <List size={16} className="mr-2" />
                  <span>Show Episodes</span>
                </Button>}
              
              {/* Video controls overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={togglePlay} className="text-white">
                      {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white">
                      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </Button>
                    <span className="text-white">00:00 / 24:37</span>
                  </div>
                  <div>
                    <Button variant="ghost" size="icon" className="text-white">
                      <Maximize size={20} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Current episode info */}
            <div className="bg-gray-800 p-4">
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
            
            {/* Anime details section */}
            <div className="flex bg-gray-900 p-6">
              <div className="w-40 h-56 mr-6 flex-shrink-0">
                {anime?.poster_path ? <img src={getImageUrl(anime.poster_path, 'w300')} alt={title} className="w-full h-full object-cover rounded" /> : <div className="w-full h-full bg-gray-800 rounded flex items-center justify-center">
                    <span>No Image</span>
                  </div>}
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{title}</h1>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
                  <div className="px-3 py-1 bg-gray-800 rounded text-sm">PG-13</div>
                  <div className="px-3 py-1 bg-gray-800 rounded text-sm">HD</div>
                  <div className="px-3 py-1 bg-yellow-600 rounded text-sm">SUB</div>
                  <div className="px-3 py-1 bg-gray-800 rounded text-sm">TV</div>
                  <div className="px-3 py-1 bg-gray-800 rounded text-sm">24m</div>
                  <div className="flex items-center px-3 py-1 bg-green-900/70 rounded text-sm">
                    <span className="text-green-400 mr-1">★</span> 
                    <span>{anime?.vote_average?.toFixed(1) || '0.0'}</span>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-4 max-h-36">{anime?.overview}</p>
                
                <div className="mb-4">
                  <h3 className="font-medium mb-2 text-yellow-400">Language Options:</h3>
                  <div className="flex space-x-4">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="bg-yellow-500 text-black hover:bg-yellow-600">SUB</Button>
                      <Button size="sm" variant="outline" className="bg-gray-800 hover:bg-gray-700">DUB</Button>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="bg-yellow-500 text-black hover:bg-yellow-600">HD</Button>
                      <Button size="sm" variant="outline" className="bg-gray-800 hover:bg-gray-700">SD</Button>
                    </div>
                  </div>
                </div>
                
                <Button variant="default" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  Vote Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default WatchPage;