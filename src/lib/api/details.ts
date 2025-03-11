
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

// Comprehensive video mapping for different animes, seasons, and episodes
const animeVideoMapping: Record<string, Record<number, Record<number, string>>> = {
  // Attack on Titan (ID: 1429)
  "1429": {
    1: { // Season 1
      1: "MGRm4IzK1SQ", // Episode 1
      2: "CeLvF-KjHfU", // Episode 2
      3: "QeeRmpIZmfc", // Episode 3
      4: "wyRVZ5jYsqg", // Episode 4
      5: "rNMT5CxCdgE"  // Episode 5
    },
    2: { // Season 2
      1: "hj3C12fPbqU", // Episode 1
      2: "X-Y3xX8MQtI", // Episode 2
      3: "1eknfZGuvFo"  // Episode 3
    },
    3: { // Season 3
      1: "S8_YwFLCh4U", // Episode 1
      2: "KSBVN92oMnM"  // Episode 2
    },
    4: { // Season 4
      1: "SlNpRThS9t8", // Episode 1
      2: "ZefrVAetxlI"  // Episode 2
    }
  },
  
  // Demon Slayer (ID: 85937)
  "85937": {
    1: { // Season 1
      1: "VQGCKyvzIM4", // Episode 1
      2: "6vMuWuWlW4I", // Episode 2
      3: "LKFuXETZusI", // Episode 3
      4: "jQZd3GoKPjM", // Episode 4
      5: "E5GkKx0hQzE"  // Episode 5
    },
    2: { // Season 2
      1: "D-LdsgkAcRs", // Episode 1
      2: "QwvWdmN9aMk", // Episode 2
    }
  },
  
  // Jujutsu Kaisen (ID: 94605)
  "94605": {
    1: { // Season 1
      1: "pkKu9hLT-t8", // Episode 1
      2: "KNfhJGBFFPY", // Episode 2
      3: "3fh4wFJJIzE", // Episode 3
      4: "YhdGqHX3BgU", // Episode 4
    },
    2: { // Season 2
      1: "yR9K4FmUlYE", // Episode 1
      2: "iFLt4Rva7-k", // Episode 2
    }
  },
  
  // Naruto (ID: 31910)
  "31910": {
    1: { // Season 1
      1: "QczGoCmX-pI", // Episode 1
      2: "elAPV_SgKAE", // Episode 2
      3: "s5VYm-iysYM", // Episode 3
    }
  },
  
  // One Piece (ID: 37854)
  "37854": {
    1: { // Season 1
      1: "XwjhQyI_Pz4", // Episode 1
      2: "c8vSG_-B-8Y", // Episode 2
      3: "bkyV9JpSuDU", // Episode 3
    },
    2: { // Season 2
      1: "WSUkpEJ7Q1U", // Episode 1
      2: "6LZRlU2V4Ao", // Episode 2
    }
  },
  
  // My Hero Academia (ID: 60625)
  "60625": {
    1: { // Season 1
      1: "D5fYOnwYkj4", // Episode 1
      2: "9ZIgCK7mDq4", // Episode 2 
    },
    2: { // Season 2
      1: "uxdS8TP5FPo", // Episode 1
      2: "7NFwhd9qvwU", // Episode 2
    }
  },
  
  // Hunter x Hunter (ID: 46298)
  "46298": {
    1: { // Season 1
      1: "XrdbZT5lPzA", // Episode 1
      2: "Jx3JLrQAQvM", // Episode 2
    }
  },
  
  // Tokyo Ghoul (ID: 61374)
  "61374": {
    1: { // Season 1
      1: "ETHpeMUB5UE", // Episode 1
      2: "KwZ_QbXoDxM", // Episode 2
    }
  },
  
  // Death Note (ID: 13916)
  "13916": {
    1: { // Season 1
      1: "NlJZ-YgAt-c", // Episode 1
      2: "Vd8tg2njMfI", // Episode 2
    }
  },
  
  // Fullmetal Alchemist: Brotherhood (ID: 31911)
  "31911": {
    1: { // Season 1
      1: "kQw9bPTvCRE", // Episode 1
      2: "eKCLd5j6fLQ", // Episode 2
    }
  }
};

// Fallback videos by anime title (used when specific episode is not found)
const fallbackVideosByTitle: Record<string, string> = {
  "Attack on Titan": "MGRm4IzK1SQ",
  "Shingeki no Kyojin": "MGRm4IzK1SQ",
  "Demon Slayer": "VQGCKyvzIM4",
  "Kimetsu no Yaiba": "VQGCKyvzIM4",
  "Jujutsu Kaisen": "pkKu9hLT-t8",
  "Naruto": "QczGoCmX-pI",
  "One Piece": "XwjhQyI_Pz4",
  "My Hero Academia": "D5fYOnwYkj4",
  "Boku no Hero Academia": "D5fYOnwYkj4",
  "Hunter x Hunter": "XrdbZT5lPzA",
  "Tokyo Ghoul": "ETHpeMUB5UE",
  "Death Note": "NlJZ-YgAt-c",
  "Fullmetal Alchemist": "kQw9bPTvCRE",
  "Fullmetal Alchemist: Brotherhood": "kQw9bPTvCRE",
  "Spy x Family": "ofXigq9aIpo",
  "Chainsaw Man": "dFlDRhvM4L0",
  "Solo Leveling": "SlNpRThS9t8",
  "Bleach": "0oCsFVwTpIo",
  "Dragon Ball Z": "o3HyeRXZzfk",
  "One Punch Man": "Poo5lqoWSGw",
  "Violet Evergarden": "BuDGRqTWx7Q",
  "Sword Art Online": "6ohYYtxfDCg",
  "Black Clover": "MH4pWlX4LqI",
  "Mob Psycho 100": "Pr3sBks5o_8",
  "The Promised Neverland": "ApLudqucq-s",
  "Vinland Saga": "w_SQEQNEYDo",
  "Horimiya": "MRj8YQR8vGw", 
  "Rascal Does Not Dream of Bunny Girl Senpai": "UhE0LOHKnOY",
  "That Time I Got Reincarnated as a Slime": "fhZsVEu7qZ0",
  "Your Name": "xU47nhruN-Q",
  "Spirited Away": "ByXuk9QqQkk",
  "Cowboy Bebop": "EL-D9LrFJd4",
  "Neon Genesis Evangelion": "13nSISwxrY4",
  "Fly Me to the Moon": "AubOYBCUjSY"
};

// Default videos when no match is found
const defaultVideos = [
  "o9lAlo3abBw", // General anime compilation
  "p51w1XgZUCw", // Top anime moments
  "YOfevzRrNh4", // Another anime compilation
  "SlNpRThS9t8", // Popular anime opening
  "VQGCKyvzIM4"  // Another popular anime opening
];

// Get YouTube video ID for an anime
export const getAnimeVideo = async (
  animeId: number,
  title: string,
  season: number = 1,
  episode: number = 1
): Promise<string> => {
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
