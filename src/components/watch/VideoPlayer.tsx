
import React, { useState, useEffect } from 'react';
import { List } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoPlayerProps {
  videoId: string | undefined;
  isLoading: boolean;
  isMuted: boolean;
  showEpisodeList: boolean;
  onToggleEpisodeList: () => void;
  isDriveLink?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  videoId, 
  isLoading, 
  isMuted, 
  showEpisodeList,
  onToggleEpisodeList,
  isDriveLink = false
}) => {
  const [playerLoaded, setPlayerLoaded] = useState(false);
  const [loadStarted, setLoadStarted] = useState(false);

  // Delay iframe loading slightly to improve perceived performance
  useEffect(() => {
    if (videoId && !loadStarted) {
      setLoadStarted(true);
      // Start loading the iframe immediately instead of waiting
      // This improves actual loading speed but maintains the loading UI
    }
  }, [videoId, loadStarted]);
  
  // Generate the appropriate video source URL with optimized parameters
  const videoSrc = videoId ? (
    isDriveLink 
      ? `https://drive.google.com/file/d/${videoId}/preview` 
      : `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&rel=0&showinfo=0&modestbranding=1&controls=1&disablekb=1&fs=1&iv_load_policy=3&loop=0&origin=${window.location.origin}&enablejsapi=1&widgetid=1&cc_load_policy=0&hl=en-US&cc_lang_pref=en-US&playsinline=1&annotations=0&color=white&playlist=${videoId}&nologo=1`
  ) : '';

  const handleIframeLoad = () => {
    setPlayerLoaded(true);
  };

  return (
    <div className="relative w-full bg-black shadow-lg dark:shadow-gray-900/50" style={{ height: "65vh" }}>
      {(isLoading || !playerLoaded) && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 opacity-75"></div>
        </div>
      )}
      
      {loadStarted && videoSrc && (
        <div className="h-full w-full">
          <iframe 
            src={videoSrc}
            width="100%" 
            height="100%" 
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen 
            title={isDriveLink ? "Google Drive Video Player" : "Anime Video Player"}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: playerLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }}
            className="rounded-sm"
            onLoad={handleIframeLoad}
            importance="high" // Hints to browser that this is a high priority resource
            loading="eager" // Explicitly tell browser to load this immediately
          ></iframe>
        </div>
      )}
      
      {!showEpisodeList && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition-all duration-300 border border-purple-500/30"
          onClick={onToggleEpisodeList}
        >
          <List size={16} className="mr-2 text-purple-400" />
          <span>Show Episodes</span>
        </Button>
      )}
    </div>
  );
};

export default VideoPlayer;
