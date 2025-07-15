import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Speaker, Lightbulb, X } from "lucide-react";
import { useDemoTimer } from "@/hooks/use-demo-timer";
// Audio now served from public/media directory
const humeAudioSrc = "/media/hume-audio.wav";

interface AgentMessage {
  id: string;
  agentName: string;
  message: string;
  timestamp: string;
  type: 'analysis' | 'detection' | 'recommendation';
}

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [waveformAnimating, setWaveformAnimating] = useState(false);
  const [audioStartTriggered, setAudioStartTriggered] = useState(false);
  const [waveformAnimateTriggered, setWaveformAnimateTriggered] = useState(false);
  const [waveformStopTriggered, setWaveformStopTriggered] = useState(false);
  const [showInsight, setShowInsight] = useState(false);
  const [insightTriggered, setInsightTriggered] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  
  // Agent log state
  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([]);
  const [messageCount, setMessageCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const agentLogRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentTime: demoTime, registerEvent, isEventTriggered } = useDemoTimer();

  // Add agent message function with unique ID generation
  const addAgentMessage = (agentName: string, message: string, type: 'analysis' | 'detection' | 'recommendation') => {
    const newMessage: AgentMessage = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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

  // Register demo events
  useEffect(() => {
    registerEvent('audio-start', 1);
    registerEvent('waveform-animate', 4);
    registerEvent('audio-insight', 25);
    registerEvent('waveform-stop', 71);
  }, [registerEvent]);

  // Enhanced global audio context priming for deployed environments
  useEffect(() => {
    const primeGlobalAudioContext = async () => {
      try {
        // Enhanced deployment autoplay strategy
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }
        
        // Create multiple silent buffers to unlock audio
        for (let i = 0; i < 3; i++) {
          const buffer = audioContext.createBuffer(1, 1, 22050);
          const source = audioContext.createBufferSource();
          source.buffer = buffer;
          source.connect(audioContext.destination);
          source.start();
        }
        
        // Additional deployment-specific audio unlock
        if (audioRef.current) {
          const audio = audioRef.current;
          audio.muted = true;
          try {
            await audio.play();
            audio.pause();
            audio.currentTime = 0;
            audio.muted = false;
          } catch (e) {
            console.log('Silent play unlock failed, will use interaction fallback');
          }
        }
        
        console.log('Global audio context primed successfully');
        setUserInteracted(true);
      } catch (error) {
        console.log('Global audio context priming failed, will try on user interaction:', error);
      }
    };
    
    // Multiple priming attempts for deployed environments
    primeGlobalAudioContext();
    
    // Additional priming on document visibility change
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setTimeout(primeGlobalAudioContext, 100);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Load 911 call audio on component mount and enable autoplay
  useEffect(() => {
    if (audioRef.current && !audioLoaded) {
      audioRef.current.src = humeAudioSrc;
      audioRef.current.preload = "auto";
      audioRef.current.muted = false;
      audioRef.current.volume = 0.7;
      
      // Enhanced audio context priming for deployed environments
      const enableAudioContext = async () => {
        setUserInteracted(true);
        console.log('User interaction detected - priming audio context for deployed environment');
        
        if (audioRef.current) {
          try {
            // Create and unlock AudioContext
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            
            if (audioContext.state === 'suspended') {
              await audioContext.resume();
              console.log('AudioContext resumed successfully');
            }
            
            // Enhanced audio element priming for production
            const audio = audioRef.current;
            const originalVolume = audio.volume;
            
            // Set to minimal volume and try to play
            audio.volume = 0.01;
            audio.muted = false;
            
            try {
              // Force load the audio
              audio.load();
              await new Promise((resolve) => {
                audio.addEventListener('canplaythrough', resolve, { once: true });
              });
              
              // Attempt silent play to unlock audio
              const playPromise = audio.play();
              if (playPromise) {
                await playPromise;
                console.log('Audio successfully played for priming');
                
                // Stop and reset
                audio.pause();
                audio.currentTime = 0;
                audio.volume = originalVolume;
                
                console.log('Audio context fully primed for production autoplay');
              }
            } catch (playError) {
              console.log('Audio play priming failed, trying alternative approach:', playError);
              
              // Alternative: Create a buffer source for unlocking
              try {
                const buffer = audioContext.createBuffer(1, 1, 22050);
                const source = audioContext.createBufferSource();
                source.buffer = buffer;
                source.connect(audioContext.destination);
                source.start();
                console.log('Audio context unlocked via buffer source');
              } catch (bufferError) {
                console.log('Buffer source unlock failed:', bufferError);
              }
              
              // Reset audio element
              audio.volume = originalVolume;
            }
            
          } catch (error) {
            console.log('Audio context setup failed, but user interaction registered:', error);
          }
        }
      };
      
      // Enhanced user interaction detection for deployed environments
      const interactionEvents = ['click', 'touchstart', 'keydown', 'scroll', 'mousemove', 'mousedown', 'pointerdown', 'touchmove', 'wheel', 'gesturestart', 'focus', 'blur'];
      
      let primed = false;
      const handleInteraction = async () => {
        if (!primed) {
          primed = true;
          console.log('User interaction detected - unlocking audio for deployment');
          
          // Enhanced deployment unlock strategy
          try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            await audioContext.resume();
            
            // Multiple unlock attempts for robust deployment support
            for (let i = 0; i < 5; i++) {
              const buffer = audioContext.createBuffer(1, 1, 22050);
              const source = audioContext.createBufferSource();
              source.buffer = buffer;
              source.connect(audioContext.destination);
              source.start();
            }
            
            // Try direct audio unlock
            if (audioRef.current) {
              const audio = audioRef.current;
              const originalVolume = audio.volume;
              
              audio.muted = true;
              audio.volume = 0;
              
              try {
                await audio.play();
                audio.pause();
                audio.currentTime = 0;
                audio.muted = false;
                audio.volume = originalVolume;
                
                console.log('Audio successfully unlocked for deployment');
              } catch (e) {
                console.log('Direct audio unlock failed, context should still be unlocked');
              }
            }
            
            setUserInteracted(true);
            enableAudioContext();
          } catch (error) {
            console.log('Enhanced audio unlock failed:', error);
            enableAudioContext(); // Fallback to original method
          }
        }
      };
      
      // More aggressive event listening for deployment
      interactionEvents.forEach(event => {
        document.addEventListener(event, handleInteraction, { once: true, passive: true });
        window.addEventListener(event, handleInteraction, { once: true, passive: true });
      });
      
      // Immediate priming attempts for deployment
      if (document.hasFocus()) {
        setTimeout(handleInteraction, 50);
      }
      
      // Additional deployment strategies
      setTimeout(handleInteraction, 200);
      setTimeout(handleInteraction, 500);
      setTimeout(handleInteraction, 1000);
      
      setAudioLoaded(true);
    }
  }, [audioLoaded]);

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [audioLoaded]);



  // Handle demo timer events
  useEffect(() => {
    // Add initial agent messages when audio processing begins
    if (demoTime >= 1 && agentMessages.length === 0) {
      addAgentMessage('Audio Processing AI', 'Initializing A220 maintenance log analysis...', 'analysis');
      setTimeout(() => addAgentMessage('Voice Recognition AI', 'Processing technician communication from hangar floor', 'detection'), 2000);
      setTimeout(() => addAgentMessage('Procedure Protocol AI', 'Analyzing landing gear strut inspection timestamps', 'analysis'), 4000);
      setTimeout(() => addAgentMessage('Speech Analysis AI', 'Detecting critical maintenance alerts in technician audio', 'analysis'), 6000);
      setTimeout(() => addAgentMessage('Context AI', 'Extracting strut replacement procedure details from logs', 'analysis'), 8000);
    }

    if (isEventTriggered('audio-start') && !audioStartTriggered) {
      console.log('Demo: Audio start triggered at 1 second');
      setAudioStartTriggered(true);
      addAgentMessage('Audio Analysis AI', 'Beginning A220 maintenance log analysis', 'analysis');
      if (audioRef.current) {
        console.log('Attempting to play audio...', {
          readyState: audioRef.current.readyState,
          src: audioRef.current.src,
          paused: audioRef.current.paused
        });
        
        // Set the visual state immediately to show playing
        setIsPlaying(true);
        
        // Reset audio position
        audioRef.current.currentTime = 0;
        audioRef.current.volume = volume / 100;
        
        // Enhanced audio playback with deployment-specific strategies
        const attemptPlay = async () => {
          try {
            const audio = audioRef.current!;
            
            // Comprehensive pre-play setup for deployment
            audio.currentTime = 0;
            audio.volume = volume / 100;
            audio.muted = false;
            
            console.log('Attempting deployment audio play with enhanced unlock');
            
            // Multi-strategy deployment autoplay approach
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            
            // Strategy 1: Force resume context multiple times
            for (let i = 0; i < 3; i++) {
              if (audioContext.state === 'suspended') {
                await audioContext.resume();
                await new Promise(resolve => setTimeout(resolve, 50));
              }
            }
            
            // Strategy 2: Create multiple silent buffers for unlock
            for (let i = 0; i < 10; i++) {
              const buffer = audioContext.createBuffer(1, 1, 22050);
              const source = audioContext.createBufferSource();
              source.buffer = buffer;
              source.connect(audioContext.destination);
              source.start();
            }
            
            // Strategy 3: Pre-load and pre-play silently
            audio.muted = true;
            audio.volume = 0;
            
            try {
              await audio.play();
              audio.pause();
              audio.currentTime = 0;
            } catch (e) {
              console.log('Silent pre-play failed, continuing with normal play');
            }
            
            // Strategy 4: Restore settings and attempt real play
            audio.muted = false;
            audio.volume = volume / 100;
            audio.currentTime = 0;
            
            // Ensure audio is fully loaded
            if (audio.readyState < 3) {
              console.log('Waiting for audio to load...');
              await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => reject(new Error('Audio load timeout')), 5000);
                audio.addEventListener('canplaythrough', () => {
                  clearTimeout(timeout);
                  resolve(undefined);
                }, { once: true });
                audio.load();
              });
            }
            
            // Final play attempt with retry
            let playAttempts = 0;
            const maxAttempts = 5;
            
            while (playAttempts < maxAttempts) {
              try {
                const playPromise = audio.play();
                await playPromise;
                console.log('911 call audio started via enhanced deployment unlock');
                return true;
              } catch (playError) {
                playAttempts++;
                console.log(`Play attempt ${playAttempts} failed:`, playError);
                
                if (playAttempts < maxAttempts) {
                  await new Promise(resolve => setTimeout(resolve, 200));
                  
                  // Re-unlock context between attempts
                  if (audioContext.state === 'suspended') {
                    await audioContext.resume();
                  }
                }
              }
            }
            
            throw new Error('All play attempts failed');
            
          } catch (error) {
            console.log('All audio playback strategies failed - implementing enhanced visual fallback:', error);
            
            // Enhanced visual fallback that mimics real audio behavior
            setIsPlaying(true);
            setWaveformAnimating(true);
            
            // Create more realistic audio simulation
            let simulatedTime = 0;
            const audioDuration = 30; // Approximate duration
            const updateInterval = 100;
            
            const simulateProgress = () => {
              if (simulatedTime < audioDuration && isPlaying) {
                setCurrentTime(simulatedTime);
                simulatedTime += updateInterval / 1000;
                setTimeout(simulateProgress, updateInterval);
              } else {
                setIsPlaying(false);
                setWaveformAnimating(false);
                setCurrentTime(0);
              }
            };
            
            // Add user message about audio playback
            addAgentMessage('System Notice', 'Audio playback restricted by browser - visual analysis continues', 'analysis');
            
            simulateProgress();
            return false;
          }
        };
        
        attemptPlay();
      } else {
        console.log('Audio ref is not available');
      }
    }
    
    if (isEventTriggered('waveform-animate') && !waveformAnimateTriggered) {
      console.log('Demo: Waveform animation triggered at 54 seconds');
      setWaveformAnimateTriggered(true);
      setWaveformAnimating(true);
      addAgentMessage('Audio Visualization AI', 'Generating waveform patterns for A220 maintenance log analysis', 'analysis');
    }

    if (isEventTriggered('audio-insight') && !insightTriggered) {
      console.log('Demo: Audio insight triggered at 25 seconds');
      setInsightTriggered(true);
      setShowInsight(true);
      addAgentMessage('Mechanical Analysis AI', 'Critical alert: Landing gear strut shows excessive vibration - immediate inspection required', 'detection');
      
      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        setShowInsight(false);
      }, 5000);
    }

    if (isEventTriggered('waveform-stop') && !waveformStopTriggered) {
      console.log('Demo: Waveform stop triggered at 71 seconds');
      setWaveformStopTriggered(true);
      setWaveformAnimating(false);
      addAgentMessage('Analysis Complete AI', 'A220 maintenance log analysis complete - strut failure confirmed', 'recommendation');
    }
  }, [isEventTriggered, audioStartTriggered, waveformAnimateTriggered, insightTriggered, waveformStopTriggered]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setSelectedFile(file);
      if (audioRef.current) {
        audioRef.current.src = URL.createObjectURL(file);
        setAudioLoaded(true);
      }
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.log('Audio autoplay prevented by browser policy - this is expected behavior');
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    const volumeValue = newVolume[0];
    setVolume(volumeValue);
    if (audioRef.current) {
      audioRef.current.volume = volumeValue / 100;
    }
  };

  const handleSeek = (newTime: number[]) => {
    const timeValue = newTime[0];
    setCurrentTime(timeValue);
    if (audioRef.current) {
      audioRef.current.currentTime = timeValue;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Waveform bars for visualization
  const waveformBars = Array.from({ length: 15 }, (_, i) => (
    <div
      key={i}
      className={`w-1 transition-all duration-200 ${waveformAnimating ? 'waveform-bar' : ''}`}
      style={{
        backgroundColor: '#E37DE1',
        height: waveformAnimating ? `${Math.random() * 60 + 40}%` : '20%',
        animationDelay: waveformAnimating ? `${i * 0.1}s` : '0s'
      }}
    />
  ));

  return (
    <div className="bg-[hsl(220,20%,18%)] h-full flex flex-col">
      {/* Header */}
      <div className="h-12 bg-white flex items-center justify-between px-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <Volume2 className="w-5 h-5 text-black" />
          <span className="text-black font-medium">Audio</span>
        </div>
        <div className="flex items-center space-x-2">
        </div>
      </div>

      {/* Content - Split into Audio (80%) and Agent Log (20%) */}
      <div className="flex-1 flex min-h-0">
        {/* Audio Section - 80% */}
        <div className="flex-1 relative flex flex-col items-center justify-center p-6" style={{ width: '80%' }}>
          <audio
            ref={audioRef}
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onEnded={() => setIsPlaying(false)}
          />

        {audioLoaded ? (
          <>
            {/* Waveform Visualization */}
            <div className="w-full max-w-md mb-6">
              <div className="flex items-end justify-center space-x-1 h-16">
                {waveformBars}
              </div>
            </div>

            {/* Track Info */}
            <div className="text-center mb-6">
              <h3 className="text-white text-lg font-semibold mb-1">Airbus Maintenance Tech Audio Capture</h3>
              <p className="text-gray-400 text-sm">Landing Gear Strut Inspection - N2204A</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-md mb-6">
              <div className="flex items-center justify-between mb-2 text-sm text-gray-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <Slider
                value={[currentTime]}
                max={duration}
                step={1}
                className="[&_[role=slider]]:bg-[#E37DE1] [&_[data-orientation=horizontal]]:bg-[#E37DE1]"
                onValueChange={handleSeek}
              />
            </div>

            {/* Audio Controls */}
            <div className="flex items-center justify-center space-x-6">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <SkipBack className="w-5 h-5" />
              </Button>
              <Button 
                onClick={togglePlay}
                className="text-white w-12 h-12 rounded-full"
                style={{ backgroundColor: '#E37DE1' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#C965C8'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E37DE1'}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <SkipForward className="w-5 h-5" />
              </Button>
            </div>


          </>
        ) : (
          <>
            {/* Demo Waveform */}
            <div className="w-full max-w-md mb-6">
              <div className="flex items-end justify-center space-x-1 h-16">
                {waveformBars}
              </div>
            </div>

            {/* Demo Track Info */}
            <div className="text-center mb-6">
              <h3 className="text-white text-lg font-semibold mb-1">Airbus Maintenance Tech Audio Capture</h3>
              <p className="text-gray-400 text-sm">Landing Gear Strut Inspection - N2204A</p>
            </div>

            {/* Demo Progress Bar */}
            <div className="w-full max-w-md mb-6">
              <div className="flex items-center justify-between mb-2 text-sm text-gray-400">
                <span>1:23</span>
                <span>3:45</span>
              </div>
              <div className="bg-gray-600 h-1 rounded-full">
                <div className="bg-green-400 h-1 rounded-full w-[37%]"></div>
              </div>
            </div>

            {/* Demo Controls */}
            <div className="flex items-center justify-center space-x-6">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <SkipBack className="w-5 h-5" />
              </Button>
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-green-500 hover:bg-green-600 text-white w-12 h-12 rounded-full"
              >
                <Play className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <SkipForward className="w-5 h-5" />
              </Button>
            </div>

            {/* Demo Volume Control */}
            <div className="flex items-center space-x-2 mt-4">
              <VolumeX className="w-4 h-4 text-gray-400" />
              <div className="bg-gray-600 h-1 w-20 rounded-full">
                <div className="bg-green-400 h-1 rounded-full w-[70%]"></div>
              </div>
              <Volume2 className="w-4 h-4 text-gray-400" />
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </>
        )}
        
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
                        Maintenance technician reports abnormal vibration during A220 strut inspection. Audio analysis confirms critical frequency patterns indicating imminent component failure.
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
