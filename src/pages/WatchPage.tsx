
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAnimeDetails, useAnimeVideo } from '@/hooks/useAnime';

// Import our new components
import NavigationHeader from '@/components/watch/NavigationHeader';
import EpisodeList from '@/components/watch/EpisodeList';
import VideoPlayer from '@/components/watch/VideoPlayer';
import EpisodeDetails from '@/components/watch/EpisodeDetails';
import AnimeInfo from '@/components/watch/AnimeInfo';

const WatchPage = () => {
  const { id } = useParams<{ id: string; }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  const queryParams = new URLSearchParams(location.search);
  const episodeParam = queryParams.get('episode');
  const seasonParam = queryParams.get('season');
  
  const animeId = parseInt(id || '0');
  const [currentEpisode, setCurrentEpisode] = useState(episodeParam ? parseInt(episodeParam) : 1);
  const [currentSeason, setCurrentSeason] = useState(seasonParam ? parseInt(seasonParam) : 1);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showEpisodeList, setShowEpisodeList] = useState(true);
  
  const { data: anime, isLoading: isLoadingAnime } = useAnimeDetails(animeId);
  
  // Generate season-specific episode counts
  const getEpisodeCountForSeason = (seasonNumber: number) => {
    if (anime?.seasons && anime.seasons.length > 0) {
      const season = anime.seasons.find(s => s.season_number === seasonNumber);
      if (season) {
        return season.episode_count;
      }
    }
    
    // Fallback episode counts if not found in anime data
    const fallbackCounts: Record<number, number> = {
      1: anime?.number_of_episodes || 24,
      2: 12,
      3: 24,
      4: 12,
      5: 25
    };
    
    return fallbackCounts[seasonNumber] || 12; // Default to 12 episodes
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
    setCurrentEpisode(1); // Reset to first episode when changing season
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

  const totalSeasons = anime?.seasons?.length || anime?.number_of_seasons || Math.floor(1 + Math.random() * 4);
  const seasons = Array.from({ length: totalSeasons }, (_, i) => i + 1);

  const toggleEpisodeList = () => setShowEpisodeList(!showEpisodeList);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex flex-col h-screen">
        <NavigationHeader animeId={animeId} />
        
        <div className="flex flex-1">
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
          
          <div className="flex-1 flex flex-col">
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
      </div>
    </div>
  );
};

export default WatchPage;
