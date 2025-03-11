
import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EpisodeDetailsProps {
  title: string;
  currentSeason: number;
  currentEpisode: number;
}

const EpisodeDetails: React.FC<EpisodeDetailsProps> = ({ title, currentSeason, currentEpisode }) => {
  return (
    <div className="p-4 bg-neutral-900">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">
          {title} - S{currentSeason} E{currentEpisode}
        </h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="bg-gray-700">
            <ThumbsUp size={16} className="mr-1" />
            {Math.floor(Math.random() * 1000) + 100}
          </Button>
          <Button variant="outline" size="sm" className="bg-gray-700">
            <ThumbsDown size={16} className="mr-1" />
            {Math.floor(Math.random() * 100)}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EpisodeDetails;
