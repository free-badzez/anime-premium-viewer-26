
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
  "127532": { // Solo Levelling 
    1: { 
      1: { id: "19axSY041thDY-n8qlMcAJW2QyPibDPom", isDrive: true }
    },
    2: { 
      2: { id: "1XbadhoCCYxauTiRgSZBNhsaE-RNEWyVz", isDrive: true }
    },
    3: { 
      3: { id: "1ZeKhtnBxny1H-acXBD7IyEr12Y00ne2N", isDrive: true }
    },
    4: { 
      4: { id: "1Q-De8Z-JMioTz9ohFKXNC1pwEvJryKzz", isDrive: true }
    },
    5: { 
      5: { id: "18t7Ml6DEgvurYfKr00miZVVfOF71eEnS", isDrive: true }
    },
    6: { 
      6: { id: "12KumMskfLZubsKiuRFneXaC6UQuggWyD", isDrive: true }
    },
    7: { 
      7: { id: "13X7WqV-kfalKrEYtu53PBXyIqY7ZxLF", isDrive: true }
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
