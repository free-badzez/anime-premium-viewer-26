
import { Anime, AnimeDetail, TMDBResponse } from "@/types/anime";
import { fetchFromTMDB, ANIME_TYPE_ID } from "./core";

// Get anime details
export const getAnimeDetails = async (id: number, mediaType?: string) => {
  // If media type is not specified, try first as TV show, then as movie
  let details;
  if (!mediaType) {
    try {
      details = await fetchFromTMDB<AnimeDetail>(`/tv/${id}`);
      mediaType = 'tv';
    } catch (error) {
      // If not found as TV show, try as movie
      details = await fetchFromTMDB<AnimeDetail>(`/movie/${id}`);
      mediaType = 'movie';
    }
  } else {
    details = await fetchFromTMDB<AnimeDetail>(`/${mediaType}/${id}`);
  }
  
  // Fetch cast information
  const credits = await fetchFromTMDB(`/${mediaType}/${id}/credits`);
  
  // Make sure the anime is Japanese (has 'ja' as original language)
  if (details.original_language !== 'ja') {
    throw new Error("This content is not an anime");
  }
  
  // Return combined data
  return {
    ...details,
    credits
  };
};

// Search for anime
export const searchAnime = async (query: string, page: number = 1) => {
  // Search for all content types
  const response = await fetchFromTMDB<TMDBResponse<Anime>>('/search/multi', {
    query,
    page: page.toString(),
    include_adult: 'false',
  });
  
  // Filter results to include only anime
  const filteredResults = response.results.filter(item => 
    (item.media_type === 'tv' || item.media_type === 'movie') && 
    item.genre_ids?.includes(ANIME_TYPE_ID) &&
    item.original_language === 'ja'
  );
  
  return {
    ...response,
    results: filteredResults
  };
};

// Get YouTube video ID for an anime
export const getAnimeVideo = async (title: string, specificVideoId?: string): Promise<string> => {
  // If a specific video ID is provided, use it directly
  if (specificVideoId) {
    return specificVideoId;
  }
  
  // This is a mock function that would typically call a real API
  // For now, we'll just return a hardcoded YouTube video ID based on the title
  
  // Default video ID (Anime trailer)
  let videoId = 'o9lAlo3abBw'; // Default anime trailer
  
  // Check for common titles and assign specific videos
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('attack on titan') || lowerTitle.includes('shingeki')) {
    videoId = 'MGRm4IzK1SQ'; // Attack on Titan trailer
  } else if (lowerTitle.includes('demon slayer') || lowerTitle.includes('kimetsu')) {
    videoId = 'VQGCKyvzIM4'; // Demon Slayer trailer
  } else if (lowerTitle.includes('jujutsu kaisen')) {
    videoId = 'pkKu9hLT-t8'; // Jujutsu Kaisen trailer
  } else if (lowerTitle.includes('naruto')) {
    videoId = 'QczGoCmX-pI'; // Naruto trailer
  } else if (lowerTitle.includes('one piece')) {
    videoId = 'S8_YwFLCh4U'; // One Piece trailer
  } else {
    // Default anime collection video
    videoId = 'dQw4w9WgXcQ';
  }
  
  return videoId;
};
