*******************
# Project        : Airbus Platform LHM
# File           : client/src/pages/SensorDataUI.tsx
# Version        : v1.0  Last update: 01/15/2025 15:30 EST
# Status         : Supports: UV | PNP
# Classification : CUI//SP-CTI
# Purpose        : Real-time sensor monitoring with AI anomaly detection
# Workflow       : MAIN
# Core Module    : yes
# App Functionality : [sensor monitoring, anomaly detection, data visualization]
# Dependencies
#   * Called by       : App.tsx routing
#   * Calls           : /data/sensor-config.json, /data/sensor-readings.json
#   * Libraries       : React, Lucide Icons, Tailwind CSS
#   * Infrastructure  : Public data folder
# Change Log
#   * v1.0 (01/15/2025): Initial creation with SAIC styling and data integration
# Description     : Aircraft sensor monitoring dashboard with real-time data visualization,
#                   threshold monitoring, anomaly detection, and AI agent integration
*******************

import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Wifi, 
  WifiOff, 
  Play, 
  MessageSquare, 
  ChevronRight, 
  Circle, 
  Download, 
  Terminal, 
  AlertTriangle,
  Pause,
  RotateCcw,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Type definitions
interface SensorConfig {
  id: string;
  name: string;
  type: string;
  unit: string;
  location: string;
  thresholds: {
    min: number;
    max: number;
    critical: number;
  };
  calibration: {
    date: string;
    accuracy: string;
    nextDue: string;
  };
}

interface SensorReading {
  timestamp: string;
  sensor_id: string;
  value: number;
  status: string;
}

interface SensorData {
  id: string;
  name: string;
  value: string;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  timestamp: string;
  config: SensorConfig;
  raw: any;
}

interface AgentMessage {
  id: string;
  role: 'agent' | 'user';
  content: string;
  timestamp: Date;
}

