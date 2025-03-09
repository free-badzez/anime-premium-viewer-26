
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

// Get Dailymotion video ID for an anime
export const getAnimeVideo = async (title: string): Promise<string> => {
  // This is a mock function that would typically call a real API
  // For now, we'll just return a hardcoded Dailymotion video ID based on the title
  // In a real implementation, you would search the Dailymotion API
  
  // Default video ID (Anime trailer)
  let videoId = 'x8bykr9';
  
  // Check for common titles and assign specific videos
  // This is just a demo implementation
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('attack on titan') || lowerTitle.includes('shingeki')) {
    videoId = 'x87cz33';
  } else if (lowerTitle.includes('demon slayer') || lowerTitle.includes('kimetsu')) {
    videoId = 'x8czs1s';
  } else if (lowerTitle.includes('jujutsu kaisen')) {
    videoId = 'x8czjzl';
  } else if (lowerTitle.includes('naruto')) {
    videoId = 'x8fwstp';
  } else if (lowerTitle.includes('one piece')) {
    videoId = 'x8g01jj';
  }
  
  return videoId;
};
