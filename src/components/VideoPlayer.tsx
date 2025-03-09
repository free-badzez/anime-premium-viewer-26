
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  videoId: string;
  isOpen: boolean;
  onClose: () => void;
}

const VideoPlayer = ({ videoId, isOpen, onClose }: VideoPlayerProps) => {
  const [isLoading, setIsLoading] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl aspect-video">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X size={24} className="text-white" />
        </button>
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
        
        <iframe
          src={`https://www.dailymotion.com/embed/video/${videoId}?autoplay=1`}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="autoplay; fullscreen"
          allowFullScreen
          title="Dailymotion Video Player"
          className={cn(
            "bg-black",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={() => setIsLoading(false)}
        ></iframe>
      </div>
    </div>
  );
};

export default VideoPlayer;
