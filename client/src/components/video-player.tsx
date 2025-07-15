import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward, Volume2, Upload, Lightbulb, X } from "lucide-react";
import { useDemoTimer } from '../hooks/use-demo-timer';
// Video now served from public directory
const newVideoSrc = "/media/demo-clip.mp4";
const screenRecordingSrc = "/Aircraft Defect Analysis.mp4";

interface VideoPlayerProps {
  onProgressChange?: (progress: number) => void;
  onVideoEnd?: () => void;
}

interface AgentMessage {
  id: string;
  agentName: string;
  message: string;
  timestamp: string;
  type: 'analysis' | 'detection' | 'recommendation';
}

export default function VideoPlayer({ onProgressChange, onVideoEnd }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoProgress, setVideoProgress] = useState(10); // Start at 10%
  const [showInsight, setShowInsight] = useState(false);
  const [insightTriggered, setInsightTriggered] = useState(false);
  const [secondVideoTriggered, setSecondVideoTriggered] = useState(false);
  const [progressUpdateTriggered, setProgressUpdateTriggered] = useState(false);
  const [videoReplayTriggered, setVideoReplayTriggered] = useState(false);
  const [thirdInsightTriggered, setThirdInsightTriggered] = useState(false);
  const [showThirdInsight, setShowThirdInsight] = useState(false);
  const [progressUpdate40Triggered, setProgressUpdate40Triggered] = useState(false);
  const [pageFlipTriggered, setPageFlipTriggered] = useState(false);
  const [progressUpdate60Triggered, setProgressUpdate60Triggered] = useState(false);
  const [progressUpdate75Triggered, setProgressUpdate75Triggered] = useState(false);
  const [progressUpdate85Triggered, setProgressUpdate85Triggered] = useState(false);
  
  // Agent log state
  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([]);
  const [messageCount, setMessageCount] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const agentLogRef = useRef<HTMLDivElement>(null);
  
  // Use centralized demo timer
  const { currentTime: demoTime, isEventTriggered, registerEvent } = useDemoTimer();

  // Register demo events on component mount
  useEffect(() => {
    registerEvent('first-video-start', 0);
    registerEvent('first-insight', 5);
    registerEvent('second-video-start', 1);
    registerEvent('second-insight', 10);
    registerEvent('progress-update-25', 25);
    registerEvent('video-replay', 22);
    registerEvent('third-insight', 15);
    registerEvent('progress-update-40', 42);
    registerEvent('page-flip-start', 2);
    registerEvent('progress-update-60', 52);
    registerEvent('progress-update-75', 73);
    registerEvent('progress-update-85', 76);

    onProgressChange?.(10);
  }, [registerEvent, onProgressChange]);

  // Add agent message function
  const addAgentMessage = (agentName: string, message: string, type: 'analysis' | 'detection' | 'recommendation' = 'analysis') => {
    const newMessage: AgentMessage = {
      id: `video-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      agentName,
      message,
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      }),
      type
    };
    setAgentMessages(prev => [...prev, newMessage]);
    setMessageCount(prev => prev + 1);
    
    // Auto-scroll to bottom with smooth behavior
    setTimeout(() => {
      if (agentLogRef.current) {
        agentLogRef.current.scrollTo({
          top: agentLogRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  // Monitor demo timer for events
  useEffect(() => {
    // Add initial agent messages
    if (demoTime >= 1 && agentMessages.length === 0) {
      addAgentMessage('Video Analysis AI', 'Beginning aircraft maintenance footage analysis...', 'analysis');
      setTimeout(() => addAgentMessage('Component Detection AI', 'Detected landing gear assembly and hydraulic systems', 'detection'), 2000);
      setTimeout(() => addAgentMessage('Structural Analysis AI', 'Analyzing landing gear strut condition and wear patterns', 'analysis'), 4000);
      setTimeout(() => addAgentMessage('Crack Detection AI', 'Scanning for structural anomalies and fatigue cracks', 'analysis'), 6000);
      setTimeout(() => addAgentMessage('Maintenance Planning AI', 'Evaluating maintenance requirements and scheduling', 'analysis'), 8000);
    }

    // First insight at 5 seconds - should show regardless of video state
    if (isEventTriggered('first-insight') && !insightTriggered) {
      console.log('Demo: First insight triggered at 5 seconds');
      setVideoProgress(20);
      onProgressChange?.(20);
      setShowInsight(true);
      setInsightTriggered(true);
      
      // Add agent message for this insight
      addAgentMessage('Structural Assessment AI', 'Critical crack detected in landing gear strut exceeding safety threshold', 'recommendation');
      
      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        setShowInsight(false);
      }, 5000);
    }

    // Second video starts at 10 seconds (triggers Web Browser video, doesn't affect this video)
    if (isEventTriggered('second-video-start') && !secondVideoTriggered) {
      console.log('Demo: Second video triggered at 10 seconds - signaling Web Browser');
      setSecondVideoTriggered(true);
      // Don't update progress here - let the proper sequence handle it
      onVideoEnd?.(); // This signals the Web Browser to start its video
    }

    // Progress update at 25 seconds
    if (isEventTriggered('progress-update-25') && !progressUpdateTriggered) {
      console.log('Demo: Progress update triggered at 25 seconds');
      setProgressUpdateTriggered(true);
      setVideoProgress(25);
      onProgressChange?.(25);
    }

    // Video replay at 22 seconds
    if (isEventTriggered('video-replay') && !videoReplayTriggered) {
      console.log('Demo: Video replay triggered at 22 seconds');
      setVideoReplayTriggered(true);
      addAgentMessage('Replay System', 'Replaying maintenance footage for detailed structural analysis', 'analysis');
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(error => {
          console.log('Video replay autoplay prevented by browser:', error);
        });
      }
    }

    // Add more agent messages at 25 seconds
    if (isEventTriggered('progress-update-25') && !progressUpdateTriggered) {
      setTimeout(() => addAgentMessage('Stress Analysis AI', 'Calculating structural stress patterns and load distributions', 'analysis'), 1000);
    }

    // Third insight at 15 seconds
    if (isEventTriggered('third-insight') && !thirdInsightTriggered) {
      console.log('Demo: Third insight triggered at 15 seconds');
      setThirdInsightTriggered(true);
      setShowThirdInsight(true);
      addAgentMessage('Safety Threshold AI', 'Crack size exceeds 2 cm safety threshold - immediate maintenance required', 'detection');
      
      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        setShowThirdInsight(false);
      }, 5000);
    }

    // Add more comprehensive agent messages
    if (isEventTriggered('progress-update-40') && !progressUpdate40Triggered) {
      setTimeout(() => addAgentMessage('Fatigue Analysis AI', 'Analyzing material fatigue and stress concentration patterns', 'analysis'), 500);
      setTimeout(() => addAgentMessage('Compliance Assessment AI', 'Reviewing maintenance requirements per Airbus Manual Section 05-10', 'recommendation'), 2000);
    }

    // Progress update at 42 seconds
    if (isEventTriggered('progress-update-40') && !progressUpdate40Triggered) {
      console.log('Demo: Progress update triggered at 42 seconds');
      setProgressUpdate40Triggered(true);
      setVideoProgress(40);
      onProgressChange?.(40);
    }

    // Page flip start at 43 seconds
    if (isEventTriggered('page-flip-start') && !pageFlipTriggered) {
      console.log('Demo: Page flip triggered at 43 seconds');
      setPageFlipTriggered(true);
      // Trigger page flipping in Document Viewer
      window.dispatchEvent(new CustomEvent('startPageFlip'));
    }

    // Progress update at 52 seconds
    if (isEventTriggered('progress-update-60') && !progressUpdate60Triggered) {
      console.log('Demo: Progress update triggered at 52 seconds');
      setProgressUpdate60Triggered(true);
      setVideoProgress(60);
      onProgressChange?.(60);
    }

    // Progress update at 73 seconds
    if (isEventTriggered('progress-update-75') && !progressUpdate75Triggered) {
      console.log('Demo: Progress update triggered at 73 seconds');
      setProgressUpdate75Triggered(true);
      setVideoProgress(75);
      onProgressChange?.(75);
    }

    // Progress update at 76 seconds
    if (isEventTriggered('progress-update-85') && !progressUpdate85Triggered) {
      console.log('Demo: Progress update triggered at 76 seconds');
      setProgressUpdate85Triggered(true);
      setVideoProgress(85);
      onProgressChange?.(85);
    }


  }, [demoTime, isEventTriggered, insightTriggered, secondVideoTriggered, progressUpdateTriggered, videoReplayTriggered, thirdInsightTriggered, progressUpdate40Triggered, pageFlipTriggered, progressUpdate60Triggered, progressUpdate75Triggered, progressUpdate85Triggered, onProgressChange, onVideoEnd]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
      if (videoRef.current) {
        videoRef.current.src = URL.createObjectURL(file);
      }
    }
  };

  const togglePlay = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        try {
          await videoRef.current.play();
        } catch (error) {
          console.log('Video play failed, user interaction required:', error);
          // Video will play when user clicks play button
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-[hsl(220,20%,18%)] h-full flex flex-col">
      {/* Header */}
      <div className="h-12 bg-white flex items-center justify-between px-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <Play className="w-5 h-5 text-black" />
          <span className="text-black font-medium">Video</span>
        </div>
        <div className="flex items-center space-x-2">
        </div>
      </div>

      {/* Content - Split into Video (80%) and Agent Log (20%) */}
      <div className="flex-1 flex min-h-0">
        {/* Video Section - 80% */}
        <div className="flex-1 relative flex flex-col items-center justify-center bg-black/50" style={{ width: '80%' }}>
          {/* First Insight Popup - AI Speech Bubble */}
        {showInsight && (
          <div className="absolute top-4 left-4 right-4 z-20">
            <div className="relative">
              {/* AI Agent Avatar */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-[#274754] rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#274754] rounded-full animate-pulse"></div>
                  </div>
                </div>
                
                {/* Speech Bubble */}
                <div className="relative bg-[#274754] rounded-2xl rounded-tl-sm p-4 shadow-lg max-w-md">
                  {/* Speech bubble tail */}
                  <div className="absolute left-0 top-2 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[12px] border-r-[#274754] -translate-x-3"></div>
                  
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-2">
                      <div className="text-xs font-medium text-gray-100 mb-1 opacity-80">AI Agent</div>
                      <p className="text-sm text-white leading-relaxed">
                        A220 landing gear strut shows critical structural crack requiring immediate grounding and replacement
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowInsight(false)}
                      className="text-gray-200 hover:text-white hover:bg-gray-600 p-1 ml-2"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Third Insight Popup - AI Speech Bubble */}
        {showThirdInsight && (
          <div className="absolute top-4 left-4 right-4 z-20">
            <div className="relative">
              {/* AI Agent Avatar */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-[#274754] rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#274754] rounded-full animate-pulse"></div>
                  </div>
                </div>
                
                {/* Speech Bubble */}
                <div className="relative bg-[#274754] rounded-2xl rounded-tl-sm p-4 shadow-lg max-w-md">
                  {/* Speech bubble tail */}
                  <div className="absolute left-0 top-2 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[12px] border-r-[#274754] -translate-x-3"></div>
                  
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-2">
                      <div className="text-xs font-medium text-gray-100 mb-1 opacity-80">AI Agent</div>
                      <p className="text-sm text-white leading-relaxed">
                        Landing gear strut crack measures 2.3 cm, exceeding 2 cm safety threshold per Airbus Manual Section 05-10
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowThirdInsight(false)}
                      className="text-gray-200 hover:text-white hover:bg-gray-600 p-1 ml-2"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!selectedFile ? (
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            src={screenRecordingSrc}
            autoPlay
            muted
            loop
            controls
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          />
        ) : (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
              onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
              onEnded={() => setIsPlaying(false)}
            />
            
            {/* Video Controls Overlay */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center justify-between mb-2 text-sm text-white">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <Slider
                  value={[currentTime]}
                  max={duration}
                  step={1}
                  className="mb-3"
                  onValueChange={(value) => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = value[0];
                      setCurrentTime(value[0]);
                    }
                  }}
                />
                <div className="flex items-center justify-center space-x-4">
                  <Button variant="ghost" size="sm" className="text-white hover:text-blue-400">
                    <SkipBack className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={togglePlay} className="text-white hover:text-blue-400 text-xl">
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-white hover:text-blue-400">
                    <SkipForward className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center space-x-2 ml-4">
                    <Volume2 className="w-4 h-4 text-white" />
                    <Slider
                      value={[volume]}
                      max={100}
                      step={1}
                      className="w-16"
                      onValueChange={(value) => {
                        setVolume(value[0]);
                        if (videoRef.current) {
                          videoRef.current.volume = value[0] / 100;
                        }
                      }}
                    />
                  </div>
                  <Button 
                    onClick={() => {
                      setSelectedFile(null);
                    }}
                    variant="ghost" 
                    size="sm" 
                    className="text-white hover:text-blue-400 ml-4"
                  >
                    Default Video
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}

        {!selectedFile && !newVideoSrc && (
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center bg-gray-500/20 rounded-full">
              <Play className="w-12 h-12 text-gray-500" />
            </div>
            <p className="text-gray-400 text-lg mb-2">No video loaded</p>
            <p className="text-gray-500 text-sm mb-6">Click to select video file</p>
            <Button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Select Video
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        )}
        </div>

        {/* Agent Log Section - 20% */}
        <div className="bg-[#E4E4E7] border-l border-gray-300" style={{ width: '20%' }}>
          <div className="h-full flex flex-col">
            <div className="px-3 py-2 bg-[#E4E4E7] border-b border-gray-300">
              <h3 className="text-xs font-medium text-black">Agent Log</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2" ref={agentLogRef}>
              {agentMessages.map((message) => (
                <div key={message.id} className="bg-[#FAFAFA] rounded-lg p-2 border border-gray-300 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-black">{message.agentName}</span>
                    <span className="text-xs text-gray-600">{message.timestamp}</span>
                  </div>
                  <p className="text-xs text-black leading-relaxed">{message.message}</p>
                </div>
              ))}
              {agentMessages.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-xs text-gray-500">Agent analysis will appear here...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}