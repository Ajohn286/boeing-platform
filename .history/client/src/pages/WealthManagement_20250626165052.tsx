import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Search, 
  TrendingUp, 
  Upload,
  Eye,
  Download,
  BarChart3,
  Users,
  DollarSign,
  Calendar,
  Bot,
  Loader2,
  ExternalLink,
  X,
  BookOpen,
  ChevronDown,
  ChevronRight,
  History,
  Filter,
  Mail,
  Database,
  Link,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle,
  Plane,
  Wrench,
  Activity,
  Thermometer,
  Gauge,
  Wind,
  Cloud,
  Zap,
  Target,
  TrendingDown,
  AlertCircle,
  Settings,
  Play,
  Pause,
  RefreshCw
} from "lucide-react";
import { useState } from "react";

// Type definitions
interface EngineData {
  current: number;
  threshold: number;
  trend: string;
}

interface EngineHealth {
  vibration: EngineData;
  egt: EngineData;
  oilPressure: EngineData;
  oilTemp: EngineData;
  n1Speed: EngineData;
  n2Speed: EngineData;
}

interface AircraftEngineHealth {
  engine1: EngineHealth;
  engine2: EngineHealth;
}

interface StructuralData {
  current: number;
  threshold: number;
  trend: string;
}

interface AircraftStructuralHealth {
  wingStress: StructuralData;
  fuselageStress: StructuralData;
  crackPropagation: StructuralData;
  fatigueIndex: StructuralData;
}

interface FlightData {
  avg: number;
  last: number;
  trend: string;
}

interface AircraftFlightData {
  flightDuration: FlightData;
  altitude: FlightData;
  speed: FlightData;
  fuelEfficiency: FlightData;
}

interface EnvironmentalData {
  weatherConditions: string;
  humidity: string;
  temperature: string;
  routeStressors: string[];
  corrosionRisk: string;
}

interface PredictiveData {
  engineFailureProbability: { [key: string]: number };
  structuralFailureProbability: { [key: string]: number };
  recommendedMaintenance: string;
  riskFactors: string[];
  recommendations: string[];
}

