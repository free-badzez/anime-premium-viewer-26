
import { Anime, AnimeDetail, TMDBResponse } from "@/types/anime";

const TMDB_API_KEY = "de83af9bf3f4cf2d61cb8a9467045768";
const BASE_URL = "https://api.themoviedb.org/3";
const ANIME_TYPE_ID = 16; // Animation genre ID in TMDB

// Helper function to create image URLs
export const getImageUrl = (path: string | null, size: string = "original") => {
  if (!path) return "/placeholder.svg";
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// Generic fetch function with error handling
const fetchFromTMDB = async <T>(endpoint: string, params: Record<string, string> = {}): Promise<T> => {
  const queryParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
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
  const response = await fetchFromTMDB<TMDBResponse<Anime>>(`/trending/tv/${timeWindow}`, {
    page: page.toString(),
    with_genres: ANIME_TYPE_ID.toString(),
  });
  
  return response;
};

// Get popular anime
export const getPopularAnime = async (page: number = 1) => {
  const response = await fetchFromTMDB<TMDBResponse<Anime>>('/discover/tv', {
    page: page.toString(),
    sort_by: 'popularity.desc',
    with_genres: ANIME_TYPE_ID.toString(),
  });
  
  return response;
};

// Get top rated anime
export const getTopRatedAnime = async (page: number = 1) => {
  const response = await fetchFromTMDB<TMDBResponse<Anime>>('/discover/tv', {
    page: page.toString(),
    sort_by: 'vote_average.desc',
    with_genres: ANIME_TYPE_ID.toString(),
    'vote_count.gte': '100',
  });
  
  return response;
};

// Get anime details
export const getAnimeDetails = async (id: number) => {
  const response = await fetchFromTMDB<AnimeDetail>(`/tv/${id}`);
  return response;
};

// Search for anime
export const searchAnime = async (query: string, page: number = 1) => {
  const response = await fetchFromTMDB<TMDBResponse<Anime>>('/search/tv', {
    query,
    page: page.toString(),
    with_genres: ANIME_TYPE_ID.toString(),
  });
  
  return response;
};
