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

// Video source type interface
interface VideoSource {
  id: string;
  isDrive: boolean;
}

// Mapping of anime IDs to their correct season and episode counts
// This helps override incorrect data from the API
const animeCorrections: Record<string, { seasons: number, episodesPerSeason: Record<number, number> }> = {
  // Solo Leveling (ID: 127532) - Has 1 season with 13 episodes
  "127532": {
    seasons: 1,
    episodesPerSeason: { 1: 13 }
  },
  // Rascal Does Not Dream of a Dreaming Girl (ID depends on exact mapping)
  "93290": {
    seasons: 1,
    episodesPerSeason: { 1: 13 }
  },
  // Add more anime corrections as needed
};

// Comprehensive video mapping for different animes, seasons, and episodes
const animeVideoMapping: Record<string, Record<number, Record<number, VideoSource>>> = {
  // Attack on Titan (ID: 1429)
  "1429": {
    1: { // Season 1
      1: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }, // Episode 1 (Drive)
      2: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }, // Episode 2 (Drive)
      3: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }, // Episode 3 (Drive)
      4: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }, // Episode 4 (Drive)
      5: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }, // Episode 5 (Drive)
      6: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }, // Episode 6 (Drive)
      7: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }, // Episode 7 (Drive)
      8: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }, // Episode 8 (Drive)
      9: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }, // Episode 9 (Drive)
      10: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true } // Episode 10 (Drive)
    },
    2: { // Season 2
      1: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }, // Episode 1 (Drive)
      2: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }, // Episode 2 (Drive)
      3: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }, // Episode 3 (Drive)
      4: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }, // Episode 4 (Drive)
      5: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }  // Episode 5 (Drive)
    }
  },
  
  // Solo Leveling (ID: 127532) - Properly mapped to 1 season with 13 episodes
  "127532": {
    1: { // Season 1
      1: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }, // Episode 1 (Drive)
      2: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }, // Episode 2 (Drive)
      3: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }, // Episode 3 (Drive)
      4: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }, // Episode 4 (Drive)
      5: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }, // Episode 5 (Drive)
      6: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }, // Episode 6 (Drive) 
      7: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }, // Episode 7 (Drive)
      8: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }, // Episode 8 (Drive)
      9: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }, // Episode 9 (Drive)
      10: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }, // Episode 10 (Drive)
      11: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }, // Episode 11 (Drive)
      12: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }, // Episode 12 (Drive)
      13: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }  // Episode 13 (Drive)
    }
  },
  
  // Demon Slayer (ID: 85937)
  "85937": {
    1: { // Season 1
      1: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }, // Episode 1 (Drive)
      2: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }, // Episode 2 (Drive)
      3: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }, // Episode 3 (Drive)
      4: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }, // Episode 4 (Drive)
      5: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }  // Episode 5 (Drive)
    }
  },
  
  // Jujutsu Kaisen (ID: 94605)
  "94605": {
    1: { // Season 1
      1: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }, // Episode 1 (Drive)
      2: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }, // Episode 2 (Drive)
      3: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }, // Episode 3 (Drive)
    }
  },
  
  // Currently viewing anime (ID: 113980)
  "113980": {
    1: { // Season 1
      1: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }, // Episode 1 (Drive)
      2: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }, // Episode 2 (Drive)
      3: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }, // Episode 3 (Drive)
      4: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }, // Episode 4 (Drive)
      5: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }, // Episode 5 (Drive)
      6: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }, // Episode 6 (Drive)
      7: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }, // Episode 7 (Drive)
      8: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }, // Episode 8 (Drive)
      9: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }, // Episode 9 (Drive)
      10: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }, // Episode 10 (Drive)
      11: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }, // Episode 11 (Drive)
      12: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }  // Episode 12 (Drive)
    }
  },
  
  // Add more anime with Drive links here
  // For example:
  "1297763": { // Custom anime ID
    1: { // Season 1
      1: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }, // Episode 1 (Drive)
      2: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }, // Episode 2 (Drive)
      3: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }  // Episode 3 (Drive)
    }
  }
};

// Fallback videos by anime title (used when specific episode is not found)
const fallbackVideosByTitle: Record<string, VideoSource> = {
  "Attack on Titan": { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true },
  "Shingeki no Kyojin": { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true },
  "Demon Slayer": { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true },
  "Kimetsu no Yaiba": { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true },
  "Your Custom Anime": { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }
};

// Default videos when no match is found
const defaultVideos: VideoSource[] = [
  { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true },
  { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true },
  { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true },
  { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true },
  { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }
];

// Enhanced function to get details for an anime with correct season/episode info
export const getAnimeDetailsCorrected = async (id: number, mediaType?: string) => {
  const details = await getAnimeDetails(id, mediaType);
  const animeIdString = id.toString();
  
  // Apply corrections if we have them for this anime
  if (animeCorrections[animeIdString]) {
    const correction = animeCorrections[animeIdString];
    
    // Override seasons data if needed
    if (correction.seasons && correction.seasons > 0) {
      // Create corrected seasons array
      details.seasons = Array.from({ length: correction.seasons }, (_, i) => {
        const seasonNumber = i + 1;
        return {
          id: seasonNumber,
          name: `Season ${seasonNumber}`,
          overview: "",
          air_date: details.first_air_date || "",
          episode_count: correction.episodesPerSeason[seasonNumber] || 1,
          poster_path: details.poster_path,
          season_number: seasonNumber
        };
      });
      
      // Update number_of_seasons
      details.number_of_seasons = correction.seasons;
      
      // If this is a single season anime, also update number_of_episodes
      if (correction.seasons === 1 && correction.episodesPerSeason[1]) {
        details.number_of_episodes = correction.episodesPerSeason[1];
      }
    }
  }
  
  return details;
};

// Get YouTube or Google Drive video ID for an anime
export const getAnimeVideo = async (
  animeId: number,
  title: string,
  season: number = 1,
  episode: number = 1
): Promise<VideoSource> => {
  const animeIdString = animeId.toString();
  
  // Step 1: Try to get a specific video for this anime ID, season, and episode
  if (animeVideoMapping[animeIdString]?.[season]?.[episode]) {
    return animeVideoMapping[animeIdString][season][episode];
  }
  
  // Step 2: Try to get any video for this anime ID and season
  if (animeVideoMapping[animeIdString]?.[season]) {
    const episodeKeys = Object.keys(animeVideoMapping[animeIdString][season]);
    if (episodeKeys.length > 0) {
      // Return the first episode available for this season
      return animeVideoMapping[animeIdString][season][parseInt(episodeKeys[0])];
    }
  }
  
  // Step 3: Try to get any video for this anime ID
  if (animeVideoMapping[animeIdString]) {
    const seasonKeys = Object.keys(animeVideoMapping[animeIdString]);
    if (seasonKeys.length > 0) {
      const firstSeason = parseInt(seasonKeys[0]);
      const episodeKeys = Object.keys(animeVideoMapping[animeIdString][firstSeason]);
      if (episodeKeys.length > 0) {
        // Return the first episode of the first season available
        return animeVideoMapping[animeIdString][firstSeason][parseInt(episodeKeys[0])];
      }
    }
  }
  
  // Step 4: Try to get a video based on title match
  for (const knownTitle in fallbackVideosByTitle) {
    if (title.toLowerCase().includes(knownTitle.toLowerCase())) {
      return fallbackVideosByTitle[knownTitle];
    }
  }
  
  // Step 5: Return a random default video if nothing else works
  return defaultVideos[Math.floor(Math.random() * defaultVideos.length)];
};
