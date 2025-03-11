
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationHeaderProps {
  animeId: number;
}

const NavigationHeader: React.FC<NavigationHeaderProps> = ({ animeId }) => {
  const navigate = useNavigate();
  
  return (
    <div className="p-4 bg-neutral-900">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" className="text-white mr-4" onClick={() => navigate(`/anime/${animeId}`)}>
          <ChevronLeft size={20} />
          <span>Back</span>
        </Button>
        
        <Link to="/" className="text-white hover:text-gray-300 mr-4">Home</Link>
        <span className="text-gray-500 mx-2">•</span>
        <Link to="/tv" className="text-white hover:text-gray-300 mr-4">TV</Link>
        <span className="text-gray-500 mx-2">•</span>
        <Link to="/trending" className="text-white hover:text-gray-300 mr-4">Trending</Link>
        <span className="text-gray-500 mx-2">•</span>
        <Link to="/top-rated" className="text-white hover:text-gray-300 mr-4">Top Rated</Link>
      </div>
    </div>
  );
};

export default NavigationHeader;
