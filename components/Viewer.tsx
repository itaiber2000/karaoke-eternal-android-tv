import React, { useState, useEffect } from 'react';
import { ServerConfig } from '../types';
import { X, ExternalLink, Loader2 } from 'lucide-react';

interface ViewerProps {
  server: ServerConfig;
  onExit: () => void;
}

export const Viewer: React.FC<ViewerProps> = ({ server, onExit }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);

  // Auto-hide controls after inactivity
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const handleActivity = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);

    // Initial hide timer
    timeout = setTimeout(() => setShowControls(false), 3000);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      clearTimeout(timeout);
    };
  }, []);

  // Handle Escape key to exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExit]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Top Overlay Bar */}
      <div 
        className={`absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/90 to-transparent transition-opacity duration-300 z-50 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="flex items-center gap-4">
            <button 
                onClick={onExit}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white font-medium transition-all focus:ring-2 focus:ring-white"
            >
                <X className="w-5 h-5" /> Exit Viewer
            </button>
            <span className="text-white/80 font-medium drop-shadow-md">{server.name}</span>
        </div>

        <a 
            href={server.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-blue-600/80 hover:bg-blue-600 backdrop-blur-md px-4 py-2 rounded-full text-white font-medium transition-all focus:ring-2 focus:ring-white"
        >
            Open in Browser <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center text-white">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
                <p className="text-xl">Connecting to {server.name}...</p>
            </div>
        </div>
      )}

      {/* The actual content */}
      <iframe
        src={server.url}
        className="flex-1 w-full h-full border-0 bg-white"
        allowFullScreen
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)} // Simple error handling
        sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
      />
    </div>
  );
};