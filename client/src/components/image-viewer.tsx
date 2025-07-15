import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Globe, ZoomIn, ZoomOut, RotateCw, Download, Play, Lightbulb, X } from "lucide-react";
import { useDemoTimer } from '../hooks/use-demo-timer';
// Video now served from public/media directory
const gmtVideoSrc = "/media/demo-video.mp4";

interface AgentMessage {
  id: string;
  agentName: string;
  message: string;
  timestamp: string;
  type: 'analysis' | 'detection' | 'recommendation';
}

interface WebBrowserProps {
  shouldStartVideo?: boolean;
}

export default function WebBrowser({ shouldStartVideo = false }: WebBrowserProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showVideo, setShowVideo] = useState(true); // Show video from start
  const [shouldPlayVideo, setShouldPlayVideo] = useState(false); // Control when to play
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [showInsight, setShowInsight] = useState(false);
  const [insightTriggered, setInsightTriggered] = useState(false);
  const [secondInsightTriggered, setSecondInsightTriggered] = useState(false);
  const [thirdInsightTriggered, setThirdInsightTriggered] = useState(false);
  const [videoInfo] = useState({
    resolution: "1920 x 1080",
    size: "2.4 MB",
    format: "MP4"
  });

  // Agent messages state
  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([]);
  const agentLogRef = useRef<HTMLDivElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const { currentTime, isEventTriggered } = useDemoTimer();

  // Add agent message function
  const addAgentMessage = (agentName: string, message: string, type: 'analysis' | 'detection' | 'recommendation') => {
    const newMessage: AgentMessage = {
      id: `web-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      agentName,
      message,
      timestamp: new Date().toLocaleTimeString(),
      type
    };
    
    setAgentMessages(prev => [...prev, newMessage]);
    
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

  // Load video file on component mount
  useEffect(() => {
    if (videoRef.current) {
      // Set the specific video file
      videoRef.current.src = gmtVideoSrc;
      videoRef.current.load();
      console.log('Video source set');
    }
  }, []);

  // Add initial agent messages when browser processing begins
  useEffect(() => {
    if (currentTime >= 1 && agentMessages.length === 0) {
      addAgentMessage('Regulatory Search AI', 'Searching FAA Part 145 maintenance regulations for A220 compliance...', 'analysis');
      setTimeout(() => addAgentMessage('Aviation Standards AI', 'Accessing FAA Advisory Circular AC 43-13-1B maintenance standards', 'analysis'), 2000);
      setTimeout(() => addAgentMessage('Certification AI', 'Reviewing EASA Type Certificate A.110 for A220 maintenance requirements', 'detection'), 4000);
      setTimeout(() => addAgentMessage('Compliance Monitor AI', 'Cross-referencing 14 CFR 25.729 landing gear airworthiness standards', 'analysis'), 6000);
      setTimeout(() => addAgentMessage('Regulatory Database AI', 'Accessing Transport Canada maintenance directive database', 'analysis'), 8000);
    }
  }, [currentTime, agentMessages.length]);

  // Handle video play trigger at 10 seconds
  useEffect(() => {
    if (isEventTriggered('second-video-start') && videoRef.current && !shouldPlayVideo) {
      console.log('Demo: Second video triggered at 10 seconds - signaling Web Browser');
      setShouldPlayVideo(true);
      
      // Try to play the video immediately
      if (videoRef.current) {
        videoRef.current.currentTime = 0; // Start from beginning
        videoRef.current.play().then(() => {
          console.log('Web Browser video started playing successfully');
        }).catch((error) => {
          console.log('Video autoplay prevented by browser policy - this is expected behavior');
          // Force play after user interaction
          const tryPlayAfterInteraction = () => {
            if (videoRef.current) {
              videoRef.current.play();
              document.removeEventListener('click', tryPlayAfterInteraction);
            }
          };
          document.addEventListener('click', tryPlayAfterInteraction);
        });
      }
      
      addAgentMessage('Regulatory Validation AI', 'Accessing FAA maintenance regulation database for compliance verification', 'analysis');
    }
  }, [isEventTriggered, shouldPlayVideo]);

  // Handle first insight trigger at 16 seconds
  useEffect(() => {
    if (isEventTriggered('first-insight') && !insightTriggered) {
      console.log('Demo: First insight triggered at 16 seconds');
      setInsightTriggered(true);
      addAgentMessage('Regulatory Search AI', 'Found FAA AD 2025-12-04 applicable to A220 landing gear systems', 'detection');
      
      // Add regulatory documentation access message
      setTimeout(() => {
        addAgentMessage('Compliance Extraction AI', 'Extracting mandatory compliance actions from airworthiness directive', 'analysis');
      }, 2000);
      
      setTimeout(() => {
        addAgentMessage('Regulatory Validation AI', 'Confirmed: Immediate grounding required per 14 CFR 39.3', 'recommendation');
      }, 4000);
    }
  }, [isEventTriggered, insightTriggered]);

  // Handle third insight trigger at 34 seconds
  useEffect(() => {
    if (isEventTriggered('third-insight') && !thirdInsightTriggered) {
      console.log('Demo: Third insight triggered at 37 seconds');
      setThirdInsightTriggered(true);
      addAgentMessage('Aviation Compliance AI', 'Referenced FAR 25.1309 for equipment failure response procedures', 'recommendation');
    }
  }, [isEventTriggered, thirdInsightTriggered]);

  // Set up video event listeners separately to avoid re-triggering
  useEffect(() => {
    if (showVideo && videoRef.current) {
      const video = videoRef.current;
      
      // Set up event listener to start at the beginning
      const handleLoadedData = () => {
        video.currentTime = 0; // Start at the beginning
        console.log('Video loaded, starting from beginning');
      };

      // No longer need video time update listener - using centralized demo timer

      // Set up event listener for when video starts playing
      const handlePlay = () => {
        console.log('Video started playing');
        if (insightTriggered) {
          setInsightTriggered(false); // Reset insight trigger for replay
        }
      };
      
      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('play', handlePlay);
      
      // Cleanup
      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('play', handlePlay);
      };
    }
  }, [showVideo]);

  // Monitor demo timer for second insight event
  useEffect(() => {
    if (isEventTriggered('second-insight') && !secondInsightTriggered) {
      console.log('Demo: Second insight triggered at 10 seconds from app start');
      setShowInsight(true);
      setSecondInsightTriggered(true);
      addAgentMessage('Regulatory Compliance AI', 'FAA AD 2025-12-04 requires immediate A220 landing gear inspection per 14 CFR 39.3', 'detection');
      
      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        setShowInsight(false);
      }, 5000);
    }
  }, [isEventTriggered, secondInsightTriggered]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
      setShowVideo(true);
    }
  };

  return (
    <div className="bg-[hsl(220,20%,18%)] h-full flex flex-col">
      {/* Header */}
      <div className="h-12 bg-white flex items-center justify-between px-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <Globe className="w-5 h-5 text-black" />
          <span className="text-black font-medium">Web</span>
        </div>
        <div className="flex items-center space-x-2">
        </div>
      </div>

      {/* Content - Split into Video (80%) and Agent Log (20%) */}
      <div className="flex-1 flex min-h-0">
        {/* Video Section - 80% */}
        <div className="flex-1 relative" style={{ width: '80%' }}>
          {/* Video Content */}
          <div className="h-full">
            {showVideo ? (
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  controls
                  muted
                  loop={false}
                >
                  Your browser does not support the video tag.
                </video>

                {/* Insight Popup - AI Speech Bubble */}
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
                                FAA Airworthiness Directive 2025-12-04 mandates immediate inspection of A220 landing gear struts. Compliance required within 24 hours per 14 CFR 39.3.
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
              </div>
            ) : (
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center bg-purple-500/20 rounded-full">
                  <Play className="w-12 h-12 text-purple-400" />
                </div>
                <p className="text-gray-400 text-lg mb-2">Web Browser</p>
                <p className="text-gray-500 text-sm mb-6">Ready for video content</p>
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-purple-500 hover:bg-purple-600 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Upload Video
                </Button>
              </div>
            )}
          </div>
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

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}