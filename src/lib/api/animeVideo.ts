
// Video source type interface
export interface VideoSource {
  id: string;
  isDrive: boolean;
}

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
