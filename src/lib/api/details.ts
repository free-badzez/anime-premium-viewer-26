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
      1: { id: "MGRm4IzK1SQ", isDrive: false }, // Episode 1 (YouTube)
      2: { id: "CeLvF-KjHfU", isDrive: false }, // Episode 2 (YouTube)
      3: { id: "QeeRmpIZmfc", isDrive: false }, // Episode 3 (YouTube)
      4: { id: "wyRVZ5jYsqg", isDrive: false }, // Episode 4 (YouTube)
      5: { id: "rNMT5CxCdgE", isDrive: false }, // Episode 5 (YouTube)
      // Add your Google Drive links like this:
      6: { id: "YOUR_GOOGLE_DRIVE_ID_HERE", isDrive: true }, // Episode 6 (Google Drive)
      7: { id: "JSYZipKPCcU", isDrive: false }, // Episode 7 (YouTube)
      8: { id: "ZvXo5_L5FsA", isDrive: false }, // Episode 8 (YouTube)
      9: { id: "TtVXFBLYuJ8", isDrive: false }, // Episode 9 (YouTube)
      10: { id: "2ZUcrlzYsNE", isDrive: false }  // Episode 10 (YouTube)
    },
    2: { // Season 2
      1: { id: "hj3C12fPbqU", isDrive: false }, // Episode 1 (YouTube)
      2: { id: "X-Y3xX8MQtI", isDrive: false }, // Episode 2 (YouTube)
      3: { id: "1eknfZGuvFo", isDrive: false }, // Episode 3 (YouTube)
      4: { id: "0cKNHzWeq5Y", isDrive: false }, // Episode 4 (YouTube)
      5: { id: "o5AIbc9j_w0", isDrive: false }  // Episode 5 (YouTube)
    }
  },
  
  // Demon Slayer (ID: 85937)
  "85937": {
    1: { // Season 1
      1: { id: "VQGCKyvzIM4", isDrive: false }, // Episode 1 (YouTube)
      2: { id: "6vMuWuWlW4I", isDrive: false }, // Episode 2 (YouTube)
      3: { id: "LKFuXETZusI", isDrive: false }, // Episode 3 (YouTube)
      4: { id: "jQZd3GoKpjM", isDrive: false }, // Episode 4 (YouTube)
      5: { id: "E5GkKx0hQzE", isDrive: false }  // Episode 5 (YouTube)
    }
  },
  
  // Jujutsu Kaisen (ID: 94605)
  "94605": {
    1: { // Season 1
      1: { id: "pkKu9hLT-t8", isDrive: false }, // Episode 1 (YouTube)
      2: { id: "KNfhJGBFFPY", isDrive: false }, // Episode 2 (YouTube)
      3: { id: "3fh4wFJJIzE", isDrive: false }, // Episode 3 (YouTube)
      // Add more episodes with YouTube or Drive links
    }
  },
  
  // You can add more anime with both YouTube and Google Drive links here
  // Add your custom anime with Google Drive links like this:
  "1297763": { // Custom anime ID
    1: { // Season 1
      1: { id: "REPLACE_WITH_DRIVE_ID", isDrive: true }, // Episode 1 (Google Drive)
      2: { id: "REPLACE_WITH_DRIVE_ID", isDrive: true }, // Episode 2 (Google Drive)
      3: { id: "REPLACE_WITH_DRIVE_ID", isDrive: true }  // Episode 3 (Google Drive)
    }
  }
};

// Fallback videos by anime title (used when specific episode is not found)
const fallbackVideosByTitle: Record<string, VideoSource> = {
  "Attack on Titan": { id: "MGRm4IzK1SQ", isDrive: false },
  "Shingeki no Kyojin": { id: "MGRm4IzK1SQ", isDrive: false },
  "Demon Slayer": { id: "VQGCKyvzIM4", isDrive: false },
  "Kimetsu no Yaiba": { id: "VQGCKyvzIM4", isDrive: false },
  // Add more fallbacks with YouTube or Drive links
  "Your Custom Anime": { id: "YOUR_DRIVE_ID_HERE", isDrive: true } // Example with Google Drive
};

// Default videos when no match is found
const defaultVideos: VideoSource[] = [
  { id: "o9lAlo3abBw", isDrive: false }, // General anime compilation
  { id: "p51w1XgZUCw", isDrive: false }, // Top anime moments
  { id: "YOfevzRrNh4", isDrive: false }, // Another anime compilation
  { id: "SlNpRThS9t8", isDrive: false }, // Popular anime opening
  { id: "VQGCKyvzIM4", isDrive: false }  // Another popular anime opening
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
