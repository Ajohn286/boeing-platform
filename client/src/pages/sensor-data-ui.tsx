import React, { useState, useEffect, useRef } from 'react';
import { Activity, Wifi, WifiOff, Play, MessageSquare, ChevronRight, Circle, Download, Terminal, AlertTriangle } from 'lucide-react';

const SensorDataUI = () => {
  const [isScanning, setIsScanning] = useState(true);
  const [sensorData, setSensorData] = useState([]);
  const [rawDataHistory, setRawDataHistory] = useState([]);
  const [anomalyDetected, setAnomalyDetected] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showAgent, setShowAgent] = useState(false);
  const [showRawData, setShowRawData] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [agentMessages, setAgentMessages] = useState([]);
  const [flaggedSensors, setFlaggedSensors] = useState(new Set());
  const [previousValues, setPreviousValues] = useState({});
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const scanInterval = useRef(null);

  // Define sensor thresholds
  const sensorThresholds = {
    'Temperature': { min: 65, max: 80, critical: 85 },
    'Pressure': { min: 13, max: 16, critical: 18 },
    'Vibration': { min: 0, max: 0.8, critical: 1.0 },
    'Flow Rate': { min: 100, max: 140, critical: 150 },
    'RPM': { min: 2500, max: 3500, critical: 4000 },
    'Humidity': { min: 30, max: 60, critical: 70 },
    'Voltage': { min: 110, max: 130, critical: 135 }
  };

  // Generate comprehensive sensor data
  const generateSensorData = () => {
    const sensors = ['Temperature', 'Pressure', 'Vibration', 'Flow Rate', 'RPM', 'Humidity', 'Voltage'];
    const timestamp = new Date();
    const newFlagged = new Set();
    
    const newData = sensors.map((name, index) => {
      const baseValue = [72, 14.7, 0.5, 120, 3000, 45, 120][index];
      const variance = [5, 0.5, 0.2, 10, 200, 10, 5][index];
      const value = baseValue + (Math.random() - 0.5) * variance;
      
      // Check thresholds
      const threshold = sensorThresholds[name];
      const exceedsThreshold = value > threshold.max || value < threshold.min;
      const isCritical = value > threshold.critical;
      
      // Simulate anomaly
      const isAnomaly = (Math.random() < 0.1 || isCritical) && !anomalyDetected;
      
      if (exceedsThreshold) {
        newFlagged.add(`sensor-${index}`);
      }
      
      if (isAnomaly && !anomalyDetected) {
        setAnomalyDetected(true);
        triggerAgenticFlow(name, value, threshold);
      }
      
      return {
        id: `sensor-${index}`,
        name,
        value: value.toFixed(2),
        unit: ['°F', 'PSI', 'mm/s', 'GPM', 'RPM', '%', 'V'][index],
        status: isCritical ? 'critical' : exceedsThreshold ? 'warning' : 'normal',
        timestamp: timestamp.toISOString(),
        raw: {
          sensor_id: `SNS-${String(index + 1).padStart(3, '0')}`,
          type: name.toLowerCase().replace(' ', '_'),
          value: value,
          unit: ['fahrenheit', 'psi', 'mm_per_s', 'gpm', 'rpm', 'percent', 'volts'][index],
          timestamp: timestamp.getTime(),
          location: `Zone-${Math.floor(index / 2) + 1}`,
          calibration_date: '2025-01-15',
          accuracy: '±0.1%',
          threshold_min: threshold.min,
          threshold_max: threshold.max,
          threshold_critical: threshold.critical
        }
      };
    });
    
    // Track previous values for change detection
    const prevVals = {};
    newData.forEach(sensor => {
      prevVals[sensor.id] = sensor.value;
    });
    setPreviousValues(prevVals);
    
    setSensorData(newData);
    setFlaggedSensors(newFlagged);
    setLastUpdate(new Date());
    
    // Keep history for raw data view
    setRawDataHistory(prev => [...prev.slice(-100), ...newData.map(s => s.raw)]);
  };

  // Trigger agentic flow when anomaly detected
  const triggerAgenticFlow = (sensorName, value, threshold) => {
    setIsScanning(false);
    setTimeout(() => {
      setShowAgent(true);
      initializeAgentConversation(sensorName, value, threshold);
    }, 500);
  };

  // Initialize agent conversation
  const initializeAgentConversation = (sensorName, value, threshold) => {
    const initialMessages = [
      { 
        role: 'agent', 
        content: `Anomaly detected: ${sensorName} reading ${value.toFixed(2)} exceeds threshold of ${threshold.max}. Initiating diagnostic protocol...`, 
        timestamp: new Date() 
      },
      { 
        role: 'agent', 
        content: 'Analyzing historical patterns and cross-referencing with maintenance logs...', 
        timestamp: new Date() 
      }
    ];
    setAgentMessages(initialMessages);
    
    // Simulate agent analysis
    setTimeout(() => {
      setAgentMessages(prev => [...prev, {
        role: 'agent',
        content: 'Analysis complete. Critical deviation pattern identified. Launching visual inspection interface...',
        timestamp: new Date()
      }]);
      
      // Agent launches video
      setTimeout(() => {
        setShowVideo(true);
        setAgentMessages(prev => [...prev, {
          role: 'agent',
          content: 'Video feed activated. Please review the highlighted area for potential issues.',
          timestamp: new Date()
        }]);
      }, 1500);
    }, 2000);
  };

  // Download raw data
  const downloadRawData = () => {
    const dataStr = JSON.stringify(rawDataHistory, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `sensor_data_${new Date().toISOString()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  useEffect(() => {
    // Simulate connection establishment
    setTimeout(() => setConnectionStatus('connected'), 1000);
    
    // Start sensor data simulation
    if (isScanning && connectionStatus === 'connected') {
      scanInterval.current = setInterval(generateSensorData, 1000);
    }
    
    return () => {
      if (scanInterval.current) clearInterval(scanInterval.current);
    };
  }, [isScanning, connectionStatus]);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-light tracking-tight mb-1">Sensor Monitoring</h1>
              <p className="text-sm text-gray-600">Real-time analysis with threshold detection</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowRawData(!showRawData)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Terminal size={16} />
                <span>Raw Data</span>
              </button>
              <button
                onClick={downloadRawData}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Download size={16} />
                <span>Download</span>
              </button>
              <div className="flex items-center gap-2 text-sm">
                {connectionStatus === 'connected' ? (
                  <Wifi size={16} className="text-gray-400" />
                ) : (
                  <WifiOff size={16} className="text-gray-400" />
                )}
                <span className="text-gray-600">{connectionStatus}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-8">
          {/* Left Column - Sensor Data */}
          <div className="col-span-8 space-y-8">
            {/* Status */}
            <section className="border-b border-gray-100 pb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium uppercase tracking-wider text-gray-500">Status</h2>
                {isScanning && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Activity size={14} className="animate-pulse" />
                    <span>Scanning</span>
                  </div>
                )}
              </div>
              
              {anomalyDetected ? (
                <div className="flex items-center gap-3">
                  <Circle size={8} className="fill-current" />
                  <div>
                    <p className="font-medium">Anomaly Detected</p>
                    <p className="text-sm text-gray-600">Diagnostic protocol initiated</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Circle size={8} className="fill-current text-gray-300" />
                  <div>
                    <p className="font-medium">Normal Operation</p>
                    <p className="text-sm text-gray-600">All systems within parameters</p>
                  </div>
                </div>
              )}
            </section>

            {/* Sensor Readings */}
            <section>
              <h2 className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-6">Live Data</h2>
              <div className="space-y-4">
                {sensorData.map((sensor) => (
                  <div
                    key={sensor.id}
                    className={`py-4 border-b border-gray-100 last:border-0 transition-all duration-300 ${
                      sensor.status === 'critical' ? 'pl-4 border-l-2 border-gray-900' : 
                      flaggedSensors.has(sensor.id) ? 'pl-4 border-l-2 border-gray-400' : ''
                    }`}
                  >
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-4">
                        <span className="text-sm text-gray-600 w-24">{sensor.name}</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-light tabular-nums">{sensor.value}</span>
                          <span className="text-sm text-gray-500">{sensor.unit}</span>
                        </div>
                        {flaggedSensors.has(sensor.id) && (
                          <AlertTriangle size={14} className="text-gray-600" />
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">
                          {sensor.raw.threshold_min} - {sensor.raw.threshold_max}
                        </div>
                        {sensor.status !== 'normal' && (
                          <span className="text-xs uppercase tracking-wider text-gray-600">
                            {sensor.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Raw Data View */}
            {showRawData && (
              <section className="pt-8 border-t border-gray-100">
                <h2 className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-4">Raw Data Stream</h2>
                <div className="bg-gray-50 p-4 font-mono text-xs overflow-x-auto max-h-64 overflow-y-auto">
                  <pre>{JSON.stringify(sensorData.map(s => s.raw), null, 2)}</pre>
                </div>
              </section>
            )}

            {/* Video Section */}
            {showVideo && (
              <section className="pt-8 border-t border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-medium uppercase tracking-wider text-gray-500">Visual Feed</h2>
                  <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    <Play size={14} />
                    <span>Live</span>
                  </button>
                </div>
                <div className="aspect-video bg-gray-50 flex items-center justify-center">
                  <div className="text-center">
                    <Play size={32} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-sm text-gray-500">Video feed placeholder</p>
                    <p className="text-xs text-gray-400 mt-1">Camera: Bay 3 - View 1</p>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Agent */}
          <aside className="col-span-4">
            <div className="sticky top-8">
              <div className="border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <MessageSquare size={18} className="text-gray-400" />
                    <h2 className="text-sm font-medium uppercase tracking-wider text-gray-500">Assistant</h2>
                  </div>
                </div>
                
                <div className="h-96 overflow-y-auto p-6">
                  {!showAgent ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Activity size={24} className="mx-auto mb-3 text-gray-300" />
                        <p className="text-sm text-gray-500">Monitoring active</p>
                        <p className="text-xs text-gray-400 mt-1">Assistant on standby</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {agentMessages.map((message, index) => (
                        <div key={index}>
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            {message.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {showAgent && (
                  <div className="px-6 py-4 border-t border-gray-200">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 text-sm px-3 py-2 border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors"
                      />
                      <button className="p-2 hover:bg-gray-50 transition-colors">
                        <ChevronRight size={18} className="text-gray-600" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default SensorDataUI;