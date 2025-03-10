
import React from 'react';
import { useTrendingAnime } from '@/hooks/useAnime';
import Navbar from '@/components/Navbar';
import AnimeGrid from '@/components/AnimeGrid';
import { Skeleton } from '@/components/ui/skeleton';

const Trending = () => {
  const { data, isLoading, error } = useTrendingAnime('week', 1);
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 md:px-10 pt-28 pb-16">
        <h1 className="text-3xl font-bold mb-8">Trending Anime</h1>
        
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">Failed to load trending anime</p>
          </div>
        ) : (
          <AnimeGrid animes={data?.results || []} isLoading={isLoading} error={error} />
        )}
      </div>
    </div>
  );
};

export default Trending;
