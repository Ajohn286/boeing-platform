/*
*******************
# Project        : Airbus Platform LHM
# File           : client/src/pages/SensorDataUI.tsx
# Version        : v2.6  Last update: 01/17/2025 18:30 EST
# Status         : Supports: UV | PNP
# Classification : CUI//SP-CTI
# Purpose        : Real-time sensor monitoring with Airbus turbofan data
# Workflow       : MAIN
# Core Module    : yes
# App Functionality : [sensor monitoring, anomaly detection, real data visualization]
# Dependencies
#   * Called by       : App.tsx routing
#   * Calls           : /data/turbofan-columns.json, /data/turbofan-sample.txt
#   * Libraries       : React, Lucide Icons, Tailwind CSS
#   * Infrastructure  : Public data folder, Airbus turbofan dataset
# Change Log
#   * v2.6 (01/17/2025): Added real-time sensor trends chart and CSV export functionality
#   * v2.5 (01/17/2025): Added continuous data cycling and archived inspection video feed
#   * v2.4 (01/17/2025): Removed NASA references, replaced with Airbus branding
#   * v2.3 (01/17/2025): Added looping turbofan video feed to right column
#   * v2.2 (01/17/2025): Updated refresh rate to 1 second for live monitoring
#   * v2.1 (01/17/2025): Updated to match Invisible platform white theme
#   * v2.0 (01/15/2025): Updated to use real Airbus turbofan engine sensor data
#   * v1.0 (01/15/2025): Initial creation with SAIC styling and data integration
# Description     : Aircraft sensor monitoring dashboard using real Airbus turbofan
#                   engine sensor data with 21 sensors, threshold monitoring, and AI agent integration
*******************
*/

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
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Type definitions
interface SensorThreshold {
  min: number;
  max: number;
  critical: number;
}

interface SensorRawData {
  sensor_id: string;
  type: string;
  value: number;
  unit: string;
  timestamp: number;
  engine_unit: number;
  cycle: number;
  description: string;
  threshold_min?: number;
  threshold_max?: number;
  threshold_critical?: number;
}

interface SensorData {
  id: string;
  name: string;
  value: string;
  unit: string;
  status: string;
  timestamp: string;
  raw: SensorRawData;
}

interface AgentMessage {
  role: string;
  content: string;
  timestamp: Date;
}

interface TurbofanColumn {
  index: number;
  name: string;
  description: string;
  type: string;
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
  operationalSetting1: number;
  operationalSetting2: number;
  operationalSetting3: number;
  sensors: number[];
}

