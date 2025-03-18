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

// Comprehensive video mapping for different animes, seasons, and episodes
const animeVideoMapping: Record<string, Record<number, Record<number, VideoSource>>> = {
  // Attack on Titan (ID: 1429)
  "1429": {
    1: { // Season 1
      1: { id: "DRIVE_ID_FOR_AOT_S1E1", isDrive: true }, // Episode 1 (Drive)
      2: { id: "DRIVE_ID_FOR_AOT_S1E2", isDrive: true }, // Episode 2 (Drive)
      3: { id: "DRIVE_ID_FOR_AOT_S1E3", isDrive: true }, // Episode 3 (Drive)
      4: { id: "DRIVE_ID_FOR_AOT_S1E4", isDrive: true }, // Episode 4 (Drive)
      5: { id: "DRIVE_ID_FOR_AOT_S1E5", isDrive: true }, // Episode 5 (Drive)
      6: { id: "DRIVE_ID_FOR_AOT_S1E6", isDrive: true }, // Episode 6 (Drive)
      7: { id: "DRIVE_ID_FOR_AOT_S1E7", isDrive: true }, // Episode 7 (Drive)
      8: { id: "DRIVE_ID_FOR_AOT_S1E8", isDrive: true }, // Episode 8 (Drive)
      9: { id: "DRIVE_ID_FOR_AOT_S1E9", isDrive: true }, // Episode 9 (Drive)
      10: { id: "DRIVE_ID_FOR_AOT_S1E10", isDrive: true } // Episode 10 (Drive)
    },
    2: { // Season 2
      1: { id: "DRIVE_ID_FOR_AOT_S2E1", isDrive: true }, // Episode 1 (Drive)
      2: { id: "DRIVE_ID_FOR_AOT_S2E2", isDrive: true }, // Episode 2 (Drive)
      3: { id: "DRIVE_ID_FOR_AOT_S2E3", isDrive: true }, // Episode 3 (Drive)
      4: { id: "DRIVE_ID_FOR_AOT_S2E4", isDrive: true }, // Episode 4 (Drive)
      5: { id: "DRIVE_ID_FOR_AOT_S2E5", isDrive: true }  // Episode 5 (Drive)
    }
  },
  
  // Demon Slayer (ID: 85937)
  "85937": {
    1: { // Season 1
      1: { id: "DRIVE_ID_FOR_DS_S1E1", isDrive: true }, // Episode 1 (Drive)
      2: { id: "DRIVE_ID_FOR_DS_S1E2", isDrive: true }, // Episode 2 (Drive)
      3: { id: "DRIVE_ID_FOR_DS_S1E3", isDrive: true }, // Episode 3 (Drive)
      4: { id: "DRIVE_ID_FOR_DS_S1E4", isDrive: true }, // Episode 4 (Drive)
      5: { id: "DRIVE_ID_FOR_DS_S1E5", isDrive: true }  // Episode 5 (Drive)
    }
  },
  
  // Jujutsu Kaisen (ID: 94605)
  "94605": {
    1: { // Season 1
      1: { id: "DRIVE_ID_FOR_JJK_S1E1", isDrive: true }, // Episode 1 (Drive)
      2: { id: "DRIVE_ID_FOR_JJK_S1E2", isDrive: true }, // Episode 2 (Drive)
      3: { id: "DRIVE_ID_FOR_JJK_S1E3", isDrive: true }, // Episode 3 (Drive)
    }
  },
  
  // Add more anime with Drive links here
  // For example:
  "1297763": { // Custom anime ID
    1: { // Season 1
      1: { id: "DRIVE_ID_FOR_CUSTOM_S1E1", isDrive: true }, // Episode 1 (Drive)
      2: { id: "DRIVE_ID_FOR_CUSTOM_S1E2", isDrive: true }, // Episode 2 (Drive)
      3: { id: "DRIVE_ID_FOR_CUSTOM_S1E3", isDrive: true }  // Episode 3 (Drive)
    }
  }
};

// Fallback videos by anime title (used when specific episode is not found)
const fallbackVideosByTitle: Record<string, VideoSource> = {
  "Attack on Titan": { id: "DRIVE_ID_FOR_AOT_FALLBACK", isDrive: true },
  "Shingeki no Kyojin": { id: "DRIVE_ID_FOR_AOT_FALLBACK", isDrive: true },
  "Demon Slayer": { id: "DRIVE_ID_FOR_DS_FALLBACK", isDrive: true },
  "Kimetsu no Yaiba": { id: "DRIVE_ID_FOR_DS_FALLBACK", isDrive: true },
  "Your Custom Anime": { id: "DRIVE_ID_FOR_CUSTOM_FALLBACK", isDrive: true }
};

// Default videos when no match is found
const defaultVideos: VideoSource[] = [
  { id: "DRIVE_ID_FOR_DEFAULT_1", isDrive: true },
  { id: "DRIVE_ID_FOR_DEFAULT_2", isDrive: true },
  { id: "DRIVE_ID_FOR_DEFAULT_3", isDrive: true },
  { id: "DRIVE_ID_FOR_DEFAULT_4", isDrive: true },
  { id: "DRIVE_ID_FOR_DEFAULT_5", isDrive: true }
];

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
