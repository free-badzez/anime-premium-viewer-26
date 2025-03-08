import { Anime, AnimeDetail, TMDBResponse } from "@/types/anime";

const TMDB_API_KEY = "de83af9bf3f4cf2d61cb8a9467045768";
const BASE_URL = "https://api.themoviedb.org/3";
const ANIME_TYPE_ID = 16; // Animation genre ID in TMDB
const LANGUAGE = "ru-RU"; // Русский язык
const ANIME_KEYWORDS = "anime"; // Ключевое слово для поиска аниме

// Популярные аниме для поиска (названия известных аниме)
const POPULAR_ANIME_TITLES = [
  "Хоримия", 
  "Этот глупый свин", 
  "Унеси меня на луну", 
  "О моём перерождении в слизь", 
  "Семья шпиона", 
  "Стальной алхимик", 
  "Атака титанов", 
  "Клинок, рассекающий демонов", 
  "Моя геройская академия",
  "Ван-Пис",
  "Наруто",
  "Твоё имя",
  "Унесённые призраками",
  "Ковбой Бибоп",
  "Евангелион"
];

// Helper function to create image URLs
export const getImageUrl = (path: string | null, size: string = "original") => {
  if (!path) return "/placeholder.svg";
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// Generic fetch function with error handling
const fetchFromTMDB = async <T>(endpoint: string, params: Record<string, string> = {}): Promise<T> => {
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

// Get trending anime
export const getTrendingAnime = async (timeWindow: 'day' | 'week' = 'week', page: number = 1) => {
  const response = await fetchFromTMDB<TMDBResponse<Anime>>(`/trending/all/${timeWindow}`, {
    page: page.toString(),
    with_genres: ANIME_TYPE_ID.toString(),
    with_keywords: ANIME_KEYWORDS,
  });
  
  // Фильтруем результаты, чтобы включать только тв-шоу и фильмы с японским оригинальным языком
  const filteredResults = response.results.filter(item => 
    (item.media_type === 'tv' || item.media_type === 'movie') && 
    (item.original_language === 'ja')
  );
  
  return {
    ...response,
    results: filteredResults
  };
};

// Get popular anime
export const getPopularAnime = async (page: number = 1) => {
  // Сначала получаем популярные аниме-сериалы
  const tvResponse = await fetchFromTMDB<TMDBResponse<Anime>>('/discover/tv', {
    page: page.toString(),
    sort_by: 'popularity.desc',
    with_genres: ANIME_TYPE_ID.toString(),
    with_original_language: 'ja', // Только с японским оригинальным языком
  });
  
  // Затем получаем популярные аниме-фильмы
  const movieResponse = await fetchFromTMDB<TMDBResponse<Anime>>('/discover/movie', {
    page: page.toString(),
    sort_by: 'popularity.desc',
    with_genres: ANIME_TYPE_ID.toString(),
    with_original_language: 'ja', // Только с японским оригинальным языком
  });
  
  // Объединяем и сортируем результаты по популярности
  const combinedResults = [...tvResponse.results, ...movieResponse.results]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 24); // Увеличиваем до 24 результатов
  
  return {
    ...tvResponse,
    results: combinedResults
  };
};

// Get top rated anime
export const getTopRatedAnime = async (page: number = 1) => {
  // Сначала получаем топовые аниме-сериалы
  const tvResponse = await fetchFromTMDB<TMDBResponse<Anime>>('/discover/tv', {
    page: page.toString(),
    sort_by: 'vote_average.desc',
    with_genres: ANIME_TYPE_ID.toString(),
    'vote_count.gte': '100',
    with_original_language: 'ja',
  });
  
  // Затем получаем топовые аниме-фильмы
  const movieResponse = await fetchFromTMDB<TMDBResponse<Anime>>('/discover/movie', {
    page: page.toString(),
    sort_by: 'vote_average.desc',
    with_genres: ANIME_TYPE_ID.toString(),
    'vote_count.gte': '100',
    with_original_language: 'ja',
  });
  
  // Объединяем и сортируем результаты по рейтингу
  const combinedResults = [...tvResponse.results, ...movieResponse.results]
    .sort((a, b) => b.vote_average - a.vote_average)
    .slice(0, 24); // Увеличиваем до 24 результатов
  
  return {
    ...tvResponse,
    results: combinedResults
  };
};

// Get recent anime with popular titles
export const getRecentAnime = async (page: number = 1) => {
  const currentDate = new Date();
  const threeYearsAgo = new Date();
  threeYearsAgo.setFullYear(currentDate.getFullYear() - 3);
  
  const formattedCurrentDate = currentDate.toISOString().split('T')[0];
  const formattedThreeYearsAgo = threeYearsAgo.toISOString().split('T')[0];
  
  // Создаем запросы для поиска конкретных аниме по названиям
  const searchPromises = POPULAR_ANIME_TITLES.map(title => 
    fetchFromTMDB<TMDBResponse<Anime>>('/search/multi', {
      query: title,
      page: '1',
      include_adult: 'false',
    })
  );
  
  // Выполняем все запросы параллельно
  const searchResults = await Promise.all(searchPromises);
  
  // Получаем недавние аниме-сериалы (основной поток)
  const tvResponse = await fetchFromTMDB<TMDBResponse<Anime>>('/discover/tv', {
    page: page.toString(),
    'air_date.gte': formattedThreeYearsAgo,
    'air_date.lte': formattedCurrentDate,
    sort_by: 'first_air_date.desc',
    with_genres: ANIME_TYPE_ID.toString(),
    with_original_language: 'ja',
  });
  
  // Собираем все результаты из поисков по названиям
  let popularTitles: Anime[] = [];
  searchResults.forEach(response => {
    // Фильтруем только аниме с японским оригинальным языком
    const filtered = response.results.filter(item => 
      (item.media_type === 'tv' || item.media_type === 'movie') && 
      item.original_language === 'ja'
    );
    popularTitles = [...popularTitles, ...filtered];
  });
  
  // Удаляем дубликаты по ID
  const uniquePopularTitles = popularTitles.filter((item, index, self) =>
    index === self.findIndex((t) => t.id === item.id)
  );
  
  // Объединяем найденные популярные тайтлы с обычными результатами
  const combinedResults = [...uniquePopularTitles, ...tvResponse.results]
    .slice(0, 24); // Ограничиваем до 24 результатов
  
  return {
    ...tvResponse,
    results: combinedResults
  };
};

// Get anime details
export const getAnimeDetails = async (id: number, mediaType?: string) => {
  // Если тип медиа не указан, пробуем сначала как ТВ-шоу, затем как фильм
  if (!mediaType) {
    try {
      const response = await fetchFromTMDB<AnimeDetail>(`/tv/${id}`);
      return response;
    } catch (error) {
      // Если не найдено как ТВ-шоу, пробуем как фильм
      return await fetchFromTMDB<AnimeDetail>(`/movie/${id}`);
    }
  }
  
  // Если тип медиа указан, используем его
  return await fetchFromTMDB<AnimeDetail>(`/${mediaType}/${id}`);
};

// Search for anime
export const searchAnime = async (query: string, page: number = 1) => {
  // Поиск по всем типам контента
  const response = await fetchFromTMDB<TMDBResponse<Anime>>('/search/multi', {
    query,
    page: page.toString(),
    include_adult: 'false',
  });
  
  // Фильтруем результаты, чтобы включать только аниме
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