export default function PredictiveMaintenance() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAircraft, setSelectedAircraft] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h");
  const [showAnomalyDetails, setShowAnomalyDetails] = useState(false);
  
  const [queryResult, setQueryResult] = useState<{
    result: string; 
    data: string[];
    sources: Array<{
      type: string;
      name: string;
      timestamp: string;
      confidence: number;
      icon: any;
    }>;
  } | null>(null);

  // Aircraft fleet data
  const aircraftFleet = [
    {
      id: "A350-1000-001",
      type: "A350-1000",
      registration: "F-WZNW",
      status: "operational",
      lastMaintenance: "2024-12-10",
      nextMaintenance: "2025-01-15",
      flightHours: 2847,
      healthScore: 94.2,
      alerts: 2,
      location: "Toulouse, France"
    },
    {
      id: "A320neo-002", 
      type: "A320neo",
      registration: "F-WZNE",
      status: "maintenance",
      lastMaintenance: "2024-12-08",
      nextMaintenance: "2024-12-20",
      flightHours: 1892,
      healthScore: 87.5,
      alerts: 5,
      location: "Hamburg, Germany"
    },
    {
      id: "A380-003",
      type: "A380",
      registration: "F-WWOW",
      status: "operational",
      lastMaintenance: "2024-11-25",
      nextMaintenance: "2025-02-10",
      flightHours: 4567,
      healthScore: 91.8,
      alerts: 1,
      location: "Dubai, UAE"
    }
  ];

  // Engine health monitoring data
  const engineHealthData: { [key: string]: AircraftEngineHealth } = {
    "A350-1000-001": {
      engine1: {
        vibration: { current: 0.8, threshold: 1.2, trend: "stable" },
        egt: { current: 650, threshold: 750, trend: "stable" },
        oilPressure: { current: 45, threshold: 35, trend: "stable" },
        oilTemp: { current: 85, threshold: 95, trend: "stable" },
        n1Speed: { current: 85.2, threshold: 90, trend: "stable" },
        n2Speed: { current: 92.1, threshold: 95, trend: "stable" }
      },
      engine2: {
        vibration: { current: 1.1, threshold: 1.2, trend: "increasing" },
        egt: { current: 720, threshold: 750, trend: "increasing" },
        oilPressure: { current: 42, threshold: 35, trend: "stable" },
        oilTemp: { current: 88, threshold: 95, trend: "stable" },
        n1Speed: { current: 84.8, threshold: 90, trend: "stable" },
        n2Speed: { current: 91.9, threshold: 95, trend: "stable" }
      }
    }
  };

  // Structural health monitoring data
  const structuralHealthData: { [key: string]: AircraftStructuralHealth } = {
    "A350-1000-001": {
      wingStress: { current: 0.65, threshold: 0.8, trend: "stable" },
      fuselageStress: { current: 0.45, threshold: 0.7, trend: "stable" },
      crackPropagation: { current: 0.02, threshold: 0.1, trend: "stable" },
      fatigueIndex: { current: 0.38, threshold: 0.6, trend: "stable" }
    }
  };

  // Flight operational data
  const flightOperationalData: { [key: string]: AircraftFlightData } = {
    "A350-1000-001": {
      flightDuration: { avg: 8.5, last: 7.2, trend: "stable" },
      altitude: { avg: 35000, last: 38000, trend: "stable" },
      speed: { avg: 0.85, last: 0.87, trend: "stable" },
      fuelEfficiency: { avg: 2.8, last: 2.9, trend: "improving" }
    }
  };

  // Environmental data
  const environmentalData: { [key: string]: EnvironmentalData } = {
    "A350-1000-001": {
      weatherConditions: "Clear",
      humidity: "45%",
      temperature: "22°C",
      routeStressors: ["High altitude", "Long duration"],
      corrosionRisk: "Low"
    }
  };

  // Maintenance logs
  const maintenanceLogs = [
    {
      id: "ML-001",
      aircraftId: "A350-1000-001",
      type: "Preventive",
      description: "Engine oil change and filter replacement",
      date: "2024-12-10",
      technician: "Jean Dupont",
      duration: "4 hours",
      status: "completed",
      findings: "Normal wear, no issues detected"
    },
    {
      id: "ML-002",
      aircraftId: "A320neo-002", 
      type: "Corrective",
      description: "Engine vibration analysis and adjustment",
      date: "2024-12-08",
      technician: "Hans Mueller",
      duration: "6 hours",
      status: "in-progress",
      findings: "Minor vibration detected, adjustment required"
    },
    {
      id: "ML-003",
      aircraftId: "A380-003",
      type: "Inspection",
      description: "Structural integrity check",
      date: "2024-11-25",
      technician: "Pierre Martin",
      duration: "8 hours",
      status: "completed",
      findings: "All structural components within specifications"
    }
  ];

  // Anomaly detection results
  const anomalyData = [
    {
      id: "ANOM-001",
      aircraftId: "A350-1000-001",
      component: "Engine 2",
      metric: "Vibration",
      severity: "medium",
      timestamp: "2024-12-15 14:30:00",
      value: 1.1,
      threshold: 1.2,
      confidence: 87,
      status: "investigating",
      description: "Engine vibration trending upward, approaching threshold"
    },
    {
      id: "ANOM-002",
      aircraftId: "A320neo-002",
      component: "Engine 1",
      metric: "EGT",
      severity: "high",
      timestamp: "2024-12-15 12:15:00",
      value: 780,
      threshold: 750,
      confidence: 94,
      status: "alert",
      description: "Exhaust gas temperature exceeded threshold"
    }
  ];

  // Predictive analytics
  const predictiveAnalytics: { [key: string]: PredictiveData } = {
    "A350-1000-001": {
      engineFailureProbability: { "7d": 0.02, "30d": 0.08, "90d": 0.15 },
      structuralFailureProbability: { "7d": 0.01, "30d": 0.03, "90d": 0.07 },
      recommendedMaintenance: "2025-01-15",
      riskFactors: ["Engine 2 vibration trend", "High altitude operations"],
      recommendations: [
        "Monitor Engine 2 vibration closely",
        "Schedule engine inspection within 30 days",
        "Consider route optimization for altitude"
      ]
    }
  };

  const handleQuerySubmit = async () => {
    if (!searchQuery.trim()) return;
    
    setIsProcessing(true);
    setQueryResult(null);
    
    // Simulate API call
    setTimeout(() => {
      setQueryResult({
        result: `Analysis complete for ${searchQuery}. Found 2 anomalies and 3 maintenance recommendations.`,
        data: [
          "Engine 2 vibration trending upward",
          "Structural health within normal parameters",
          "Maintenance schedule optimized"
        ],
        sources: [
          {
            type: "sensor",
            name: "Engine Vibration Sensor",
            timestamp: "2024-12-15 14:30:00",
            confidence: 87,
            icon: Activity
          },
          {
            type: "log",
            name: "Maintenance History",
            timestamp: "2024-12-10 09:00:00",
            confidence: 95,
            icon: FileText
          }
        ]
      });
      setIsProcessing(false);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational": return "text-green-600";
      case "maintenance": return "text-yellow-600";
      case "alert": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Predictive Maintenance</h2>
          <p className="text-muted-foreground">AI-powered aircraft health monitoring and failure prediction</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </Button>
          <Button className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configure Alerts
          </Button>
        </div>
      </div>

      {/* Fleet Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Active Aircraft</div>
                <div className="text-2xl font-bold text-foreground">3</div>
                <div className="text-sm text-green-600">+1 this month</div>
              </div>
              <Plane className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Health Score</div>
                <div className="text-2xl font-bold text-foreground">91.2%</div>
                <div className="text-sm text-green-600">+2.1% from last week</div>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Active Alerts</div>
                <div className="text-2xl font-bold text-foreground">8</div>
                <div className="text-sm text-red-600">-3 from yesterday</div>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Predictive Accuracy</div>
                <div className="text-2xl font-bold text-foreground">94.7%</div>
                <div className="text-sm text-green-600">+1.2% improvement</div>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Query Interface */}
      <Card className="bg-white border-border">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Search className="h-5 w-5" />
            AI-Powered Maintenance Query
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Ask questions about aircraft health, maintenance schedules, or failure predictions
          </p>
        </div>
        <CardContent className="p-6">
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="e.g., Show engine health trends for A350-1000-001, Predict maintenance needs for next 30 days..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleQuerySubmit()}
              disabled={isProcessing}
            />
            <Button onClick={handleQuerySubmit} disabled={isProcessing || !searchQuery.trim()}>
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>

          {queryResult && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Analysis Results</h4>
              <p className="text-blue-800 mb-3">{queryResult.result}</p>
              <div className="space-y-2">
                {queryResult.data.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-blue-700">
                    <CheckCircle className="h-4 w-4" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Aircraft Fleet Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-border">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Plane className="h-5 w-5" />
              Aircraft Fleet Status
            </h3>
          </div>
          <CardContent className="p-6">
            <div className="space-y-4">
              {aircraftFleet.map((aircraft) => (
                <div key={aircraft.id} className="border border-border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                     onClick={() => setSelectedAircraft(aircraft.id)}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{aircraft.type}</h4>
                      <p className="text-sm text-muted-foreground">{aircraft.registration} • {aircraft.location}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm">Health: <span className="font-semibold text-green-600">{aircraft.healthScore}%</span></span>
                        <span className="text-sm">Hours: <span className="font-semibold">{aircraft.flightHours}</span></span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={aircraft.status === 'operational' ? 'default' : 'secondary'}>
                        {aircraft.status}
                      </Badge>
                      {aircraft.alerts > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {aircraft.alerts} alerts
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Anomaly Detection */}
        <Card className="bg-white border-border">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Anomaly Detection
            </h3>
          </div>
          <CardContent className="p-6">
            <div className="space-y-4">
              {anomalyData.map((anomaly) => (
                <div key={anomaly.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{anomaly.component}</h4>
                      <p className="text-sm text-muted-foreground">{anomaly.metric} • {anomaly.timestamp}</p>
                      <p className="text-sm text-gray-600 mt-1">{anomaly.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getSeverityColor(anomaly.severity)}>
                        {anomaly.severity}
                      </Badge>
                      <span className="text-sm font-medium">{anomaly.confidence}% confidence</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Aircraft Analysis */}
      {selectedAircraft && (
        <Card className="bg-white border-border">
          <div className="px-6 py-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Detailed Analysis: {selectedAircraft}
              </h3>
              <Button variant="outline" size="sm" onClick={() => setSelectedAircraft(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Engine Health */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Engine Health Monitoring
                </h4>
                {engineHealthData[selectedAircraft] && (
                  <div className="space-y-3">
                    {Object.entries(engineHealthData[selectedAircraft]).map(([engine, data]) => (
                      <div key={engine} className="border border-border rounded-lg p-3">
                        <h5 className="font-medium text-sm mb-2">{engine.toUpperCase()}</h5>
                        {Object.entries(data).map(([metric, values]) => (
                          <div key={metric} className="flex justify-between items-center text-sm mb-1">
                            <span className="capitalize">{metric.replace(/([A-Z])/g, ' $1')}</span>
                            <div className="flex items-center gap-2">
                              <span className={values.current > values.threshold * 0.8 ? "text-yellow-600" : "text-green-600"}>
                                {values.current}
                              </span>
                              <span className="text-gray-400">/ {values.threshold}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Structural Health */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Structural Health
                </h4>
                {structuralHealthData[selectedAircraft] && (
                  <div className="space-y-3">
                    {Object.entries(structuralHealthData[selectedAircraft]).map(([metric, data]) => (
                      <div key={metric} className="flex justify-between items-center">
                        <span className="text-sm capitalize">{metric.replace(/([A-Z])/g, ' $1')}</span>
                        <div className="flex items-center gap-2">
                          <span className={data.current > data.threshold * 0.8 ? "text-yellow-600" : "text-green-600"}>
                            {data.current}
                          </span>
                          <span className="text-gray-400">/ {data.threshold}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Flight Operations */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Flight Operations
                </h4>
                {flightOperationalData[selectedAircraft] && (
                  <div className="space-y-3">
                    {Object.entries(flightOperationalData[selectedAircraft]).map(([metric, data]) => (
                      <div key={metric} className="flex justify-between items-center">
                        <span className="text-sm capitalize">{metric.replace(/([A-Z])/g, ' $1')}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">{data.avg}</span>
                          <span className="text-gray-400">avg</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Predictive Analytics */}
            <div className="mt-6 pt-6 border-t border-border">
              <h4 className="font-semibold text-foreground mb-4">Predictive Analytics</h4>
              {predictiveAnalytics[selectedAircraft] && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-sm mb-3">Failure Probability</h5>
                    <div className="space-y-2">
                      {Object.entries(predictiveAnalytics[selectedAircraft].engineFailureProbability).map(([period, prob]) => (
                        <div key={period} className="flex justify-between items-center">
                          <span className="text-sm">Engine ({period})</span>
                          <span className="text-sm font-medium">{(prob * 100).toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium text-sm mb-3">Recommendations</h5>
                    <div className="space-y-2">
                      {predictiveAnalytics[selectedAircraft].recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Maintenance Logs */}
      <Card className="bg-white border-border">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Maintenance Logs
          </h3>
        </div>
        <CardContent className="p-6">
          <div className="space-y-4">
            {maintenanceLogs.map((log) => (
              <div key={log.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{log.description}</h4>
                    <p className="text-sm text-muted-foreground">{log.aircraftId} • {log.date} • {log.technician}</p>
                    <p className="text-sm text-gray-600 mt-1">{log.findings}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={log.type === 'Preventive' ? 'default' : 'secondary'}>
                      {log.type}
                    </Badge>
                    <Badge variant={log.status === 'completed' ? 'default' : 'outline'}>
                      {log.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Environmental Data */}
      <Card className="bg-white border-border">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Environmental Conditions
          </h3>
        </div>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(environmentalData).map(([aircraftId, data]) => (
              <div key={aircraftId} className="border border-border rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-3">{aircraftId}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Weather</span>
                    <span className="text-sm font-medium">{data.weatherConditions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Humidity</span>
                    <span className="text-sm font-medium">{data.humidity}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Temperature</span>
                    <span className="text-sm font-medium">{data.temperature}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Corrosion Risk</span>
                    <Badge variant={data.corrosionRisk === 'Low' ? 'default' : 'secondary'} className="text-xs">
                      {data.corrosionRisk}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}