import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  Clock,
  AlertTriangle,
  CheckCircle,
  Plane,
  MapPin,
  Calendar,
  Users,
  Activity,
  Filter,
  Search
} from "lucide-react";
import logoPath from "@/assets/invisible-primary-logo-lockup-white-rgb-72ppi (1).png";

interface MaintenanceAlert {
  id: string;
  aircraftId: string;
  aircraftType: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  detectionDate: string;
  detectionTime: string;
  location: string;
  status: 'new' | 'in-review' | 'assigned' | 'resolved';
  description: string;
  estimatedDowntime: string;
}

const mockAlerts: MaintenanceAlert[] = [
  {
    id: "AIR-737-4512",
    aircraftId: "737-700",
    aircraftType: "Boeing 737-700",
    priority: "critical",
    detectionDate: "2025-01-15",
    detectionTime: "14:30",
    location: "CDG Airport, Paris",
    status: "new",
    description: "Landing gear strut crack detected - 4.5cm structural anomaly requiring immediate attention",
    estimatedDowntime: "8 hours"
  },
  {
    id: "AIR-737-4513",
    aircraftId: "737-600",
    aircraftType: "Boeing 737-600",
    priority: "high",
    detectionDate: "2025-01-15",
    detectionTime: "12:15",
    location: "JFK Airport, New York",
    status: "in-review",
    description: "Hydraulic system pressure deviation - sensor data indicates potential fluid leak",
    estimatedDowntime: "4 hours"
  },
  {
    id: "AIR-737-4514",
    aircraftId: "737-700",
    aircraftType: "Boeing 737-700",
    priority: "medium",
    detectionDate: "2025-01-15",
    detectionTime: "10:45",
    location: "LAX Airport, Los Angeles",
    status: "assigned",
    description: "Engine vibration analysis - minor anomaly detected in compressor section",
    estimatedDowntime: "2 hours"
  }
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critical': return 'bg-red-100 text-red-800 border-red-200';
    case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'in-review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'assigned': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function AgenticClaimQueue() {
  const [, setLocation] = useLocation();
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAlerts = mockAlerts.filter(alert => {
    const matchesPriority = selectedPriority === 'all' || alert.priority === selectedPriority;
    const matchesSearch = alert.aircraftId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPriority && matchesSearch;
  });

  const handleAlertClick = (alertId: string) => {
    setLocation(`/agentic-claim-detail/${alertId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <img
                src={logoPath}
                alt="Invisible Logo"
                className="h-8 w-auto"
              />
              <div className="ml-6">
                <h1 className="text-2xl font-bold text-gray-900">Maintenance Alert Queue</h1>
                <p className="text-sm text-gray-500">AI-Powered Aircraft Predictive Maintenance</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Activity className="h-4 w-4" />
                <span>3 Active Alerts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search aircraft ID or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant={selectedPriority === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPriority('all')}
            >
              All
            </Button>
            <Button
              variant={selectedPriority === 'critical' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPriority('critical')}
              className="border-red-200 text-red-700 hover:bg-red-50"
            >
              Critical
            </Button>
            <Button
              variant={selectedPriority === 'high' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPriority('high')}
              className="border-orange-200 text-orange-700 hover:bg-orange-50"
            >
              High
            </Button>
            <Button
              variant={selectedPriority === 'medium' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPriority('medium')}
              className="border-yellow-200 text-yellow-700 hover:bg-yellow-50"
            >
              Medium
            </Button>
          </div>
        </div>

        {/* Alerts Grid */}
        <div className="grid gap-6">
          {filteredAlerts.map((alert) => (
            <Card
              key={alert.id}
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-red-500"
              onClick={() => handleAlertClick(alert.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {alert.aircraftId}
                      </CardTitle>
                      <Badge className={getPriorityColor(alert.priority)}>
                        {alert.priority.charAt(0).toUpperCase() + alert.priority.slice(1)}
                      </Badge>
                      <Badge className={getStatusColor(alert.status)}>
                        {alert.status.replace('-', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Plane className="h-4 w-4" />
                        <span>{alert.aircraftType}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{alert.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{alert.detectionDate} at {alert.detectionTime}</span>
                      </div>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-gray-700 mb-3">{alert.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>Estimated downtime: {alert.estimatedDowntime}</span>
                  </div>

                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Review Alert
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAlerts.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
} 