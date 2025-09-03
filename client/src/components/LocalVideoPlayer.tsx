// *******************
// Project        : Boeing Review LHM  
// File           : client/src/components/LocalVideoPlayer.tsx
// Version        : v1.0  Last update: 01/08/2025 15:45 EST
// Status         : Supports: UV | PNP
// Classification : CUI//SP-CTI
// Purpose        : Local video player component for demo videos
// Workflow       : MAIN
// Core Module    : yes
// App Functionality : [video-playback]
// Dependencies
//   * Called by       : Demo pages, maintenance components
//   * Calls           : React, HTML5 video
//   * Libraries       : React, TypeScript
//   * Infrastructure  : Browser video API
// Change Log
//   * v1.0 (01/08/2025): Initial creation for local video support
// Description     : Video player component that uses files from public/media directory
// *******************

import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

interface LocalVideoPlayerProps {
  videoFileName: string;
  title?: string;
  autoPlay?: boolean;
  controls?: boolean;
  width?: string;
  height?: string;
  className?: string;
}

export const LocalVideoPlayer: React.FC<LocalVideoPlayerProps> = ({
  videoFileName,
  title,
  autoPlay = false,
  controls = true,
  width = "100%",
  height = "auto",
  className = ""
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Construct video URL from public directory
  const videoUrl = `/media/${videoFileName}`;

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current && videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const handleError = () => {
    setError(`Could not load video: ${videoFileName}`);
    console.error(`Video not found: ${videoUrl}`);
  };

  const handleLoadedData = () => {
    setError(null);
  };

  if (error) {
    return (
      <div className={`bg-slate-800 rounded-lg p-8 text-center ${className}`}>
        <div className="text-red-400 mb-2">⚠ Video Unavailable</div>
        <div className="text-gray-400 text-sm">{error}</div>
        {title && <div className="text-gray-500 text-xs mt-2">{title}</div>}
      </div>
    );
  }

  return (
    <div className={`relative group ${className}`}>
      {title && (
        <h3 className="text-white text-lg font-semibold mb-2">{title}</h3>
      )}

      <div className="relative bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          src={videoUrl}
          autoPlay={autoPlay}
          controls={controls}
          muted={isMuted}
          width={width}
          height={height}
          onError={handleError}
          onLoadedData={handleLoadedData}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="w-full h-full"
        >
          <source src={videoUrl} type="video/mp4" />
          <source src={videoUrl} type="video/mov" />
          Your browser does not support the video tag.
        </video>

        {/* Custom Controls Overlay (optional) */}
        {!controls && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <button
                  onClick={togglePlay}
                  title={isPlaying ? "Pause video" : "Play video"}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>

                <button
                  onClick={toggleMute}
                  title={isMuted ? "Unmute video" : "Mute video"}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
              </div>

              <button
                onClick={toggleFullscreen}
                title="Enter fullscreen"
                className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
              >
                <Maximize size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Example usage component
export const BoeingVideoDemo: React.FC = () => {
  return (
    <div className="space-y-6">
      <LocalVideoPlayer
        videoFileName="aircraft-demo.mp4"
        title="Aircraft Maintenance Demo"
        controls={true}
        className="mb-4"
      />

      <LocalVideoPlayer
        videoFileName="screen-recording.mp4"
        title="Platform Walkthrough"
        controls={true}
        className="mb-4"
      />
    </div>
  );
};

export default LocalVideoPlayer; 