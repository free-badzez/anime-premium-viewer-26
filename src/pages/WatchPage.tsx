
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAnimeDetails, useAnimeVideo } from '@/hooks/useAnime';

// Import our components
import NavigationHeader from '@/components/watch/NavigationHeader';
import EpisodeList from '@/components/watch/EpisodeList';
import VideoPlayer from '@/components/watch/VideoPlayer';
import EpisodeDetails from '@/components/watch/EpisodeDetails';
import AnimeInfo from '@/components/watch/AnimeInfo';
import Footer from '@/components/Footer';

const WatchPage = () => {
  const { id } = useParams<{ id: string; }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  const queryParams = new URLSearchParams(location.search);
  const episodeParam = queryParams.get('episode');
  const seasonParam = queryParams.get('season');
  
  const animeId = parseInt(id || '0');
  const { data: anime, isLoading: isLoadingAnime } = useAnimeDetails(animeId);
  
  // Only set initial values after anime data is loaded to avoid invalid season/episode combinations
  const [currentSeason, setCurrentSeason] = useState(1);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showEpisodeList, setShowEpisodeList] = useState(true);
  
  // Set season and episode once anime data is loaded
  useEffect(() => {
    if (anime) {
      // Determine valid season
      const maxSeasons = anime.seasons?.length || anime.number_of_seasons || 1;
      const validSeason = seasonParam ? Math.min(parseInt(seasonParam), maxSeasons) : 1;
      setCurrentSeason(validSeason);
      
      // Determine valid episode for the season
      const episodeCount = getEpisodeCountForSeason(validSeason);
      const validEpisode = episodeParam ? Math.min(parseInt(episodeParam), episodeCount) : 1;
      setCurrentEpisode(validEpisode);
    }
  }, [anime, seasonParam, episodeParam]);
  
  // Get the actual episode count for a given season
  const getEpisodeCountForSeason = (seasonNumber: number) => {
    if (!anime) return 1;
    
    // Try to get episode count from the seasons data first
    if (anime.seasons && anime.seasons.length > 0) {
      const season = anime.seasons.find(s => s.season_number === seasonNumber);
      if (season && season.episode_count > 0) {
        return season.episode_count;
      }
    }
    
    // If this is the first season and we don't have specific season data,
    // use the total episode count
    if (seasonNumber === 1 && anime.number_of_episodes) {
      return anime.number_of_episodes;
    }
    
    // Default to 1 episode if we can't determine the count
    return 1;
  };
  
  const totalEpisodes = getEpisodeCountForSeason(currentSeason);
  
  // Use the hook to get the video ID
  const { data: videoData, isLoading: isLoadingVideo } = useAnimeVideo(
    animeId,
    anime?.name || anime?.title || '',
    currentSeason,
    currentEpisode
  );
  
  // Destructure video ID and source type (drive or youtube)
  const videoId = videoData?.id;
  const isDriveLink = videoData?.isDrive || false;
  
  const isLoading = isLoadingAnime || isLoadingVideo || !videoId;
  const title = anime?.name || anime?.title || 'Loading...';
  
  const handleEpisodeClick = (episode: number) => {
    setCurrentEpisode(episode);
    navigate(`/watch/${animeId}?season=${currentSeason}&episode=${episode}`);
  };

  const handleSeasonChange = (season: number) => {
    setCurrentSeason(season);
    // Always reset to first episode when changing season
    setCurrentEpisode(1);
    navigate(`/watch/${animeId}?season=${season}&episode=1`);
  };

  const handlePreviousEpisode = () => {
    if (currentEpisode > 1) {
      handleEpisodeClick(currentEpisode - 1);
    }
  };

  const handleNextEpisode = () => {
    if (currentEpisode < totalEpisodes) {
      handleEpisodeClick(currentEpisode + 1);
    }
  };

  // Get the actual number of seasons
  const totalSeasons = anime?.seasons?.length || anime?.number_of_seasons || 1;
  const seasons = Array.from({ length: totalSeasons }, (_, i) => i + 1);

  const toggleEpisodeList = () => setShowEpisodeList(!showEpisodeList);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white flex flex-col">
      <NavigationHeader animeId={animeId} />
      
      <div className="flex flex-1 overflow-hidden">
        {showEpisodeList && (
          <EpisodeList
            animeId={animeId}
            seasons={seasons}
            currentSeason={currentSeason}
            currentEpisode={currentEpisode}
            totalEpisodes={totalEpisodes}
            onSeasonChange={handleSeasonChange}
            onEpisodeClick={handleEpisodeClick}
            onClose={toggleEpisodeList}
          />
        )}
        
        <div className="flex-1 flex flex-col overflow-y-auto">
          <VideoPlayer
            videoId={videoId}
            isLoading={isLoading}
            isMuted={isMuted}
            showEpisodeList={showEpisodeList}
            onToggleEpisodeList={toggleEpisodeList}
            isDriveLink={isDriveLink}
          />
          
          <EpisodeDetails
            title={title}
            currentSeason={currentSeason}
            currentEpisode={currentEpisode}
          />
          
          <AnimeInfo
            anime={anime}
            title={title}
            currentSeason={currentSeason}
            currentEpisode={currentEpisode}
            totalEpisodes={totalEpisodes}
            onPreviousEpisode={handlePreviousEpisode}
            onNextEpisode={handleNextEpisode}
          />
        </div>
      </div>
      
      <div className="watch-page-footer w-full mt-8">
        <Footer />
      </div>
    </div>
  );
};

export default WatchPage;
