
import { Anime, TMDBResponse } from "@/types/anime";
import { fetchFromTMDB, ANIME_TYPE_ID, ANIME_KEYWORDS } from "./core";

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
