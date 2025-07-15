import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface ProgressBarProps {
  progress?: number;
}

export default function ProgressBar({ progress = 10 }: ProgressBarProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const getStatusMessage = (progress: number) => {

    if (progress <= 10) {
      return "Analyzing crash video footage...";
    } else if (progress <= 24) {
      return "Accessing speed limit information...";
    } else if (progress <= 25) {
      return "Revisiting crash footage";
    } else if (progress <= 40) {
      return "Reviewing accident report";
    } else if (progress <= 60) {
      return "Reviewing 911 call";
    } else if (progress <= 75) {
      return "Collecting insights and conducting final analysis";
    } else if (progress <= 85) {
      return "Surfacing final decision on insurance claim for human review";
    } else if (progress <= 100) {
      return "Claim approved";
    } else {
      return "Processing analysis...";
    }
  };

  return (
    <div className="h-full bg-[hsl(220,15%,22%)] border-t border-[hsl(220,12%,28%)] flex items-center px-6">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-sm animate-pulse">{getStatusMessage(progress)}</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-medium">Online</span>
          </div>
        </div>
        <div className="bg-[hsl(220,12%,28%)] h-3 rounded-full overflow-hidden relative shadow-inner">
          <div 
            className="bg-gradient-to-r from-blue-500 via-green-500 via-orange-500 to-purple-500 h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-shimmer"></div>
            
            {/* Pulsing effect when progress > 0 */}
            {progress > 0 && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-green-400 via-orange-400 to-purple-400 animate-pulse opacity-50"></div>
            )}
          </div>
          
          {/* Background glow effect */}
          {progress > 0 && (
            <div 
              className="absolute top-0 left-0 h-3 bg-gradient-to-r from-blue-500/20 via-green-500/20 via-orange-500/20 to-purple-500/20 rounded-full blur-sm transition-all duration-1000"
              style={{ width: `${Math.min(progress + 10, 100)}%` }}
            ></div>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-4 ml-6 text-sm text-gray-400">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>22 Agents Active</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>{formatTime(currentTime)}</span>
        </div>
      </div>
    </div>
  );
}
