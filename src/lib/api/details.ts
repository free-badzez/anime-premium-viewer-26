
import { Anime, AnimeDetail, TMDBResponse } from "@/types/anime";
import { fetchFromTMDB, ANIME_TYPE_ID } from "./core";

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
