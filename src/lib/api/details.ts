
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
export const getAnimeVideo = async (
  animeId: number,
  title: string,
  season: number = 1,
  episode: number = 1
): Promise<string> => {
  // This function now takes animeId, title, season, and episode parameters
  
  // In a real implementation, you would fetch the specific video ID from a database
  // based on the anime ID, season, and episode
  
  // Custom video mapping for specific anime/season/episode combinations
  const videoMapping: Record<string, string> = {
    // Attack on Titan
    "37854_1_1": "MGRm4IzK1SQ", // Season 1, Episode 1
    "37854_1_2": "CeLvF-KjHfU", // Season 1, Episode 2
    "37854_2_1": "hj3C12fPbqU", // Season 2, Episode 1
    
    // Demon Slayer
    "85937_1_1": "VQGCKyvzIM4", // Season 1, Episode 1
    "85937_1_2": "6vMuWuWlW4I", // Season 1, Episode 2
    
    // Jujutsu Kaisen
    "94605_1_1": "pkKu9hLT-t8", // Season 1, Episode 1
    
    // Naruto
    "31910_1_1": "QczGoCmX-pI", // Season 1, Episode 1
    
    // One Piece
    "37854_3_1": "S8_YwFLCh4U", // Season 3, Episode 1
  };
  
  // Create a key to look up in our mapping
  const lookupKey = `${animeId}_${season}_${episode}`;
  
  // If we have a specific video for this anime/season/episode combination, return it
  if (videoMapping[lookupKey]) {
    return videoMapping[lookupKey];
  }
  
  // Otherwise, fall back to general title-based mapping
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
    videoId = 'o9lAlo3abBw';
  }
  
  return videoId;
};
