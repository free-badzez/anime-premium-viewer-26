
// Video source type interface
export interface VideoSource {
  id: string;
  isDrive: boolean;
}

// Comprehensive video mapping for different animes, seasons, and episodes
const animeVideoMapping: Record<string, Record<number, Record<number, VideoSource>>> = {
  // Weathering with You (ID: 568160)
  "568160": {
    1: { // Season 1
      1: { id: "1n31X7MsTkLTaUFw7i_VamwI6j5qVnxet", isDrive: true }, // Weathering with You
    }
  },
  
  // Add other specific anime videos here as needed
  // For example:
  "85937": { // Demon Slayer 
    1: { 
      1: { id: "your-demon-slayer-video-id", isDrive: true }
    }
  }
};

// Get YouTube or Google Drive video ID for an anime
export const getAnimeVideo = async (
  animeId: number,
  title: string,
  season: number = 1,
  episode: number = 1
): Promise<VideoSource | null> => {
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
  
  // If no video is found, return null
  return null;
};