const SensorDataUI: React.FC = () => {
  const [isScanning, setIsScanning] = useState(true);
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [rawDataHistory, setRawDataHistory] = useState<any[]>([]);
  const [anomalyDetected, setAnomalyDetected] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showAgent, setShowAgent] = useState(false);
  const [showRawData, setShowRawData] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([]);
  const [flaggedSensors, setFlaggedSensors] = useState(new Set<string>());
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [sensorConfigs, setSensorConfigs] = useState<SensorConfig[]>([]);
  const scanInterval = useRef<NodeJS.Timeout | null>(null);

  // Load sensor configuration from data folder
  useEffect(() => {
    const loadSensorConfig = async () => {
      try {
        const response = await fetch('/data/sensor-config.json');
        const config = await response.json();
        setSensorConfigs(config.sensors);
      } catch (error) {
        console.error('Failed to load sensor config:', error);
      }
    };
    
    loadSensorConfig();
  }, []);

  // Generate sensor data based on config
  const generateSensorData = () => {
    if (sensorConfigs.length === 0) return;
    
    const timestamp = new Date();
    const newFlagged = new Set<string>();
    
    const newData: SensorData[] = sensorConfigs.map((config) => {
      // Generate realistic values based on sensor type
      let baseValue: number;
      let variance: number;
      
      switch (config.type) {
        case 'temperature':
          baseValue = 72;
          variance = 5;
          break;
        case 'pressure':
          baseValue = 3000;
          variance = 100;
          break;
        case 'vibration':
          baseValue = 0.5;
          variance = 0.2;
          break;
        case 'flow':
          baseValue = 120;
          variance = 10;
          break;
        case 'rotation':
          baseValue = 3000;
          variance = 200;
          break;
        case 'humidity':
          baseValue = 45;
          variance = 10;
          break;
        case 'electrical':
          baseValue = 120;
          variance = 5;
          break;
        default:
          baseValue = 100;
          variance = 10;
      }
      
      const value = baseValue + (Math.random() - 0.5) * variance;
      
      // Check thresholds
      const exceedsThreshold = value > config.thresholds.max || value < config.thresholds.min;
      const isCritical = value > config.thresholds.critical;
      
      // Simulate anomaly
      const isAnomaly = (Math.random() < 0.05 || isCritical) && !anomalyDetected;
      
      if (exceedsThreshold) {
        newFlagged.add(config.id);
      }
      
      if (isAnomaly && !anomalyDetected) {
        setAnomalyDetected(true);
        triggerAgenticFlow(config.name, value, config.thresholds);
      }
      
      return {
        id: config.id,
        name: config.name,
        value: value.toFixed(2),
        unit: config.unit,
        status: isCritical ? 'critical' : exceedsThreshold ? 'warning' : 'normal',
        timestamp: timestamp.toISOString(),
        config,
        raw: {
          sensor_id: config.id,
          type: config.type,
          value: value,
          unit: config.unit,
          timestamp: timestamp.getTime(),
          location: config.location,
          calibration_date: config.calibration.date,
          accuracy: config.calibration.accuracy,
          threshold_min: config.thresholds.min,
          threshold_max: config.thresholds.max,
          threshold_critical: config.thresholds.critical
        }
      };
    });
    
    setSensorData(newData);
    setFlaggedSensors(newFlagged);
    setLastUpdate(new Date());
    
    // Keep history for raw data view
    setRawDataHistory(prev => [...prev.slice(-100), ...newData.map(s => s.raw)]);
  };

  // Trigger agentic flow when anomaly detected
  const triggerAgenticFlow = (sensorName: string, value: number, threshold: any) => {
    setIsScanning(false);
    setTimeout(() => {
      setShowAgent(true);
      initializeAgentConversation(sensorName, value, threshold);
    }, 500);
  };

  // Initialize agent conversation
  const initializeAgentConversation = (sensorName: string, value: number, threshold: any) => {
    const initialMessages: AgentMessage[] = [
      { 
        id: '1',
        role: 'agent', 
        content: `Anomaly detected: ${sensorName} reading ${value.toFixed(2)} exceeds threshold of ${threshold.max}. Initiating diagnostic protocol...`, 
        timestamp: new Date() 
      },
      { 
        id: '2',
        role: 'agent', 
        content: 'Analyzing historical patterns and cross-referencing with maintenance logs...', 
        timestamp: new Date() 
      }
    ];
    setAgentMessages(initialMessages);
    
    // Simulate agent analysis
    setTimeout(() => {
      setAgentMessages(prev => [...prev, {
        id: '3',
        role: 'agent',
        content: 'Analysis complete. Critical deviation pattern identified. Launching visual inspection interface...',
        timestamp: new Date()
      }]);
      
      // Agent launches video
      setTimeout(() => {
        setShowVideo(true);
        setAgentMessages(prev => [...prev, {
          id: '4',
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

  // Reset anomaly state
  const resetAnomalyState = () => {
    setAnomalyDetected(false);
    setShowAgent(false);
    setShowVideo(false);
    setAgentMessages([]);
    setIsScanning(true);
  };

  useEffect(() => {
    // Simulate connection establishment
    setTimeout(() => setConnectionStatus('connected'), 1000);
    
    // Start sensor data simulation
    if (isScanning && connectionStatus === 'connected' && sensorConfigs.length > 0) {
      scanInterval.current = setInterval(generateSensorData, 2000);
    }
    
    return () => {
      if (scanInterval.current) clearInterval(scanInterval.current);
    };
  }, [isScanning, connectionStatus, sensorConfigs]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-light tracking-tight mb-2 text-white">Aircraft Sensor Monitoring</h1>
              <p className="text-gray-400">Real-time sensor analysis with AI-powered anomaly detection</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setShowRawData(!showRawData)}
                variant="outline"
                size="sm"
                className="border-cyan-500/20 text-cyan-400 hover:bg-cyan-600/10"
              >
                <Terminal className="w-4 h-4 mr-2" />
                Raw Data
              </Button>
              <Button
                onClick={downloadRawData}
                variant="outline"
                size="sm"
                className="border-cyan-500/20 text-cyan-400 hover:bg-cyan-600/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                onClick={resetAnomalyState}
                variant="outline"
                size="sm"
                className="border-cyan-500/20 text-cyan-400 hover:bg-cyan-600/10"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <div className="flex items-center gap-2 text-sm bg-slate-900/50 backdrop-blur rounded-lg px-3 py-2 border border-cyan-500/20">
                {connectionStatus === 'connected' ? (
                  <Wifi className="w-4 h-4 text-green-400" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-400" />
                )}
                <span className="text-gray-300">{connectionStatus}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Sensor Data */}
          <div className="col-span-8 space-y-6">
            {/* Status Card */}
            <Card className="bg-slate-900/50 backdrop-blur-xl border-cyan-500/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-cyan-400" />
                    System Status
                  </CardTitle>
                  {isScanning && (
                    <div className="flex items-center gap-2 text-sm text-cyan-400">
                      <Activity className="w-4 h-4 animate-pulse" />
                      <span>Scanning</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {anomalyDetected ? (
                  <div className="flex items-center gap-3">
                    <Circle className="w-3 h-3 fill-red-500 text-red-500" />
                    <div>
                      <p className="font-medium text-red-400">Anomaly Detected</p>
                      <p className="text-sm text-gray-400">AI diagnostic protocol initiated</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Circle className="w-3 h-3 fill-green-500 text-green-500" />
                    <div>
                      <p className="font-medium text-green-400">Normal Operation</p>
                      <p className="text-sm text-gray-400">All systems within parameters</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sensor Readings */}
            <Card className="bg-slate-900/50 backdrop-blur-xl border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-white">Live Sensor Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sensorData.map((sensor) => (
                    <div
                      key={sensor.id}
                      className={`p-4 rounded-lg border transition-all duration-300 ${
                        sensor.status === 'critical' 
                          ? 'bg-red-900/20 border-red-500/50' 
                          : flaggedSensors.has(sensor.id) 
                          ? 'bg-yellow-900/20 border-yellow-500/50' 
                          : 'bg-slate-800/30 border-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm text-gray-400 mb-1">{sensor.name}</p>
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-light text-white tabular-nums">{sensor.value}</span>
                              <span className="text-sm text-gray-400">{sensor.unit}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{sensor.config.location}</p>
                          </div>
                          {flaggedSensors.has(sensor.id) && (
                            <AlertTriangle className="w-5 h-5 text-yellow-400" />
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500 mb-1">
                            Range: {sensor.config.thresholds.min} - {sensor.config.thresholds.max}
                          </div>
                          <div className="text-xs text-gray-500">
                            Critical: {sensor.config.thresholds.critical}
                          </div>
                          {sensor.status !== 'normal' && (
                            <span className={`text-xs uppercase tracking-wider px-2 py-1 rounded-full ${
                              sensor.status === 'critical' 
                                ? 'bg-red-900/30 text-red-400' 
                                : 'bg-yellow-900/30 text-yellow-400'
                            }`}>
                              {sensor.status}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Raw Data View */}
            {showRawData && (
              <Card className="bg-slate-900/50 backdrop-blur-xl border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Raw Data Stream</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-950/50 p-4 rounded-lg font-mono text-xs overflow-x-auto max-h-64 overflow-y-auto border border-slate-700/50">
                    <pre className="text-gray-300">{JSON.stringify(sensorData.map(s => s.raw), null, 2)}</pre>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Video Section */}
            {showVideo && (
              <Card className="bg-slate-900/50 backdrop-blur-xl border-cyan-500/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Visual Inspection Feed</CardTitle>
                    <Button variant="outline" size="sm" className="border-cyan-500/20 text-cyan-400">
                      <Play className="w-4 h-4 mr-2" />
                      Live
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-slate-950/50 rounded-lg flex items-center justify-center border border-slate-700/50">
                    <div className="text-center">
                      <Play className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                      <p className="text-sm text-gray-400">Camera Feed: Engine Bay 1</p>
                      <p className="text-xs text-gray-500 mt-1">AI Visual Analysis Active</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - AI Agent */}
          <aside className="col-span-4">
            <Card className="bg-slate-900/50 backdrop-blur-xl border-cyan-500/20 h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-cyan-400" />
                  AI Diagnostic Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="h-96 flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {!showAgent ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Activity className="w-8 h-8 mx-auto mb-3 text-gray-500" />
                        <p className="text-sm text-gray-400">Monitoring active</p>
                        <p className="text-xs text-gray-500 mt-1">Assistant on standby</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {agentMessages.map((message) => (
                        <div key={message.id} className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
                          <p className="text-sm leading-relaxed text-gray-300">{message.content}</p>
                          <p className="text-xs text-gray-500 mt-2">
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
                  <div className="border-t border-slate-700/50 pt-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 text-sm px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                      <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700 text-white">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default SensorDataUI; 