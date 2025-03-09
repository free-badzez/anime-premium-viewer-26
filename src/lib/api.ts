
import { Anime, AnimeDetail, TMDBResponse } from "@/types/anime";

const TMDB_API_KEY = "de83af9bf3f4cf2d61cb8a9467045768";
const BASE_URL = "https://api.themoviedb.org/3";
const ANIME_TYPE_ID = 16; // Animation genre ID in TMDB
const LANGUAGE = "en-US"; // English language
const ANIME_KEYWORDS = "anime"; // Keyword for anime search

// Popular anime titles for search (known anime titles)
const POPULAR_ANIME_TITLES = [
  "Horimiya", 
  "Rascal Does Not Dream of Bunny Girl Senpai", 
  "Fly Me to the Moon", 
  "That Time I Got Reincarnated as a Slime", 
  "Spy x Family", 
  "Fullmetal Alchemist", 
  "Attack on Titan", 
  "Demon Slayer", 
  "My Hero Academia",
  "One Piece",
  "Naruto",
  "Your Name",
  "Spirited Away",
  "Cowboy Bebop",
  "Neon Genesis Evangelion"
];

// Helper function to create image URLs
export const getImageUrl = (path: string | null, size: string = "original") => {
  if (!path) return "/placeholder.svg";
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// Generic fetch function with error handling
const fetchFromTMDB = async <T>(endpoint: string, params: Record<string, string> = {}): Promise<T> => {
  const queryParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    language: LANGUAGE,
    ...params,
  });
  
  const url = `${BASE_URL}${endpoint}?${queryParams}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`TMDB API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch from TMDB:", error);
    throw error;
  }
};

// Get trending anime
export const getTrendingAnime = async (timeWindow: 'day' | 'week' = 'week', page: number = 1) => {
  const response = await fetchFromTMDB<TMDBResponse<Anime>>(`/trending/all/${timeWindow}`, {
    page: page.toString(),
    with_genres: ANIME_TYPE_ID.toString(),
    with_keywords: ANIME_KEYWORDS,
  });
  
  // Filter results to include only TV shows and movies with Japanese original language
  const filteredResults = response.results.filter(item => 
    (item.media_type === 'tv' || item.media_type === 'movie') && 
    (item.original_language === 'ja')
  );
  
  return {
    ...response,
    results: filteredResults
  };
};

// Get popular anime
export const getPopularAnime = async (page: number = 1) => {
  // First get popular anime series
  const tvResponse = await fetchFromTMDB<TMDBResponse<Anime>>('/discover/tv', {
    page: page.toString(),
    sort_by: 'popularity.desc',
    with_genres: ANIME_TYPE_ID.toString(),
    with_original_language: 'ja', // Only with Japanese original language
  });
  
  // Then get popular anime movies
  const movieResponse = await fetchFromTMDB<TMDBResponse<Anime>>('/discover/movie', {
    page: page.toString(),
    sort_by: 'popularity.desc',
    with_genres: ANIME_TYPE_ID.toString(),
    with_original_language: 'ja', // Only with Japanese original language
  });
  
  // Combine and sort results by popularity
  const combinedResults = [...tvResponse.results, ...movieResponse.results]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 24); // Increase to 24 results
  
  return {
    ...tvResponse,
    results: combinedResults
  };
};

// Get top rated anime
export const getTopRatedAnime = async (page: number = 1) => {
  // First get top anime series
  const tvResponse = await fetchFromTMDB<TMDBResponse<Anime>>('/discover/tv', {
    page: page.toString(),
    sort_by: 'vote_average.desc',
    with_genres: ANIME_TYPE_ID.toString(),
    'vote_count.gte': '100',
    with_original_language: 'ja',
  });
  
  // Then get top anime movies
  const movieResponse = await fetchFromTMDB<TMDBResponse<Anime>>('/discover/movie', {
    page: page.toString(),
    sort_by: 'vote_average.desc',
    with_genres: ANIME_TYPE_ID.toString(),
    'vote_count.gte': '100',
    with_original_language: 'ja',
  });
  
  // Combine and sort results by rating
  const combinedResults = [...tvResponse.results, ...movieResponse.results]
    .sort((a, b) => b.vote_average - a.vote_average)
    .slice(0, 24); // Increase to 24 results
  
  return {
    ...tvResponse,
    results: combinedResults
  };
};

// Get recent anime with popular titles
export const getRecentAnime = async (page: number = 1) => {
  const currentDate = new Date();
  const threeYearsAgo = new Date();
  threeYearsAgo.setFullYear(currentDate.getFullYear() - 3);
  
  const formattedCurrentDate = currentDate.toISOString().split('T')[0];
  const formattedThreeYearsAgo = threeYearsAgo.toISOString().split('T')[0];
  
  // Create requests to search for specific anime by titles
  const searchPromises = POPULAR_ANIME_TITLES.map(title => 
    fetchFromTMDB<TMDBResponse<Anime>>('/search/multi', {
      query: title,
      page: '1',
      include_adult: 'false',
    })
  );
  
  // Execute all requests in parallel
  const searchResults = await Promise.all(searchPromises);
  
  // Get recent anime series (main stream)
  const tvResponse = await fetchFromTMDB<TMDBResponse<Anime>>('/discover/tv', {
    page: page.toString(),
    'air_date.gte': formattedThreeYearsAgo,
    'air_date.lte': formattedCurrentDate,
    sort_by: 'first_air_date.desc',
    with_genres: ANIME_TYPE_ID.toString(),
    with_original_language: 'ja',
  });
  
  // Collect all results from title searches
  let popularTitles: Anime[] = [];
  searchResults.forEach(response => {
    // Filter only anime with Japanese original language
    const filtered = response.results.filter(item => 
      (item.media_type === 'tv' || item.media_type === 'movie') && 
      item.original_language === 'ja'
    );
    popularTitles = [...popularTitles, ...filtered];
  });
  
  // Remove duplicates by ID
  const uniquePopularTitles = popularTitles.filter((item, index, self) =>
    index === self.findIndex((t) => t.id === item.id)
  );
  
  // Combine found popular titles with regular results
  const combinedResults = [...uniquePopularTitles, ...tvResponse.results]
    .slice(0, 24); // Limit to 24 results
  
  return {
    ...tvResponse,
    results: combinedResults
  };
};

// Get anime details
export const getAnimeDetails = async (id: number, mediaType?: string) => {
  // If media type is not specified, try first as TV show, then as movie
  if (!mediaType) {
    try {
      const response = await fetchFromTMDB<AnimeDetail>(`/tv/${id}`);
      return response;
    } catch (error) {
      // If not found as TV show, try as movie
      return await fetchFromTMDB<AnimeDetail>(`/movie/${id}`);
    }
  }
  
  // If media type is specified, use it
  return await fetchFromTMDB<AnimeDetail>(`/${mediaType}/${id}`);
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
