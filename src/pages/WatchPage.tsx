
import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useAnimeDetails, useAnimeVideo } from '@/hooks/useAnime';

// Import our components
import NavigationHeader from '@/components/watch/NavigationHeader';
import WatchPageContent from '@/components/watch/WatchPageContent';
import ErrorState from '@/components/watch/ErrorState';
import Footer from '@/components/Footer';
import { useWatchPageState } from '@/hooks/useWatchPageState';

const WatchPage = () => {
  const { id } = useParams<{ id: string; }>();
  const location = useLocation();
  
  const queryParams = new URLSearchParams(location.search);
  const episodeParam = queryParams.get('episode');
  const seasonParam = queryParams.get('season');
  
  const animeId = parseInt(id || '0');
  const { data: anime, isLoading: isLoadingAnime, error } = useAnimeDetails(animeId);
  
  // Use our custom hook to manage state
  const {
    currentSeason,
    currentEpisode,
    isMuted,
    showEpisodeList,
    totalEpisodes,
    availableSeasons,
    handleEpisodeClick,
    handleSeasonChange,
    handlePreviousEpisode,
    handleNextEpisode,
    toggleEpisodeList
  } = useWatchPageState(animeId, anime, seasonParam, episodeParam);
  
  // Use the hook to get the video ID only when we have valid season and episode
  const { data: videoData, isLoading: isLoadingVideo } = useAnimeVideo(
    animeId,
    anime?.name || anime?.title || '',
    currentSeason || 1,
    currentEpisode || 1
  );
  
  // Destructure video ID and source type (drive or youtube)
  const videoId = videoData?.id;
  const isDriveLink = videoData?.isDrive || false;
  const videoAvailable = !!videoData;
  
  const isLoading = isLoadingAnime || isLoadingVideo || currentSeason === null || currentEpisode === null;
  const title = anime?.name || anime?.title || 'Loading...';
  
  // If there's an error loading the anime
  if (error) {
    return <ErrorState />;
  }

  // If there's no video available after loading
  if (!isLoading && !videoAvailable) {
    return <ErrorState message="No video is available for this anime." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white flex flex-col">
      <NavigationHeader animeId={animeId} />
      
      <WatchPageContent
        animeId={animeId}
        title={title}
        anime={anime}
        videoId={videoId}
        isLoading={isLoading}
        isMuted={isMuted}
        isDriveLink={isDriveLink}
        currentSeason={currentSeason || 1}
        currentEpisode={currentEpisode || 1}
        totalEpisodes={totalEpisodes}
        availableSeasons={availableSeasons}
        showEpisodeList={showEpisodeList}
        onToggleEpisodeList={toggleEpisodeList}
        onSeasonChange={handleSeasonChange}
        onEpisodeClick={handleEpisodeClick}
        onPreviousEpisode={handlePreviousEpisode}
        onNextEpisode={handleNextEpisode}
      />
      
      <div className="watch-page-footer w-full mt-8">
        <Footer />
      </div>
    </div>
  );
};

export default WatchPage;
