import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileText, ZoomIn, ZoomOut, Search, Download, ChevronLeft, ChevronRight, Lightbulb, X } from "lucide-react";
import { useDemoTimer } from "@/hooks/use-demo-timer";

interface AgentMessage {
  id: string;
  agentName: string;
  message: string;
  timestamp: string;
  type: 'analysis' | 'detection' | 'recommendation';
}

export default function DocumentViewer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(3);
  const [isAutoFlipping, setIsAutoFlipping] = useState(false);
  const [showFinalInsight, setShowFinalInsight] = useState(false);
  const [finalInsightTriggered, setFinalInsightTriggered] = useState(false);

  // Agent log state
  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([]);
  const [messageCount, setMessageCount] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const agentLogRef = useRef<HTMLDivElement>(null);
  const { currentTime: demoTime, registerEvent, isEventTriggered } = useDemoTimer();

  // Add agent message function
  const addAgentMessage = (agentName: string, message: string, type: 'analysis' | 'detection' | 'recommendation' = 'analysis') => {
    const newMessage: AgentMessage = {
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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

  // Register events
  useEffect(() => {
    registerEvent('page-flip-start', 2);
    registerEvent('final-insight', 20);
  }, [registerEvent]);

  // Add initial agent messages when document processing begins
  useEffect(() => {
    if (demoTime >= 1 && agentMessages.length === 0) {
      addAgentMessage('Document Processing AI', 'Starting 737 maintenance manual analysis...', 'analysis');
      setTimeout(() => addAgentMessage('OCR Analysis AI', 'Extracting technical specifications and procedures', 'analysis'), 2000);
      setTimeout(() => addAgentMessage('Technical Document AI', 'Analyzing landing gear strut replacement protocols', 'analysis'), 4000);
      setTimeout(() => addAgentMessage('Compliance AI', 'Verifying Boeing maintenance standards compliance', 'analysis'), 6000);
      setTimeout(() => addAgentMessage('Safety Protocol AI', 'Checking regulatory compliance and safety procedures', 'analysis'), 8000);
    }
  }, [demoTime, agentMessages.length]);

  // Handle final insight trigger
  useEffect(() => {
    if (isEventTriggered('final-insight') && !finalInsightTriggered) {
      console.log('Demo: Final insight triggered at 20 seconds');
      setShowFinalInsight(true);
      setFinalInsightTriggered(true);
      addAgentMessage('Technical Assessment AI', 'Identified critical component failure indicators', 'detection');

      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        setShowFinalInsight(false);
      }, 5000);
    }
  }, [isEventTriggered, finalInsightTriggered]);

  // Handle automatic page flipping with scrolling
  useEffect(() => {
    const handlePageFlip = () => {
      console.log('Document Viewer: Starting automatic page flip with scrolling');
      setIsAutoFlipping(true);

      // Start from page 1, then flip through all pages
      setCurrentPage(1);

      let currentPageIndex = 1;

      const performPageSequence = () => {
        if (currentPageIndex > totalPages) {
          setIsAutoFlipping(false);
          console.log('Document Viewer: Page flip sequence completed');
          return;
        }

        console.log(`Document Viewer: Starting page ${currentPageIndex} sequence`);
        setCurrentPage(currentPageIndex);

        // Scroll through the current page
        const documentContent = document.querySelector('[data-document-content="true"]');
        if (documentContent) {
          // Scroll to top first
          documentContent.scrollTo({ top: 0, behavior: 'smooth' });

          // Wait a moment, then scroll to bottom
          setTimeout(() => {
            const maxScroll = documentContent.scrollHeight - documentContent.clientHeight;
            if (maxScroll > 0) {
              documentContent.scrollTo({ top: maxScroll, behavior: 'smooth' });
              console.log(`Document Viewer: Scrolling through page ${currentPageIndex}`);
            }

            // Wait for scroll to complete, then move to next page
            setTimeout(() => {
              currentPageIndex++;
              performPageSequence();
            }, 2000); // Wait 2 seconds after scrolling
          }, 1000); // Wait 1 second before scrolling
        } else {
          // If no scrollable content, just wait and move to next page
          setTimeout(() => {
            currentPageIndex++;
            performPageSequence();
          }, 2500);
        }
      };

      performPageSequence();
    };

    window.addEventListener('startPageFlip', handlePageFlip);

    return () => {
      window.removeEventListener('startPageFlip', handlePageFlip);
    };
  }, [totalPages]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    }
  };

  const handleZoomIn = () => setZoom(Math.min(zoom + 25, 200));
  const handleZoomOut = () => setZoom(Math.max(zoom - 25, 50));

  const nextPage = () => setCurrentPage(Math.min(currentPage + 1, totalPages));
  const prevPage = () => setCurrentPage(Math.max(currentPage - 1, 1));

  const renderPageContent = () => {
    switch (currentPage) {
      case 1:
        return (
          <div className="text-gray-800 text-sm leading-tight space-y-3">
            <div className="border-b pb-2 mb-4">
              <h3 className="font-bold text-base">AIRBUS 737 MAINTENANCE ALERT</h3>
              <p className="text-xs text-gray-600">SECTION I - AIRCRAFT IDENTIFICATION</p>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <div><strong>AIRCRAFT REGISTRATION:</strong> N2204A</div>
              <div><strong>ALERT DATE:</strong> 07/14/2025</div>
              <div><strong>OPERATOR:</strong> Delta Air Lines</div>
              <div><strong>AIRCRAFT SERIAL NUMBER:</strong> 55044</div>
              <div><strong>EST. MAINTENANCE COST:</strong> $47,500</div>
              <div><strong>AIRCRAFT YEAR:</strong> 2019</div>
              <div><strong>MANUFACTURER:</strong> Boeing</div>
              <div><strong>MODEL:</strong> 737-100</div>
            </div>

            <div className="border-t pt-3 mt-4">
              <h4 className="font-bold text-sm mb-2">SECTION II - COMPONENT DETAILS</h4>
              <div className="text-xs space-y-1">
                <div><strong>COMPONENT NAME:</strong> Main Landing Gear Strut</div>
                <div><strong>PART NUMBER:</strong> 737-32-1004-001</div>
                <div><strong>LOCATION:</strong> Left Main Landing Gear Bay</div>
                <div><strong>COMPONENT STATUS:</strong> Critical failure detected; immediate replacement required</div>
              </div>
            </div>

            <div className="border-t pt-3 mt-4">
              <h4 className="font-bold text-sm mb-2">SECTION III - PREDICTIVE ANALYSIS</h4>
              <div className="text-xs space-y-1">
                <div><strong>AI MODEL:</strong> Skywise Predictive Maintenance v4.2</div>
                <div><strong>CONFIDENCE SCORE:</strong> 94.7%</div>
                <div><strong>DETECTION METHOD:</strong> Vibration Analysis + Visual Inspection</div>
                <div><strong>PREDICTED FAILURE TIME:</strong> 12-18 hours of operation</div>
                <div><strong>RISK LEVEL:</strong> CRITICAL - Immediate grounding required</div>
              </div>
            </div>

            <div className="border-t pt-3 mt-4 text-xs">
              <div><strong>MAINTENANCE RECOMMENDATION:</strong></div>
              <p className="mt-1">Aircraft must be grounded immediately for landing gear strut replacement. Do not operate until component is replaced and inspected.</p>
            </div>

            <div className="absolute bottom-2 right-2 text-xs text-gray-500">
              AIRBUS MAINTENANCE ALERT AMM 32-31-00 PAGE 1
            </div>
          </div>
        );

      case 2:
        return (
          <div className="text-gray-800 text-sm leading-tight space-y-3">
            <div className="border-b pb-2 mb-4">
              <h4 className="font-bold text-sm">SECTION IV - SENSOR DATA AND DETECTION</h4>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <div><strong>DETECTION DATE:</strong> 07/14/2025</div>
              <div><strong>DETECTION TIME:</strong> 14:23 UTC</div>
              <div><strong>AIRCRAFT LOCATION:</strong> Gate A12, Atlanta Hartsfield-Jackson International Airport</div>
            </div>

            <div className="border-t pt-3 mt-4">
              <h4 className="font-bold text-sm mb-2">SENSOR READINGS</h4>
              <div className="bg-gray-100 p-4 rounded border">
                <div className="text-xs text-center mb-2">Landing Gear Strut Monitoring</div>
                <div className="grid grid-cols-3 gap-1 text-xs">
                  <div className="bg-white p-2 border">
                    <div className="font-bold">Vibration</div>
                    <div className="text-red-600">12.4Hz</div>
                    <div className="text-gray-500">Normal: 2-4Hz</div>
                  </div>
                  <div className="bg-white p-2 border">
                    <div className="font-bold">Pressure</div>
                    <div className="text-red-600">1,847 PSI</div>
                    <div className="text-gray-500">Normal: 2,100 PSI</div>
                  </div>
                  <div className="bg-white p-2 border">
                    <div className="font-bold">Temperature</div>
                    <div className="text-orange-600">167°F</div>
                    <div className="text-gray-500">Normal: 120-150°F</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-3 mt-4">
              <h4 className="font-bold text-sm mb-2">SECTION V - MAINTENANCE HISTORY</h4>
              <div className="text-xs space-y-1">
                <div><strong>LAST INSPECTION:</strong> 03/15/2025</div>
                <div><strong>CYCLES SINCE MAINTENANCE:</strong> 1,247</div>
                <div><strong>TOTAL FLIGHT HOURS:</strong> 8,542</div>
                <div><strong>COMPONENT AGE:</strong> 2.3 years</div>
              </div>
            </div>

            <div className="border-t pt-3 mt-4">
              <h4 className="font-bold text-sm mb-2">SECTION VI - RISK ASSESSMENT</h4>
              <div className="text-xs space-y-1">
                <div><strong>FAILURE PROBABILITY:</strong> 94.7% within 12-18 hours</div>
                <div><strong>SAFETY IMPACT:</strong> Critical - potential landing gear failure</div>
                <div><strong>OPERATIONAL IMPACT:</strong> Aircraft grounding required</div>
                <div><strong>REGULATORY COMPLIANCE:</strong> FAR 25.729 - Landing gear systems</div>
              </div>
            </div>

            <div className="absolute bottom-2 right-2 text-xs text-gray-500">
              AIRBUS MAINTENANCE ALERT AMM 32-31-00 PAGE 2
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-gray-800 text-sm leading-tight space-y-3">
            <div className="border-b pb-2 mb-4">
              <h4 className="font-bold text-sm">SECTION VII - DETAILED TECHNICAL ANALYSIS</h4>
            </div>

            <div className="text-xs space-y-3">
              <p>
                <strong>FAILURE ANALYSIS:</strong> On July 14, 2025, at 14:23 UTC, the Skywise Predictive Maintenance system detected anomalous vibration patterns in the left main landing gear strut of Boeing 737-100, registration N2204A. The aircraft was parked at Gate A12 at Atlanta Hartsfield-Jackson International Airport following Flight DL1247 from Boston Logan.
              </p>

              <p>
                Sensor data analysis revealed excessive vibration frequencies of 12.4Hz, significantly above the normal operational range of 2-4Hz. Simultaneously, hydraulic pressure readings showed a concerning drop to 1,847 PSI, well below the minimum acceptable threshold of 2,100 PSI. Component temperature monitoring indicated elevated readings of 167°F, suggesting potential internal friction or hydraulic fluid degradation.
              </p>

              <p>
                The AI-powered diagnostic system cross-referenced these parameters with historical failure patterns from the global 737 fleet database. Pattern matching algorithms identified similar pre-failure signatures in 47 previous cases, with 94.7% confidence that catastrophic strut failure would occur within 12-18 operational hours if not addressed immediately.
              </p>

              <p>
                Visual inspection protocols were automatically initiated, and maintenance crew confirmed visible stress fractures in the strut housing consistent with advanced metal fatigue. The component has accumulated 1,247 cycles since last major maintenance and shows signs of accelerated wear due to recent operations in high-stress environments.
              </p>

              <p>
                Per Boeing Service Bulletin 737-32-001 and FAA Airworthiness Directive 2025-12-04, immediate grounding is required. The aircraft must not be operated until complete strut replacement is performed according to Aircraft Maintenance Manual procedures AMM 32-31-00 through 32-31-15.
              </p>
            </div>

            <div className="border-t pt-3 mt-4">
              <h4 className="font-bold text-sm mb-2">SECTION VIII - MAINTENANCE AUTHORIZATION</h4>
              <div className="text-xs space-y-1">
                <div><strong>MAINTENANCE SUPERVISOR:</strong> Thomas J. Richardson, A&P License #2847593</div>
                <div><strong>AUTHORIZATION:</strong> Work Order #MX-2025-0714-001 Approved</div>
              </div>
            </div>

            <div className="border-t pt-3 mt-4">
              <h4 className="font-bold text-sm mb-2">SECTION IX - REPLACEMENT PART DETAILS</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <div><strong>PART NUMBER:</strong> 737-32-1004-001</div>
                <div><strong>SERIAL NUMBER:</strong> LG-445721-R</div>
                <div><strong>SUPPLIER:</strong> Safran Landing Systems</div>
                <div><strong>ESTIMATED DOWNTIME:</strong> 16-24 hours</div>
              </div>
            </div>

            <div className="absolute bottom-2 right-2 text-xs text-gray-500">
              AIRBUS MAINTENANCE ALERT AMM 32-31-00 PAGE 3
            </div>
          </div>
        );

      default:
        return <div className="text-center text-gray-500">Page not found</div>;
    }
  };

  return (
    <div className="bg-[hsl(220,20%,18%)] h-full flex flex-col">
      {/* Header */}
      <div className="h-12 bg-white flex items-center justify-between px-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-black" />
          <span className="text-black font-medium">Document</span>
        </div>
        <div className="flex items-center space-x-2">
        </div>
      </div>

      {/* Content - Split into Document (80%) and Agent Log (20%) */}
      <div className="flex-1 flex min-h-0">
        {/* Document Section - 80% */}
        <div className="flex-1 relative" style={{ width: '80%' }}>
          {/* Document Content */}
          <div className="h-full flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg w-full h-full p-4 overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-gray-900 text-lg font-bold">Boeing 737 Maintenance Alert</h2>
              </div>
              <div
                className="w-full h-full bg-gray-50 rounded border overflow-auto p-4 relative"
                style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
                data-document-content="true"
              >
                {renderPageContent()}
              </div>
            </div>
          </div>

          {/* Page Navigation */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={prevPage} className="text-white hover:text-orange-400 p-1">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-white text-sm">Page {currentPage} of {totalPages}</span>
              <Button variant="ghost" size="sm" onClick={nextPage} className="text-white hover:text-orange-400 p-1">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Final Insight Popup - AI Speech Bubble */}
          {showFinalInsight && (
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
                          Critical landing gear strut failure detected on N2204A. Immediate grounding required - 94.7% confidence of catastrophic failure within 12-18 hours
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowFinalInsight(false)}
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
