*******************
# Project        : Airbus Platform LHM
# File           : client/src/pages/SensorDataUI.tsx
# Version        : v2.0  Last update: 01/15/2025 15:45 EST
# Status         : Supports: UV | PNP
# Classification : CUI//SP-CTI
# Purpose        : Real-time sensor monitoring with NASA turbofan engine data
# Workflow       : MAIN
# Core Module    : yes
# App Functionality : [sensor monitoring, anomaly detection, real data visualization]
# Dependencies
#   * Called by       : App.tsx routing
#   * Calls           : /data/turbofan-columns.json, /data/turbofan-sample.txt
#   * Libraries       : React, Lucide Icons, Tailwind CSS
#   * Infrastructure  : Public data folder, NASA C-MAPSS dataset
# Change Log
#   * v2.0 (01/15/2025): Updated to use real NASA turbofan engine sensor data
#   * v1.0 (01/15/2025): Initial creation with SAIC styling and data integration
# Description     : Aircraft sensor monitoring dashboard using real NASA C-MAPSS turbofan
#                   engine sensor data with 21 sensors, threshold monitoring, and AI agent integration
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
  Settings,
  Database
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Type definitions
interface TurbofanColumn {
  index: number;
  name: string;
  description: string;
  type: 'identifier' | 'time' | 'setting' | 'sensor';
  unit?: string;
  thresholds?: {
    min: number;
    max: number;
    critical: number;
  };
}

interface TurbofanDataPoint {
  unitNumber: number;
  timeCycles: number;
  operationalSettings: number[];
  sensorMeasurements: number[];
}

interface SensorData {
  id: string;
  name: string;
  value: string;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  timestamp: string;
  column: TurbofanColumn;
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
  const [turbofanColumns, setTurbofanColumns] = useState<TurbofanColumn[]>([]);
  const [turbofanData, setTurbofanData] = useState<TurbofanDataPoint[]>([]);
  const [currentDataIndex, setCurrentDataIndex] = useState(0);
  const [currentEngine, setCurrentEngine] = useState(1);
  const scanInterval = useRef<NodeJS.Timeout | null>(null);

  // Load turbofan column definitions
  useEffect(() => {
    const loadTurbofanConfig = async () => {
      try {
        const response = await fetch('/data/turbofan-columns.json');
        const config = await response.json();
        setTurbofanColumns(config.columns);
      } catch (error) {
        console.error('Failed to load turbofan config:', error);
      }
    };
    
    loadTurbofanConfig();
  }, []);

  // Load real turbofan data
  useEffect(() => {
    const loadTurbofanData = async () => {
      try {
        const response = await fetch('/data/turbofan-sample.txt');
        const text = await response.text();
        const lines = text.trim().split('\n');
        
        const parsedData: TurbofanDataPoint[] = lines.map(line => {
          const values = line.trim().split(/\s+/).map(Number);
          return {
            unitNumber: values[0],
            timeCycles: values[1],
            operationalSettings: values.slice(2, 5),
            sensorMeasurements: values.slice(5)
          };
        });
        
        setTurbofanData(parsedData);
      } catch (error) {
        console.error('Failed to load turbofan data:', error);
      }
    };
    
    loadTurbofanData();
  }, []);

