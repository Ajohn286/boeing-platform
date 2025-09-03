import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Plane,
  MapPin,
  Calendar,
  Camera,
  FileText,
  Users,
  AlertTriangle,
  Shield,
  Bot,
  Settings,
  Activity,
  Gauge,
  Zap,
  TrendingUp,
  BarChart3,
  Clock,
  Wrench,
  Database,
  Brain,
  DollarSign,
  CheckCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// Logo now served from public/media directory
const logoPath = "/media/logo.png";

interface MaintenanceAlertDetail {
  id: string;
  aircraftId: string;
  aircraftType: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  detectionDate: string;
  detectionTime: string;
  location: string;
  aircraftDetails: {
    manufacturer: string;
    model: string;
    year: string;
    serialNumber: string;
    totalFlightHours: number;
    cyclesSinceLastMaintenance: number;
  };
  componentDetails: {
    name: string;
    partNumber: string;
    location: string;
    lastMaintenanceDate: string;
    recommendedAction: string;
  };
  predictiveAnalysis: {
    aiModelVersion: string;
    confidenceScore: number;
    predictedFailureTime: string;
    riskFactors: string[];
    historicalData: string;
  };
  maintenanceRecommendation: string;
  estimatedDowntime: string;
  sensorData: Array<{
    sensorType: string;
    currentValue: string;
    normalRange: string;
    trend: string;
  }>;
}

const mockAlertDetail: MaintenanceAlertDetail = {
  id: "AIR-737-4512",
  aircraftId: "737-700",
  aircraftType: "Boeing 737-700",
  priority: "critical",
  detectionDate: "2025-01-15",
  detectionTime: "14:30",
  location: "CDG Airport, Paris",
  aircraftDetails: {
    manufacturer: "Boeing",
    model: "737-700",
    year: "2022",
    serialNumber: "MSN-55123",
    totalFlightHours: 2847,
    cyclesSinceLastMaintenance: 156
  },
  componentDetails: {
    name: "Landing Gear Strut",
    partNumber: "LG-220-STR-001",
    location: "Main Landing Gear - Left Side",
    lastMaintenanceDate: "2024-05-15",
    recommendedAction: "Immediate replacement required"
  },
  predictiveAnalysis: {
    aiModelVersion: "v2.1.4",
    confidenceScore: 94.2,
    predictedFailureTime: "Within 24 hours",
    riskFactors: [
      "Previous temporary repair 8 months ago",
      "Severe weather exposure",
      "High cycle count since last maintenance"
    ],
    historicalData: "Similar failures in 3 aircraft over past 12 months"
  },
  maintenanceRecommendation: "Aircraft must be grounded immediately. Landing gear strut replacement required with estimated 8-hour downtime.",
  estimatedDowntime: "8 hours",
  sensorData: [
    {
      sensorType: "Vibration Sensor",
      currentValue: "4.5 cm crack detected",
      normalRange: "0 cm",
      trend: "Critical"
    },
    {
      sensorType: "Hydraulic Pressure",
      currentValue: "2,800 PSI",
      normalRange: "2,500-3,000 PSI",
      trend: "Normal"
    },
    {
      sensorType: "Temperature",
      currentValue: "85°C",
      normalRange: "70-90°C",
      trend: "Normal"
    }
  ]
};

export default function AgenticClaimDetail() {
  const [, setLocation] = useLocation();
  const [alertDetail] = useState<MaintenanceAlertDetail>(mockAlertDetail);

  const handleMobilizeAgents = () => {
    setLocation("/agentic-agent-mobilization");
  };

  const handleBackToQueue = () => {
    setLocation("/agentic-claim-queue");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToQueue}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Queue
              </Button>
              <img
                src={logoPath}
                alt="Invisible Logo"
                className="h-8 w-auto"
              />
              <div className="ml-6">
                <h1 className="text-2xl font-bold text-gray-900">Maintenance Alert Detail</h1>
                <p className="text-sm text-gray-500">Aircraft: {alertDetail.aircraftId}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge className={getPriorityColor(alertDetail.priority)}>
                {alertDetail.priority.charAt(0).toUpperCase() + alertDetail.priority.slice(1)} Priority
              </Badge>
              <Button
                onClick={handleMobilizeAgents}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Bot className="h-4 w-4 mr-2" />
                Mobilize AI Team
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Aircraft Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="h-5 w-5" />
                  Aircraft Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Aircraft Type</Label>
                    <p className="text-lg font-semibold">{alertDetail.aircraftType}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Serial Number</Label>
                    <p className="text-lg font-semibold">{alertDetail.aircraftDetails.serialNumber}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Total Flight Hours</Label>
                    <p className="text-lg font-semibold">{alertDetail.aircraftDetails.totalFlightHours.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Cycles Since Last Maintenance</Label>
                    <p className="text-lg font-semibold">{alertDetail.aircraftDetails.cyclesSinceLastMaintenance}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Component Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Component Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Component</Label>
                    <p className="text-lg font-semibold">{alertDetail.componentDetails.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Part Number</Label>
                    <p className="text-lg font-semibold">{alertDetail.componentDetails.partNumber}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Location</Label>
                    <p className="text-lg font-semibold">{alertDetail.componentDetails.location}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Last Maintenance</Label>
                    <p className="text-lg font-semibold">{alertDetail.componentDetails.lastMaintenanceDate}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Label className="text-sm font-medium text-gray-500">Recommended Action</Label>
                  <p className="text-lg font-semibold text-red-600">{alertDetail.componentDetails.recommendedAction}</p>
                </div>
              </CardContent>
            </Card>

            {/* Sensor Data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Sensor Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alertDetail.sensorData.map((sensor, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{sensor.sensorType}</p>
                        <p className="text-sm text-gray-500">Normal: {sensor.normalRange}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{sensor.currentValue}</p>
                        <Badge variant={sensor.trend === 'Critical' ? 'destructive' : 'secondary'}>
                          {sensor.trend}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Actions and Analysis */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={handleMobilizeAgents}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Bot className="h-4 w-4 mr-2" />
                  Mobilize AI Team
                </Button>
                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Request More Info
                </Button>
                <Button variant="outline" className="w-full">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Mark as Fraud Risk
                </Button>
              </CardContent>
            </Card>

            {/* AI Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Confidence Score</Label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${alertDetail.predictiveAnalysis.confidenceScore}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold">{alertDetail.predictiveAnalysis.confidenceScore}%</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-500">Predicted Failure Time</Label>
                    <p className="font-semibold text-red-600">{alertDetail.predictiveAnalysis.predictedFailureTime}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-500">Risk Factors</Label>
                    <ul className="mt-2 space-y-1">
                      {alertDetail.predictiveAnalysis.riskFactors.map((factor, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                          <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Maintenance Recommendation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Maintenance Recommendation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-3">{alertDetail.maintenanceRecommendation}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>Estimated downtime: {alertDetail.estimatedDowntime}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 