
import { Anime, TMDBResponse } from "@/types/anime";
import { fetchFromTMDB, ANIME_TYPE_ID } from "./core";

// Get animes by genre and optional starting letter
export const getAnimesByGenre = async (
  genreId: string,
  startingLetter: string = ''
): Promise<TMDBResponse<Anime>> => {
  // First, discover TV shows with the selected genre
  const tvResponse = await fetchFromTMDB<TMDBResponse<Anime>>('/discover/tv', {
    with_genres: genreId,
    sort_by: 'popularity.desc',
    with_original_language: 'ja', // Filter to Japanese content
  });
  
  // Then discover movies with the selected genre
  const movieResponse = await fetchFromTMDB<TMDBResponse<Anime>>('/discover/movie', {
    with_genres: genreId,
    sort_by: 'popularity.desc',
    with_original_language: 'ja', // Filter to Japanese content
  });
  
  // Combine the results
  const combinedResults = [
    ...tvResponse.results.map(item => ({ ...item, media_type: 'tv' })),
    ...movieResponse.results.map(item => ({ ...item, media_type: 'movie' }))
  ];
  
  // Filter by anime type ID
  const animeResults = combinedResults.filter(item => 
    item.genre_ids?.includes(ANIME_TYPE_ID)
  );
  
  // Filter by starting letter if provided
  const filteredResults = startingLetter 
    ? animeResults.filter(item => {
        const title = item.title || item.name || '';
        return title.toUpperCase().startsWith(startingLetter);
      })
    : animeResults;
  
  // Sort by popularity
  filteredResults.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  
  return {
    page: 1,
    results: filteredResults,
    total_pages: 1,
    total_results: filteredResults.length
  };
};
