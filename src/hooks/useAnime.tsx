
import { useQuery } from "@tanstack/react-query";
import {
  getTrendingAnime,
  getPopularAnime,
  getTopRatedAnime,
  getAnimeDetails,
  searchAnime
} from "@/lib/api";

export const useTrendingAnime = (timeWindow: 'day' | 'week' = 'week', page: number = 1) => {
  return useQuery({
    queryKey: ['trending-anime', timeWindow, page],
    queryFn: () => getTrendingAnime(timeWindow, page),
  });
};

export const usePopularAnime = (page: number = 1) => {
  return useQuery({
    queryKey: ['popular-anime', page],
    queryFn: () => getPopularAnime(page),
  });
};

export const useTopRatedAnime = (page: number = 1) => {
  return useQuery({
    queryKey: ['top-rated-anime', page],
    queryFn: () => getTopRatedAnime(page),
  });
};

export const useAnimeDetails = (id: number) => {
  return useQuery({
    queryKey: ['anime-details', id],
    queryFn: () => getAnimeDetails(id),
    enabled: !!id,
  });
};

export const useSearchAnime = (query: string, page: number = 1) => {
  return useQuery({
    queryKey: ['search-anime', query, page],
    queryFn: () => searchAnime(query, page),
    enabled: query.length > 0,
  });
};
