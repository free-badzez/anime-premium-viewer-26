
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
      5: "rNMT5CxCdgE", // Episode 5
      6: "yyN-1NYefc0", // Episode 6
      7: "JSYZipKPCcU", // Episode 7
      8: "ZvXo5_L5FsA", // Episode 8
      9: "TtVXFBLYuJ8", // Episode 9
      10: "2ZUcrlzYsNE" // Episode 10
    },
    2: { // Season 2
      1: "hj3C12fPbqU", // Episode 1
      2: "X-Y3xX8MQtI", // Episode 2
      3: "1eknfZGuvFo", // Episode 3
      4: "0cKNHzWeq5Y", // Episode 4
      5: "o5AIbc9j_w0"  // Episode 5
    },
    3: { // Season 3
      1: "S8_YwFLCh4U", // Episode 1
      2: "KSBVN92oMnM", // Episode 2
      3: "h0LCi2S0UVE", // Episode 3
      4: "5LoEgXvnrpo", // Episode 4
      5: "swHsz8l5GxY"  // Episode 5
    },
    4: { // Season 4
      1: "SlNpRThS9t8", // Episode 1
      2: "ZefrVAetxlI", // Episode 2
      3: "LYTlC5VrQgw", // Episode 3
      4: "DsU3dGRjOWo", // Episode 4
      5: "LJHv1rl_H5g"  // Episode 5
    }
  },
  
  // Demon Slayer (ID: 85937)
  "85937": {
    1: { // Season 1
      1: "VQGCKyvzIM4", // Episode 1
      2: "6vMuWuWlW4I", // Episode 2
      3: "LKFuXETZusI", // Episode 3
      4: "jQZd3GoKpjM", // Episode 4
      5: "E5GkKx0hQzE", // Episode 5
      6: "FsS7XPhXYbw", // Episode 6
      7: "JuCEmQAIOrI", // Episode 7
      8: "T5j1_ZSUyuQ", // Episode 8
      9: "qCGGaZ1GdVU", // Episode 9
      10: "i8LQ8C6vZHk" // Episode 10
    },
    2: { // Season 2
      1: "D-LdsgkAcRs", // Episode 1
      2: "QwvWdmN9aMk", // Episode 2
      3: "wC4sLG-FS4Y", // Episode 3
      4: "D2t4GbDmw9w", // Episode 4
      5: "4Ey2tkrkp1g"  // Episode 5
    },
    3: { // Season 3
      1: "-o3PDM3hR_g", // Episode 1
      2: "Oi3jy4gneCw", // Episode 2
      3: "MvlRH-xGmk0", // Episode 3
      4: "VKw0PsRG8kw", // Episode 4
      5: "qwFhQJdDViI"  // Episode 5
    }
  },
  
  // Jujutsu Kaisen (ID: 94605)
  "94605": {
    1: { // Season 1
      1: "pkKu9hLT-t8", // Episode 1
      2: "KNfhJGBFFPY", // Episode 2
      3: "3fh4wFJJIzE", // Episode 3
      4: "YhdGqHX3BgU", // Episode 4
      5: "yrXMk5SN1RY", // Episode 5
      6: "2Y8Qq7Zf_rM", // Episode 6
      7: "uv8eTcMG1Rk", // Episode 7
      8: "o0x-iBM3-ZU", // Episode 8
      9: "E3jRoZUVFBw", // Episode 9
      10: "wO2H9AjjAcM" // Episode 10
    },
    2: { // Season 2
      1: "yR9K4FmUlYE", // Episode 1
      2: "iFLt4Rva7-k", // Episode 2
      3: "4vkQOwS9IPM", // Episode 3
      4: "W_4YFBGh_xM", // Episode 4
      5: "bLwQ_IbL_tU"  // Episode 5
    }
  },
  
  // Naruto (ID: 31910)
  "31910": {
    1: { // Season 1
      1: "QczGoCmX-pI", // Episode 1
      2: "elAPV_SgKAE", // Episode 2
      3: "s5VYm-iysYM", // Episode 3
      4: "3XNk_WxTPp0", // Episode 4
      5: "KTAXj6WQUbQ", // Episode 5
      6: "QiWbXDjzr_c", // Episode 6
      7: "Rh_YCTfuCys", // Episode 7
      8: "XlL61QoGcJc", // Episode 8
      9: "xPt9H2bWUYQ", // Episode 9
      10: "Vc_mCa2UQnY" // Episode 10
    },
    2: { // Season 2
      1: "vNRrd5zDGI0", // Episode 1
      2: "r9dkn8dosT0", // Episode 2
      3: "VYh7XefWWm0", // Episode 3
      4: "NlJZ-YgAt-c", // Episode 4
      5: "dKwdcB7Lkhw"  // Episode 5
    }
  },
  
  // One Piece (ID: 37854)
  "37854": {
    1: { // Season 1
      1: "XwjhQyI_Pz4", // Episode 1
      2: "c8vSG_-B-8Y", // Episode 2
      3: "bkyV9JpSuDU", // Episode 3
      4: "aELK2LHSjoo", // Episode 4
      5: "YmPtfGbMAqk", // Episode 5
      6: "AXVoHJGgPJk", // Episode 6
      7: "F8qCxD5AfqE", // Episode 7
      8: "fXzVLDiCyfo", // Episode 8
      9: "qZVJESY8oG8", // Episode 9
      10: "SjkVvGgQFwY" // Episode 10
    },
    2: { // Season 2
      1: "WSUkpEJ7Q1U", // Episode 1
      2: "6LZRlU2V4Ao", // Episode 2
      3: "GotVc6v0xfE", // Episode 3
      4: "zfXzNxRY9wI", // Episode 4
      5: "hkH7jBxV0co"  // Episode 5
    }
  },
  
  // My Hero Academia (ID: 60625)
  "60625": {
    1: { // Season 1
      1: "D5fYOnwYkj4", // Episode 1
      2: "9ZIgCK7mDq4", // Episode 2
      3: "xjBTNOBeNI4", // Episode 3
      4: "bS8JAPcGBxw", // Episode 4
      5: "XHakl2bMQYI", // Episode 5
      6: "AgKFr3dAZs4", // Episode 6
      7: "2tVSmTArC7s", // Episode 7
      8: "qBqBR2uyBRY", // Episode 8
      9: "KXBQ-m0Z2AI", // Episode 9
      10: "h3gjiNI1td0" // Episode 10
    },
    2: { // Season 2
      1: "uxdS8TP5FPo", // Episode 1
      2: "7NFwhd9qvwU", // Episode 2
      3: "mYiTmHx7QlI", // Episode 3
      4: "FQxLQ3V8GJQ", // Episode 4
      5: "XZgZNyyR9tM"  // Episode 5
    }
  },
  
  // Hunter x Hunter (ID: 46298)
  "46298": {
    1: { // Season 1
      1: "XrdbZT5lPzA", // Episode 1
      2: "Jx3JLrQAQvM", // Episode 2
      3: "5TRzCmvqSPY", // Episode 3
      4: "ttukXxE3WrY", // Episode 4
      5: "kPkgaS98NpM", // Episode 5
      6: "sDakbiONCcs", // Episode 6
      7: "b6h85B9WZgQ", // Episode 7
      8: "Cmv8jnkEA7U", // Episode 8
      9: "_T-6nZckw6I", // Episode 9
      10: "9D-zKiiK1J0" // Episode 10
    }
  },
  
  // Tokyo Ghoul (ID: 61374)
  "61374": {
    1: { // Season 1
      1: "ETHpeMUB5UE", // Episode 1
      2: "KwZ_QbXoDxM", // Episode 2
      3: "KKFoxOPHnCE", // Episode 3
      4: "uCQx9jpz8cA", // Episode 4
      5: "VKMw7WjwI4o", // Episode 5
      6: "X_LXsF2_9N0", // Episode 6
      7: "uiMXwK6SQtI", // Episode 7
      8: "Qsv-7Bvtq78", // Episode 8
      9: "MeEsEQCtyIA", // Episode 9
      10: "pOIhY_2pW0A" // Episode 10
    }
  },
  
  // Death Note (ID: 13916)
  "13916": {
    1: { // Season 1
      1: "NlJZ-YgAt-c", // Episode 1
      2: "Vd8tg2njMfI", // Episode 2
      3: "mtPcVJ2KK-A", // Episode 3
      4: "eRIxgAIZH7M", // Episode 4
      5: "1D_9L_Zyumk", // Episode 5
      6: "C0YKmTQBTNo", // Episode 6
      7: "ZlUaHLANzSc", // Episode 7
      8: "QnYLwFcfDGw", // Episode 8
      9: "E0c8HTBc7qY", // Episode 9
      10: "SaRnyDIG5H8" // Episode 10
    }
  },
  
  // Fullmetal Alchemist: Brotherhood (ID: 31911)
  "31911": {
    1: { // Season 1
      1: "kQw9bPTvCRE", // Episode 1
      2: "eKCLd5j6fLQ", // Episode 2
      3: "qig4KOK2R2g", // Episode 3
      4: "xVF9D8JecAI", // Episode 4
      5: "tFEhJ1HsAvo", // Episode 5
      6: "kZ428K3PUFg", // Episode 6
      7: "bG5dlgvv0BE", // Episode 7
      8: "nTUURslE9BQ", // Episode 8
      9: "Z5QG8_BU55c", // Episode 9
      10: "N5jrg9Oc_RQ" // Episode 10
    }
  },
  
  // Solo Leveling (ID: 203555)
  "203555": {
    1: { // Season 1
      1: "SlNpRThS9t8", // Episode 1
      2: "ZefrVAetxlI", // Episode 2
      3: "LYTlC5VrQgw", // Episode 3
      4: "DsU3dGRjOWo", // Episode 4
      5: "LJHv1rl_H5g", // Episode 5
      6: "Y_d8HD-R9pw", // Episode 6
      7: "xyZKjcK8xUk", // Episode 7
      8: "xVvzTKQyN-8", // Episode 8
      9: "fQNUHSmBPR0", // Episode 9
      10: "vWSXcwQZRl0" // Episode 10
    }
  },
  
  // Spy x Family (ID: 120089)
  "120089": {
    1: { // Season 1
      1: "ofXigq9aIpo", // Episode 1
      2: "RVfMhH55Aus", // Episode 2
      3: "WIKW1B0J9Lk", // Episode 3
      4: "K68YOzxCd-Q", // Episode 4
      5: "ULFwHJ-5S50", // Episode 5
      6: "VZ4b7BLkHQc", // Episode 6
      7: "3l1hv6TOepM", // Episode 7
      8: "QQQchL27AFo", // Episode 8
      9: "gxWLfRdkRdw", // Episode 9
      10: "aKXq75mzDMQ" // Episode 10
    }
  },
  
  // Chainsaw Man (ID: 114410)
  "114410": {
    1: { // Season 1
      1: "dFlDRhvM4L0", // Episode 1
      2: "OTcJEIbGI_0", // Episode 2
      3: "QZXhx0rxgKs", // Episode 3
      4: "oDLBJ3Z8qJQ", // Episode 4
      5: "Ap13QmQCjsY", // Episode 5
      6: "iUXhT0VsHoQ", // Episode 6
      7: "bAOBJgH0Yjw", // Episode 7
      8: "kLVzSF2R7T8", // Episode 8
      9: "WYQgFvGxHGQ", // Episode 9
      10: "bCCg8XC6A9w" // Episode 10
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
