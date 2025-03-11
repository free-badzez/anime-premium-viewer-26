
// Core API utilities and constants
const TMDB_API_KEY = "de83af9bf3f4cf2d61cb8a9467045768";
const BASE_URL = "https://api.themoviedb.org/3";
const ANIME_TYPE_ID = 16; // Animation genre ID in TMDB
const LANGUAGE = "en-US"; // English language
const ANIME_KEYWORDS = "anime"; // Keyword for anime search

// Helper function to create image URLs
export const getImageUrl = (path: string | null, size: string = "original") => {
  if (!path) return "/placeholder.svg";
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// Generic fetch function with error handling
export const fetchFromTMDB = async <T>(endpoint: string, params: Record<string, string> = {}): Promise<T> => {
  const queryParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    language: LANGUAGE,
    ...params,
  });
  
  const url = `${BASE_URL}${endpoint}?${queryParams}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`TMDB API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch from TMDB:", error);
    throw error;
  }
};

// Constants for filtering and searches
export const POPULAR_ANIME_TITLES = [
  "Horimiya", 
  "Rascal Does Not Dream of Bunny Girl Senpai", 
  "Fly Me to the Moon", 
  "That Time I Got Reincarnated as a Slime", 
  "Spy x Family", 
  "Fullmetal Alchemist", 
  "Attack on Titan", 
  "Demon Slayer", 
  "My Hero Academia",
  "One Piece",
  "Naruto",
  "Your Name",
  "Spirited Away",
  "Cowboy Bebop",
  "Neon Genesis Evangelion",
  "Death Note",
  "Jujutsu Kaisen",
  "Chainsaw Man",
  "Solo Leveling",
  "Bleach",
  "Hunter x Hunter",
  "Dragon Ball Z",
  "One Punch Man",
  "Tokyo Ghoul",
  "Violet Evergarden",
  "Sword Art Online",
  "Black Clover",
  "Mob Psycho 100",
  "The Promised Neverland",
  "Vinland Saga"
];

export {
  TMDB_API_KEY,
  BASE_URL,
  ANIME_TYPE_ID,
  LANGUAGE,
  ANIME_KEYWORDS
};
