import { useState, useEffect } from "react";
import VideoPlayer from "@/components/video-player";
import AudioPlayer from "@/components/audio-player";
import DocumentViewer from "@/components/document-viewer";
import WebBrowser from "@/components/image-viewer";
import ProgressBar from "@/components/progress-bar";
import { Button } from "@/components/ui/button";
import { Check, X, Pause, Play, Settings, AlertTriangle } from "lucide-react";
import { useDemoTimer } from "@/hooks/use-demo-timer";
// Logo now served from public/media directory
const logoPath = "/media/logo.png";

export default function AgenticEngine() {
  const [videoProgress, setVideoProgress] = useState(10);
  const [firstVideoEnded, setFirstVideoEnded] = useState(false);
  const [showMaintenancePopup, setShowMaintenancePopup] = useState(false);
  const [maintenancePopupTriggered, setMaintenancePopupTriggered] = useState(false);
  const [showRejectionReason, setShowRejectionReason] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [audioContextPrimed, setAudioContextPrimed] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ id: string, agent: string, message: string, timestamp: string }>>([]);
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);
  const [maintenanceDecisionText, setMaintenanceDecisionText] = useState({
    summary: "Analysis in progress...",
    determination: "Agents are reviewing sensor data and determining maintenance requirements...",
    outcome: "Awaiting consensus from AI agents..."
  });

  const { registerEvent, isEventTriggered, resetTimer, pauseTimer, resumeTimer, isPaused } = useDemoTimer();

  // Reset demo timer when dashboard loads to ensure fresh start
  useEffect(() => {
    resetTimer();
  }, [resetTimer]);

  const handlePauseResume = () => {
    if (isPaused) {
      resumeTimer();
    } else {
      pauseTimer();
    }
  };

  // Global audio context enabler - runs on first user interaction
  useEffect(() => {
    if (!audioContextPrimed) {
      const primeAudioGlobally = async () => {
        try {
          // Create and resume AudioContext
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          if (audioContext.state === 'suspended') {
            await audioContext.resume();
          }

          // Find and prime any audio elements
          const audioElements = Array.from(document.querySelectorAll('audio'));
          for (const audio of audioElements) {
            if (audio.src) {
              try {
                const originalVolume = audio.volume;
                audio.volume = 0;
                await audio.play();
                audio.pause();
                audio.currentTime = 0;
                audio.volume = originalVolume;
              } catch (e) {
                // Silent fail
              }
            }
          }

          setAudioContextPrimed(true);
          console.log('Global audio context primed successfully');
        } catch (error) {
          console.log('Global audio priming failed:', error);
        }
      };

      const handleFirstInteraction = () => {
        primeAudioGlobally();
        // Remove listeners after first use
        ['click', 'touchstart', 'keydown', 'scroll'].forEach(event => {
          document.removeEventListener(event, handleFirstInteraction);
        });
      };

      // Listen for first user interaction
      ['click', 'touchstart', 'keydown', 'scroll'].forEach(event => {
        document.addEventListener(event, handleFirstInteraction, { once: true, passive: true });
      });
    }
  }, [audioContextPrimed]);

  // Register maintenance popup event
  useEffect(() => {
    registerEvent('maintenance-popup', 30);
  }, [registerEvent]);

  // Handle maintenance popup trigger
  useEffect(() => {
    if (isEventTriggered('maintenance-popup') && !maintenancePopupTriggered) {
      console.log('Demo: Maintenance popup triggered at 30 seconds');
      setMaintenancePopupTriggered(true);
      setShowMaintenancePopup(true);

      // Start AI agent chat sequence
      startAIChatSequence();
    }
  }, [isEventTriggered, maintenancePopupTriggered]);

  // Agent color mapping function
  const getAgentColor = (agentName: string) => {
    // All agents now use #F4F4F5 background with black text
    return { bg: "bg-[#F4F4F5]", text: "text-black", border: "border-gray-200", tail: "border-t-[#F4F4F5]" };
  };

  // AI Chat sequence function
  const startAIChatSequence = () => {
    const messages = [
      { agent: "Maintenance Decision Agent", message: "Beginning analysis. Note that in Case #LG20250710 last week, we discovered hidden structural stress patterns in video analysis that completely altered our initial assessment. Let's ensure we examine all evidence thoroughly here.", section: "summary" },
      { agent: "Structural Analysis Agent", message: "Initial assessment shows 4.5 cm crack in landing gear strut with 94% confidence. Visual segmentation detected consistent anomaly on frame 45. This requires immediate grounding per Boeing Manual Section 05-10.", section: "summary" },
      { agent: "Sensor Monitoring Agent", message: "Actually, hydraulic system data shows pressure deviations and wrench torque anomalies (60 dB) during installation. This indicates compromised structural integrity beyond just the visible crack.", section: "findings" },
      { agent: "Predictive Analysis Agent", message: "There is historical context that changes this outcome. Previous temporary repair on this strut 8 months ago combined with recent severe weather exposure suggests accelerated material fatigue patterns.", section: "findings" },
      { agent: "Audio Analysis Agent", message: "I've analyzed the maintenance audio transcript. The technician's procedural compliance for fuel filter replacement demonstrates proper maintenance protocols, but doesn't address the structural concerns identified in the landing gear.", section: "determination" },
      { agent: "Regulatory Compliance Agent", message: "Based on my review of Boeing Structural Repair Manual (SRM) and maintenance regulations, cracks above 2 cm mandate immediate replacement with no exceptions for temporary repairs. Aircraft must remain grounded until strut replacement is completed.", section: "determination" },
      { agent: "Maintenance Decision Agent", message: "After reviewing all perspectives, immediate grounding is required. The 4.5 cm crack exceeds safety thresholds, historical data shows accelerated fatigue, and SRM explicitly prohibits temporary repairs.", section: "determination" },
      { agent: "Risk Assessment Agent", message: "Agreed. The structural integrity compromise combined with operational history presents unacceptable risk. Estimated 8-hour downtime for strut replacement is justified for safety.", section: "outcome" },
      { agent: "Predictive Analysis Agent", message: "Agreed. This decision aligns with Boeing safety protocols and predictive maintenance best practices. Work order #LG20250711 should be processed immediately with high priority status.", section: "outcome" },
      { agent: "Maintenance Decision Agent", message: "Consensus reached. Aircraft 737 grounded immediately. Work order #LG20250711 generated for landing gear strut replacement. Engineering oversight team notified via Expert Marketplace.", section: "outcome", final: true }
    ];

    setChatMessages([]);
    setHighlightedSection(null);
    let lastHighlightedSection: string | null = null;

    messages.forEach((msg, index) => {
      setTimeout(() => {
        const timestamp = new Date().toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });

        setChatMessages(prev => {
          const newMessages = [...prev, {
            id: `msg-${index}`,
            agent: msg.agent,
            message: msg.message,
            timestamp
          }];

          // Auto-scroll chat to bottom after message is added
          setTimeout(() => {
            const chatContainer = document.querySelector('[data-chat-container="true"]');
            if (chatContainer) {
              chatContainer.scrollTop = chatContainer.scrollHeight;
            }
          }, 50);

          return newMessages;
        });

        // Update maintenance decision text based on agent progress
        if (index === 4) { // After Audio Analysis Agent reviews maintenance transcript
          setMaintenanceDecisionText({
            summary: "Following a full investigation of the 737 landing gear structural integrity, a 4.5 cm crack has been identified in the strut with 94% confidence through visual and audio analysis.",
            determination: "Structural crack exceeds 2 cm safety threshold per Boeing Manual Section 05-10. Historical data shows previous repair 8 months ago with accelerated fatigue patterns from severe weather exposure.",
            outcome: "Maintenance decision in progress - AI agents are reaching consensus on grounding requirements..."
          });
        }

        if (msg.final) { // Final consensus reached
          setMaintenanceDecisionText({
            summary: "Following a full investigation of the 737 landing gear structural integrity at CDG Airport, the AI agents have reached consensus on maintenance requirements.",
            determination: "Aircraft must be grounded immediately due to 4.5 cm structural crack exceeding safety thresholds. Boeing SRM mandates immediate replacement with no exceptions for temporary repairs.",
            outcome: "Based on comprehensive AI analysis and agent consensus, work order #LG20250711 has been generated for immediate landing gear strut replacement with 8-hour estimated downtime."
          });
        }

        // Only update highlighting if section is different from previous
        if (msg.section !== lastHighlightedSection) {
          setHighlightedSection(msg.section);
          lastHighlightedSection = msg.section;

          // Auto-scroll to highlighted section
          setTimeout(() => {
            let sectionElement = document.querySelector(`[data-section="${msg.section}"]`);
            // If not found, try alternative data attribute for sections that share highlighting
            if (!sectionElement) {
              sectionElement = document.querySelector(`[data-section-alt="${msg.section}"]`);
            }
            if (sectionElement) {
              sectionElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest'
              });
            }
          }, 100);

          // Clear highlight after 4 seconds (extended for better visibility)
          setTimeout(() => {
            if (lastHighlightedSection === msg.section) {
              setHighlightedSection(null);
              lastHighlightedSection = null;
            }
          }, 4000);
        }
      }, (index + 1) * 2000); // 2 second intervals
    });
  };

  const handleApprove = () => {
    setShowMaintenancePopup(false);
    // Trigger final progress update to 100% when user approves
    setVideoProgress(100);
    console.log('Demo: Maintenance approved - progress set to 100%');
  };
  return (
    <div className="h-screen bg-[hsl(220,26%,14%)] text-white flex flex-col overflow-hidden">
      {/* Header Navigation - 8vh */}
      <nav className="bg-white h-16 flex items-center justify-between px-6 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center">
          <img
            src={logoPath}
            alt="Invisible Logo"
            className="h-5 w-auto"
          />
        </div>

        <div className="flex items-center gap-4">
          {/* Pause/Resume Button */}
          <Button
            onClick={handlePauseResume}
            variant="outline"
            size="sm"
            className="bg-white border-gray-300 hover:bg-gray-50 text-gray-700 w-10 h-10 p-0 rounded-lg"
          >
            {isPaused ? (
              <Play className="w-4 h-4" />
            ) : (
              <Pause className="w-4 h-4" />
            )}
          </Button>

          {/* Axon Logo in Nav Bar */}
          <div className="relative">
            {/* Dotted circle pattern background - larger for more visibility */}
            <div className="w-16 h-16 relative">
              <div className="axon-dots-pattern-nav"></div>
            </div>

            {/* Central text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-base font-bold text-gray-800 tracking-wide">Axon</div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Grid Container - 84vh */}
      <div className="flex-1 grid grid-cols-2 grid-rows-2 min-h-0 relative">
        {/* Top Left: Video Player */}
        <div>
          <VideoPlayer onProgressChange={setVideoProgress} onVideoEnd={() => setFirstVideoEnded(true)} />
        </div>

        {/* Top Right: Audio Player */}
        <div>
          <AudioPlayer />
        </div>

        {/* Bottom Left: Document Viewer */}
        <div>
          <DocumentViewer />
        </div>

        {/* Bottom Right: Web Browser */}
        <div>
          <WebBrowser shouldStartVideo={firstVideoEnded} />
        </div>



        {/* Maintenance Decision Popup */}
        {showMaintenancePopup && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] pointer-events-auto">
            <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full mx-4 max-h-[90vh] flex overflow-hidden">

              {/* Left Side - Claim Decision */}
              <div className="flex-1 p-8 overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Maintenance Decision</h2>

                <div className="space-y-6 text-sm text-gray-700">
                  {/* Aircraft Details */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div><strong>Alert Reference:</strong> AIR-787-7825</div>
                      <div><strong>Date of Detection:</strong> July 14, 2025</div>
                      <div className="col-span-2"><strong>Location:</strong> CDG Airport, Paris, France</div>
                    </div>
                  </div>

                  {/* Aircraft Information */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Aircraft Information:</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Aircraft: Boeing 787-9 (Registration: F-HZGK)</li>
                      <li>Component: Landing gear strut with 4.5 cm structural crack</li>
                      <li>Detection: Visual and audio analysis with 94% confidence</li>
                    </ul>
                  </div>

                  {/* Summary of Findings */}
                  <div
                    data-section="summary"
                    data-section-alt="findings"
                    className={`transition-all duration-500 ${highlightedSection === 'summary' || highlightedSection === 'findings' ? 'bg-blue-100 p-4 rounded-lg border-l-4 border-blue-500' : ''}`}
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">Summary of Findings:</h3>
                    <p className="mb-3 text-gray-700 leading-relaxed">{maintenanceDecisionText.summary}</p>
                    {maintenanceDecisionText.summary !== "Analysis in progress..." && (
                      <ul className="list-disc list-inside space-y-2 ml-4 text-sm text-gray-600">
                        <li>Structural crack of 4.5 cm identified in landing gear strut through pixel-level segmentation analysis with 95% accuracy validated against Boeing-specific training data.</li>
                        <li>Audio analysis detected mechanical anomaly (60 dB) matching hydraulic wrench torque deviations, indicating compromised installation typical of structural integrity issues.</li>
                        <li>Historical maintenance records show previous temporary repair on this strut 8 months ago, combined with recent severe weather exposure suggesting accelerated material fatigue patterns.</li>
                      </ul>
                    )}
                  </div>

                  {/* Determination */}
                  <div
                    data-section="determination"
                    className={`transition-all duration-500 ${highlightedSection === 'determination' ? 'bg-blue-100 p-4 rounded-lg border-l-4 border-blue-500' : ''}`}
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">Maintenance Determination:</h3>
                    <p className="text-gray-700 leading-relaxed">{maintenanceDecisionText.determination}</p>
                  </div>

                  {/* Claim Outcome */}
                  <div
                    data-section="outcome"
                    className={`bg-blue-50 p-4 rounded-lg transition-all duration-500 ${highlightedSection === 'outcome' ? 'bg-blue-200 border-l-4 border-blue-600' : ''}`}
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">Maintenance Outcome:</h3>
                    <p className="mb-3 text-gray-700 leading-relaxed">{maintenanceDecisionText.outcome}</p>
                    {maintenanceDecisionText.outcome !== "Awaiting consensus from AI agents..." && maintenanceDecisionText.outcome.includes("work order") && (
                      <ul className="list-disc list-inside space-y-1 ml-4 mb-3 text-sm text-gray-600">
                        <li>Aircraft 737 must be grounded immediately due to structural crack exceeding 2 cm safety threshold per Boeing Manual Section 05-10.</li>
                        <li>Work order #LG20250711 generated for landing gear strut replacement with 8-hour estimated downtime and no temporary repair exceptions.</li>
                      </ul>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 justify-center mt-8">
                  <Button
                    onClick={handleApprove}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 flex items-center gap-2 text-lg"
                  >
                    <Check className="w-5 h-5" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => setShowRejectionReason(true)}
                    variant="outline"
                    className="border-red-600 text-red-600 hover:bg-red-50 px-8 py-3 flex items-center gap-2 text-lg"
                  >
                    <X className="w-5 h-5" />
                    Reject
                  </Button>
                </div>

                {/* Rejection Reason Section */}
                {showRejectionReason && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-3">Rejection Reason</h4>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Please explain why you are rejecting this maintenance decision..."
                      className="w-full h-24 p-3 border border-red-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-black placeholder-gray-500"
                    />
                    <p className="text-sm text-red-600 mt-2 mb-4">
                      Your feedback will be incorporated into future analysis to improve decision accuracy.
                    </p>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => {
                          // Handle submission
                          setShowMaintenancePopup(false);
                          setShowRejectionReason(false);
                          setRejectionReason('');
                          console.log('Demo: Maintenance rejected with reason:', rejectionReason);
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2"
                      >
                        Submit Rejection
                      </Button>
                      <Button
                        onClick={() => {
                          setShowRejectionReason(false);
                          setRejectionReason('');
                        }}
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Side - AI Agent Chat */}
              <div className="w-96 bg-[#FAFAFA] border-l border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200 bg-white">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    AI Agent Discussion
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">Real-time maintenance analysis</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4" data-chat-container="true">
                  {chatMessages.map((msg, index) => {
                    // Alternate between left and right alignment for different agents
                    const isOddIndex = index % 2 === 1;
                    const isEvenIndex = index % 2 === 0;
                    const agentColors = getAgentColor(msg.agent);

                    return (
                      <div key={msg.id} className={`flex ${isOddIndex ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] ${isOddIndex ? 'order-2' : 'order-1'}`}>
                          {/* Agent name */}
                          <div className={`text-xs text-gray-500 mb-1 ${isOddIndex ? 'text-right' : 'text-left'}`}>
                            {msg.agent}
                          </div>

                          {/* Speech bubble */}
                          <div className={`relative p-3 rounded-2xl shadow-sm ${agentColors.bg} ${agentColors.text} ${isOddIndex
                            ? 'rounded-br-md'
                            : 'rounded-bl-md'
                            } ${agentColors.border ? agentColors.border : ''} ${agentColors.border ? 'border' : ''}`}>
                            {/* Speech bubble tail */}
                            {isOddIndex ? (
                              <div className={`absolute bottom-0 right-0 w-0 h-0 border-t-[12px] ${agentColors.tail} border-l-[12px] border-l-transparent translate-x-1 translate-y-2`}></div>
                            ) : (
                              <div className={`absolute bottom-0 left-0 w-0 h-0 border-t-[12px] ${agentColors.tail} border-r-[12px] border-r-transparent -translate-x-1 translate-y-2`}></div>
                            )}

                            <p className="text-sm leading-relaxed">{msg.message}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {chatMessages.length === 0 && (
                    <div className="text-center text-gray-500 text-sm mt-8">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      Initializing AI agents...
                    </div>
                  )}
                </div>


              </div>
            </div>
          </div>
        )}
      </div>


    </div>
  );
}