  // Process real turbofan sensor data
  const processRealSensorData = () => {
    if (turbofanColumns.length === 0 || turbofanData.length === 0) return;
    
    // Get current data point
    const dataPoint = turbofanData[currentDataIndex % turbofanData.length];
    if (!dataPoint) return;
    
    const timestamp = new Date();
    const newFlagged = new Set<string>();
    
    // Filter only sensor columns (not identifiers, time, or settings)
    const sensorColumns = turbofanColumns.filter(col => col.type === 'sensor');
    
    const newData: SensorData[] = sensorColumns.slice(0, 8).map((column, index) => {
      // Map column index to actual data array position
      const dataIndex = column.index - 6; // Subtract 6 because sensors start at column 6
      const value = dataPoint.sensorMeasurements[dataIndex] || 0;
      
      // Check thresholds if they exist
      let status: 'normal' | 'warning' | 'critical' = 'normal';
      if (column.thresholds) {
        const exceedsThreshold = value > column.thresholds.max || value < column.thresholds.min;
        const isCritical = value > column.thresholds.critical;
        
        if (isCritical) {
          status = 'critical';
        } else if (exceedsThreshold) {
          status = 'warning';
        }
        
        if (exceedsThreshold) {
          newFlagged.add(`sensor-${index}`);
        }
        
        // Simulate anomaly detection for critical values
        const isAnomaly = isCritical && !anomalyDetected;
        if (isAnomaly) {
          setAnomalyDetected(true);
          triggerAgenticFlow(column.name, value, column.thresholds);
        }
      }
      
      return {
        id: `sensor-${index}`,
        name: column.name,
        value: value.toFixed(2),
        unit: column.unit || '',
        status,
        timestamp: timestamp.toISOString(),
        column,
        raw: {
          sensor_id: `TURBO-${column.index}`,
          type: column.name,
          value: value,
          unit: column.unit,
          timestamp: timestamp.getTime(),
          engine_unit: dataPoint.unitNumber,
          cycle: dataPoint.timeCycles,
          description: column.description,
          threshold_min: column.thresholds?.min,
          threshold_max: column.thresholds?.max,
          threshold_critical: column.thresholds?.critical
        }
      };
    });
    
    setSensorData(newData);
    setFlaggedSensors(newFlagged);
    setLastUpdate(new Date());
    
    // Keep history for raw data view
    setRawDataHistory(prev => [...prev.slice(-100), ...newData.map(s => s.raw)]);
    
    // Move to next data point
    setCurrentDataIndex(prev => prev + 1);
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
        content: `🚨 CRITICAL ANOMALY: ${sensorName} reading ${value.toFixed(2)} exceeds critical threshold of ${threshold.critical}. This is from NASA C-MAPSS turbofan engine data indicating potential failure progression.`, 
        timestamp: new Date() 
      },
      { 
        id: '2',
        role: 'agent', 
        content: 'Analyzing real engine degradation patterns from NASA dataset. Cross-referencing with historical failure modes: HPC Degradation and Fan Degradation...', 
        timestamp: new Date() 
      }
    ];
    setAgentMessages(initialMessages);
    
    // Simulate agent analysis
    setTimeout(() => {
      setAgentMessages(prev => [...prev, {
        id: '3',
        role: 'agent',
        content: 'Analysis complete. Pattern matches known engine deterioration trajectory from turbofan run-to-failure simulation. Estimated RUL (Remaining Useful Life) critically low. Initiating emergency protocols...',
        timestamp: new Date()
      }]);
      
      // Agent launches video
      setTimeout(() => {
        setShowVideo(true);
        setAgentMessages(prev => [...prev, {
          id: '4',
          role: 'agent',
          content: 'Visual inspection activated. Engine components showing signs of degradation consistent with NASA simulation data. Immediate maintenance required.',
          timestamp: new Date()
        }]);
      }, 1500);
    }, 2000);
  };

  // Download raw data
  const downloadRawData = () => {
    const dataStr = JSON.stringify(rawDataHistory, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `turbofan_sensor_data_${new Date().toISOString()}.json`;
    
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
    setCurrentDataIndex(0);
  };

  useEffect(() => {
    // Simulate connection establishment
    setTimeout(() => setConnectionStatus('connected'), 1000);
    
    // Start real data processing
    if (isScanning && connectionStatus === 'connected' && turbofanColumns.length > 0 && turbofanData.length > 0) {
      scanInterval.current = setInterval(processRealSensorData, 3000);
    }
    
    return () => {
      if (scanInterval.current) clearInterval(scanInterval.current);
    };
  }, [isScanning, connectionStatus, turbofanColumns, turbofanData]);

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
              <h1 className="text-3xl font-light tracking-tight mb-2 text-white">NASA Turbofan Engine Monitoring</h1>
              <p className="text-gray-400">Real-time analysis using NASA C-MAPSS dataset with AI-powered anomaly detection</p>
              <div className="flex items-center gap-4 mt-3 text-sm">
                <div className="flex items-center gap-2 bg-slate-900/50 backdrop-blur rounded-lg px-3 py-1 border border-cyan-500/20">
                  <Database className="w-4 h-4 text-cyan-400" />
                  <span className="text-gray-300">Engine Unit {currentEngine}</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/50 backdrop-blur rounded-lg px-3 py-1 border border-cyan-500/20">
                  <Activity className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Cycle {turbofanData[currentDataIndex]?.timeCycles || 0}</span>
                </div>
                <div className="text-gray-500">
                  Data Point: {currentDataIndex + 1} / {turbofanData.length}
                </div>
              </div>
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
                    Turbofan Engine Status
                  </CardTitle>
                  {isScanning && (
                    <div className="flex items-center gap-2 text-sm text-cyan-400">
                      <Activity className="w-4 h-4 animate-pulse" />
                      <span>Processing NASA Data</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {anomalyDetected ? (
                  <div className="flex items-center gap-3">
                    <Circle className="w-3 h-3 fill-red-500 text-red-500" />
                    <div>
                      <p className="font-medium text-red-400">Critical Anomaly Detected</p>
                      <p className="text-sm text-gray-400">NASA C-MAPSS data indicates engine degradation pattern</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Circle className="w-3 h-3 fill-green-500 text-green-500" />
                    <div>
                      <p className="font-medium text-green-400">Normal Operation</p>
                      <p className="text-sm text-gray-400">Real turbofan sensor readings within parameters</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sensor Readings */}
            <Card className="bg-slate-900/50 backdrop-blur-xl border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-white">Live NASA Turbofan Sensor Data</CardTitle>
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
                            <p className="text-xs text-gray-500 mt-1">{sensor.column.description}</p>
                          </div>
                          {flaggedSensors.has(sensor.id) && (
                            <AlertTriangle className="w-5 h-5 text-yellow-400" />
                          )}
                        </div>
                        <div className="text-right">
                          {sensor.column.thresholds && (
                            <>
                              <div className="text-xs text-gray-500 mb-1">
                                Range: {sensor.column.thresholds.min} - {sensor.column.thresholds.max}
                              </div>
                              <div className="text-xs text-gray-500">
                                Critical: {sensor.column.thresholds.critical}
                              </div>
                            </>
                          )}
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
                  <CardTitle className="text-white">NASA C-MAPSS Raw Data Stream</CardTitle>
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
                    <CardTitle className="text-white">Engine Visual Inspection</CardTitle>
                    <Button variant="outline" size="sm" className="border-cyan-500/20 text-cyan-400">
                      <Play className="w-4 h-4 mr-2" />
                      Live Feed
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-slate-950/50 rounded-lg flex items-center justify-center border border-slate-700/50">
                    <div className="text-center">
                      <Play className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                      <p className="text-sm text-gray-400">Turbofan Engine Visual Inspection</p>
                      <p className="text-xs text-gray-500 mt-1">AI Analysis of Engine Components</p>
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
                  NASA C-MAPSS AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="h-96 flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {!showAgent ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Database className="w-8 h-8 mx-auto mb-3 text-gray-500" />
                        <p className="text-sm text-gray-400">Processing real turbofan data</p>
                        <p className="text-xs text-gray-500 mt-1">NASA C-MAPSS dataset analysis</p>
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
                        placeholder="Ask about the turbofan data..."
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