const SensorDataUI = () => {
  const [isScanning, setIsScanning] = useState(true);
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [rawDataHistory, setRawDataHistory] = useState<SensorRawData[]>([]);
  const [anomalyDetected, setAnomalyDetected] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showAgent, setShowAgent] = useState(false);
  const [showRawData, setShowRawData] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([]);
  const [flaggedSensors, setFlaggedSensors] = useState(new Set<string>());
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [chartData, setChartData] = useState<any[]>([]);
  const [turbofanColumns, setTurbofanColumns] = useState<TurbofanColumn[]>([]);
  const [turbofanData, setTurbofanData] = useState<TurbofanDataPoint[]>([]);
  const [currentDataIndex, setCurrentDataIndex] = useState(0);
  const scanInterval = useRef<NodeJS.Timeout | null>(null);

  // Load Airbus turbofan dataset configuration
  useEffect(() => {
    const loadTurbofanData = async () => {
      try {
        // Load column definitions
        const columnsResponse = await fetch('/data/turbofan-columns.json');
        const columnsData = await columnsResponse.json();
        setTurbofanColumns(columnsData.columns || columnsData);

        // Load sample data
        const dataResponse = await fetch('/data/turbofan-sample.txt');
        const dataText = await dataResponse.text();
        
        // Parse the space-separated data
        const lines = dataText.trim().split('\n');
        const parsedData: TurbofanDataPoint[] = lines.map(line => {
          const values = line.trim().split(/\s+/).map(Number);
          return {
            unitNumber: values[0],
            timeCycles: values[1],
            operationalSetting1: values[2],
            operationalSetting2: values[3],
            operationalSetting3: values[4],
            sensors: values.slice(5) // Sensors start at column 6 (index 5)
          };
        });
        
        setTurbofanData(parsedData);
      } catch (error) {
        console.error('Failed to load turbofan data:', error);
      }
    };

    loadTurbofanData();
  }, []);

  const generateSensorDataFromAirbus = () => {
    if (turbofanColumns.length === 0 || turbofanData.length === 0) return;

    const dataPoint = turbofanData[currentDataIndex % turbofanData.length];
    if (!dataPoint) return;

    const timestamp = new Date();
    const newFlagged = new Set<string>();
    
    // Use real sensor data from Airbus dataset
    const sensorColumns = turbofanColumns.filter(col => col.type === 'sensor'); // Filter for sensor type columns
    
    const newData: SensorData[] = sensorColumns.map((column, index) => {
      const sensorValue = dataPoint.sensors[index] || 0;
      const sensorId = `sensor-${column.index}`;
      
      // Check thresholds if available
      let status = 'normal';
      const thresholds = column.thresholds;
      if (thresholds) {
        const exceedsThreshold = sensorValue > thresholds.max || sensorValue < thresholds.min;
        const isCritical = sensorValue > thresholds.critical;
        
        if (isCritical) {
          status = 'critical';
          newFlagged.add(sensorId);
        } else if (exceedsThreshold) {
          status = 'warning';
          newFlagged.add(sensorId);
        }

                 // Simulate anomaly detection
         if ((status === 'critical' || Math.random() < 0.05) && !anomalyDetected) {
           setAnomalyDetected(true);
           triggerAgenticFlow(column.name, sensorValue, thresholds);
         }
       }

       return {
         id: sensorId,
         name: column.name,
         value: sensorValue.toFixed(4),
         unit: column.unit || '',
         status,
         timestamp: timestamp.toISOString(),
         raw: {
           sensor_id: `AIRBUS-${column.index}`,
           type: column.name.toLowerCase().replace(/\s+/g, '_'),
                     value: sensorValue,
           unit: column.unit || '',
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
    
    // Update chart data with key sensors for trending
    const chartEntry = {
      time: timestamp.toLocaleTimeString(),
      timestamp: timestamp.getTime(),
      ...newData.slice(0, 5).reduce((acc, sensor) => {
        acc[sensor.name.split(' ')[0]] = parseFloat(sensor.value);
        return acc;
      }, {} as any)
    };
    setChartData(prev => [...prev.slice(-20), chartEntry]); // Keep last 20 data points
    
    // Move to next data point - cycle continuously from beginning when reaching end
    setCurrentDataIndex(prev => {
      const nextIndex = (prev + 1) % turbofanData.length;
      if (nextIndex === 0) {
        console.log('Cycling back to beginning of dataset for continuous monitoring');
      }
      return nextIndex;
    });
  };

  // Trigger agentic flow when anomaly detected
  const triggerAgenticFlow = (sensorName: string, value: number, threshold: SensorThreshold) => {
    setIsScanning(false);
    setTimeout(() => {
      setShowAgent(true);
      initializeAgentConversation(sensorName, value, threshold);
    }, 500);
  };

  // Initialize agent conversation
  const initializeAgentConversation = (sensorName: string, value: number, threshold: SensorThreshold) => {
    const initialMessages: AgentMessage[] = [
      { 
        role: 'agent', 
        content: `Anomaly detected in ${sensorName}: reading ${value.toFixed(4)} exceeds normal operating parameters. Initiating Airbus diagnostic protocol analysis...`, 
        timestamp: new Date() 
      },
      { 
        role: 'agent', 
        content: 'Cross-referencing with historical turbofan engine degradation patterns from Airbus maintenance database...', 
        timestamp: new Date() 
      }
    ];
    setAgentMessages(initialMessages);
    
    // Simulate agent analysis
    setTimeout(() => {
      setAgentMessages(prev => [...prev, {
        role: 'agent',
        content: 'Analysis complete. Potential HPC degradation pattern identified. This aligns with Airbus fault mode specifications. Launching visual inspection interface...',
        timestamp: new Date()
      }]);
      
      // Agent launches video
      setTimeout(() => {
        setShowVideo(true);
        setAgentMessages(prev => [...prev, {
          role: 'agent',
          content: 'Video feed activated. Reviewing turbofan engine components for signs of degradation consistent with sensor anomalies.',
          timestamp: new Date()
        }]);
      }, 1500);
    }, 2000);
  };

  // Download raw data as CSV
  const downloadRawData = () => {
    if (rawDataHistory.length === 0) {
      alert('No data available to export');
      return;
    }

    // Create CSV headers
    const headers = Object.keys(rawDataHistory[0]);
    const csvHeaders = headers.join(',');
    
    // Create CSV rows
    const csvRows = rawDataHistory.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle nested objects and arrays
        if (typeof value === 'object' && value !== null) {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        }
        // Handle strings with commas
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    );
    
    const csvContent = [csvHeaders, ...csvRows].join('\n');
    const dataUri = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(csvContent);
    
    const exportFileDefaultName = `airbus_turbofan_data_${new Date().toISOString().split('T')[0]}.csv`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  useEffect(() => {
    // Simulate connection establishment
    setTimeout(() => setConnectionStatus('connected'), 1000);
    
    // Start sensor data simulation using Airbus data
    if (isScanning && connectionStatus === 'connected' && turbofanColumns.length > 0 && turbofanData.length > 0) {
      scanInterval.current = setInterval(generateSensorDataFromAirbus, 1000); // Update every 1 second for live monitoring
    }
    
    return () => {
      if (scanInterval.current) clearInterval(scanInterval.current);
    };
  }, [isScanning, connectionStatus, turbofanColumns, turbofanData]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Airbus Turbofan Engine Monitoring</h1>
            <p className="text-lg text-gray-600 mt-2">Real-time analysis using advanced turbofan dataset with 21 authentic sensors</p>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => setShowRawData(!showRawData)}
              className="gap-2"
            >
              <Terminal size={16} />
              Raw Data
            </Button>
            <Button 
              variant="outline" 
              onClick={downloadRawData}
              className="gap-2"
              title="Export sensor data as CSV file"
            >
              <Download size={16} />
              Export CSV
            </Button>
            <div className="flex items-center gap-2">
              {connectionStatus === 'connected' ? (
                <Wifi size={16} className="text-green-600" />
              ) : (
                <WifiOff size={16} className="text-red-600" />
              )}
              <Badge variant={connectionStatus === 'connected' ? 'default' : 'destructive'}>
                {connectionStatus}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Sensor Data */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">System Status</CardTitle>
                {isScanning && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Activity size={14} className="animate-pulse" />
                    <span>Scanning</span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {anomalyDetected ? (
                <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                  <Circle size={8} className="fill-current text-red-600" />
                  <div>
                    <p className="font-medium text-red-900">Anomaly Detected</p>
                    <p className="text-sm text-red-700">AI diagnostic protocol initiated</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                  <Circle size={8} className="fill-current text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Normal Operation</p>
                    <p className="text-sm text-green-700">All systems within parameters</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sensor Readings */}
          <Card>
            <CardHeader>
              <CardTitle>Live Turbofan Engine Data</CardTitle>
              <p className="text-sm text-gray-600">Engine Unit: {turbofanData[currentDataIndex % turbofanData.length]?.unitNumber || 'Loading...'} | Cycle: {turbofanData[currentDataIndex % turbofanData.length]?.timeCycles || 'Loading...'}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sensorData.slice(0, 12).map((sensor) => (
                  <div
                    key={sensor.id}
                    className={`flex items-center justify-between py-3 px-4 rounded-lg border transition-all duration-300 ${
                      sensor.status === 'critical' ? 'bg-red-50 border-red-200' : 
                      sensor.status === 'warning' ? 'bg-yellow-50 border-yellow-200' : 
                      'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{sensor.name}</p>
                        <p className="text-xs text-gray-500">{sensor.raw.description}</p>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-mono">{sensor.value}</span>
                        <span className="text-sm text-gray-500">{sensor.unit}</span>
                      </div>
                      {flaggedSensors.has(sensor.id) && (
                        <AlertTriangle size={16} className="text-orange-500" />
                      )}
                    </div>
                    <div className="text-right">
                      {sensor.raw.threshold_min && sensor.raw.threshold_max && (
                        <div className="text-xs text-gray-500">
                          Range: {sensor.raw.threshold_min.toFixed(2)} - {sensor.raw.threshold_max.toFixed(2)}
                        </div>
                      )}
                      {sensor.status !== 'normal' && (
                        <Badge variant={sensor.status === 'critical' ? 'destructive' : 'secondary'}>
                          {sensor.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sensor Trends Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <BarChart3 size={18} className="text-blue-600" />
                <CardTitle>Sensor Trends</CardTitle>
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  Real-time
                </Badge>
              </div>
              <p className="text-sm text-gray-600">Live trending data for key sensors (last 20 readings)</p>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {chartData.length > 1 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="time" 
                        stroke="#6b7280"
                        fontSize={12}
                        interval="preserveStartEnd"
                      />
                      <YAxis stroke="#6b7280" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      {sensorData.slice(0, 5).map((sensor, index) => {
                        const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];
                        const sensorKey = sensor.name.split(' ')[0];
                        return (
                          <Line
                            key={sensorKey}
                            type="monotone"
                            dataKey={sensorKey}
                            stroke={colors[index]}
                            strokeWidth={2}
                            dot={{ r: 3 }}
                            connectNulls={false}
                          />
                        );
                      })}
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <BarChart3 size={48} className="mx-auto mb-3 text-gray-300" />
                      <p>Collecting data for chart...</p>
                      <p className="text-sm">Chart will appear after a few data points</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Raw Data View */}
          {showRawData && (
            <Card>
              <CardHeader>
                <CardTitle>Raw Turbofan Data Stream</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-x-auto max-h-64 overflow-y-auto font-mono">
                  {JSON.stringify(sensorData.slice(0, 5).map(s => s.raw), null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* Video Section */}
          {showVideo && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Visual Inspection Feed</CardTitle>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Play size={14} />
                    Live
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Play size={48} className="mx-auto mb-3 text-gray-400" />
                    <p className="text-gray-600">Turbofan Engine Camera Feed</p>
                    <p className="text-sm text-gray-500 mt-1">Engine Unit {turbofanData[currentDataIndex % turbofanData.length]?.unitNumber || 1} - Bay 3</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Video & AI Agent */}
        <div className="lg:col-span-1 space-y-6">
          {/* Latest Archived Inspection Video */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <Play size={18} className="text-blue-600" />
                <CardTitle className="text-lg">Latest Archived Inspection</CardTitle>
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  ARCHIVED
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 relative">
                <video 
                  className="w-full h-full object-cover"
                  autoPlay 
                  loop 
                  muted
                  playsInline
                >
                  <source src="/media/turbofan.mp4.mp4" type="video/mp4" />
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Play size={48} className="mx-auto mb-3 text-gray-400" />
                      <p className="text-gray-600">Video not supported</p>
                    </div>
                  </div>
                </video>
                {/* Video overlay indicators */}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-blue-600 text-white">ARCHIVED</Badge>
                </div>
                <div className="absolute bottom-4 left-4">
                  <Badge variant="outline" className="bg-black/50 text-white border-white/30">
                    Last 15 Days
                  </Badge>
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-600 space-y-1">
                <p className="font-medium">Engine Unit: {turbofanData[currentDataIndex % turbofanData.length]?.unitNumber || 'Loading...'}</p>
                <p>Inspection Date: {new Date(Date.now() - Math.floor(Math.random() * 15) * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs">📹 Related to current anomaly pattern detected</p>
                  <p className="text-xs">🔍 Visual inspection shows potential degradation signs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Diagnostic Assistant */}
          <Card className="h-fit">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <MessageSquare size={18} className="text-blue-600" />
                <CardTitle className="text-lg">AI Diagnostic Assistant</CardTitle>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="h-96 overflow-y-auto">
                {!showAgent ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Activity size={32} className="mx-auto mb-3 text-gray-400" />
                      <p className="text-gray-600">Monitoring Active</p>
                      <p className="text-sm text-gray-500 mt-1">AI assistant on standby</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {agentMessages.map((message, index) => (
                      <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-900 leading-relaxed">{message.content}</p>
                        <p className="text-xs text-blue-600 mt-2">
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
                <div className="mt-4 pt-4 border-t">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ask about the turbofan data..."
                      className="flex-1 text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Button size="sm" className="gap-2">
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SensorDataUI; 