
import React from 'react';
import { List } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoPlayerProps {
  videoId: string | undefined;
  isLoading: boolean;
  isMuted: boolean;
  showEpisodeList: boolean;
  onToggleEpisodeList: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  videoId, 
  isLoading, 
  isMuted, 
  showEpisodeList,
  onToggleEpisodeList 
}) => {
  return (
    <div className="relative w-full bg-black" style={{ height: "65vh" }}>
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        <div className="h-full w-full">
          <iframe 
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&rel=0&showinfo=0&modestbranding=1&controls=1&disablekb=1&fs=1&iv_load_policy=3&loop=0&origin=${window.location.origin}&enablejsapi=1&widgetid=1&cc_load_policy=0&hl=en-US&cc_lang_pref=en-US&playsinline=1&annotations=0&color=white&hl=en&playlist=${videoId}&nologo=1`} 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            allow="autoplay; fullscreen" 
            allowFullScreen 
            title="Anime Video Player" 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%'
            }}
          ></iframe>
        </div>
      )}
      
      {!showEpisodeList && (
        <Button variant="ghost" size="sm" className="absolute top-4 left-4 bg-black/50 text-white" onClick={onToggleEpisodeList}>
          <List size={16} className="mr-2" />
          <span>Show Episodes</span>
        </Button>
      )}
    </div>
  );
};

export default VideoPlayer;
