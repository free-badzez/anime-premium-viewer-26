
export interface Anime {
  id: number;
  name: string;
  original_name: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  original_language: string;
  genre_ids: number[];
}

export interface AnimeDetail extends Anime {
  genres: {
    id: number;
    name: string;
  }[];
  number_of_episodes: number;
  number_of_seasons: number;
  status: string;
  type: string;
  homepage: string;
  production_companies: {
    id: number;
    name: string;
    logo_path: string;
    origin_country: string;
  }[];
  seasons: {
    id: number;
    name: string;
    overview: string;
    air_date: string;
    episode_count: number;
    poster_path: string;
    season_number: number;
  }[];
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}
