import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ArrowLeft, 
  Bot, 
  Eye, 
  Shield, 
  FileText, 
  Zap, 
  Search,
  CheckCircle,
  Users,
  Wrench,
  Brain,
  Activity,
  Database,
  Gauge,
  AlertTriangle,
  BarChart3,
  Settings
} from "lucide-react";
import logoPath from "@/assets/Logo Black_1751208089436.png";

interface AIAgent {
  id: string;
  name: string;
  specialty: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  recommended: boolean;
  capabilities: string[];
}

const availableAgents: AIAgent[] = [
  {
    id: "predictive-analysis",
    name: "Predictive Analysis Agent",
    specialty: "Failure Prediction",
    description: "Analyzes sensor data patterns and historical maintenance records to predict component failures and optimal maintenance timing",
    icon: Brain,
    recommended: true,
    capabilities: ["Failure Prediction", "Pattern Recognition", "Maintenance Optimization"]
  },
  {
    id: "sensor-monitoring",
    name: "Sensor Monitoring Agent", 
    specialty: "Real-time Monitoring",
    description: "Continuously monitors aircraft sensor data including vibration, temperature, and acoustic signatures for anomaly detection",
    icon: Activity,
    recommended: true,
    capabilities: ["Real-time Monitoring", "Anomaly Detection", "Sensor Data Analysis"]
  },
  {
    id: "maintenance-scheduler",
    name: "Maintenance Scheduler Agent",
    specialty: "Scheduling & Planning",
    description: "Optimizes maintenance schedules based on aircraft availability, parts inventory, and maintenance bay capacity",
    icon: Settings,
    recommended: true,
    capabilities: ["Schedule Optimization", "Resource Planning", "Capacity Management"]
  },
  {
    id: "component-diagnostics",
    name: "Component Diagnostics Agent",
    specialty: "Component Analysis",
    description: "Performs deep analysis of specific aircraft components using engineering models and failure mode analysis",
    icon: Wrench,
    recommended: true,
    capabilities: ["Component Analysis", "Failure Mode Analysis", "Engineering Diagnostics"]
  },
  {
    id: "risk-assessment",
    name: "Risk Assessment Agent",
    specialty: "Safety & Risk",
    description: "Evaluates safety risks and determines criticality levels for maintenance alerts and aircraft grounding decisions",
    icon: AlertTriangle,
    recommended: true,
    capabilities: ["Risk Evaluation", "Safety Assessment", "Criticality Analysis"]
  },
  {
    id: "regulatory-compliance",
    name: "Regulatory Compliance Agent",
    specialty: "Compliance & Standards",
    description: "Ensures maintenance decisions comply with FAA, EASA, and Airbus maintenance regulations and procedures",
    icon: Shield,
    recommended: false,
    capabilities: ["Regulatory Compliance", "Documentation Review", "Standards Verification"]
  },
  {
    id: "data-analytics",
    name: "Data Analytics Agent",
    specialty: "Data Processing",
    description: "Processes large volumes of maintenance data to identify trends, correlations, and optimization opportunities",
    icon: BarChart3,
    recommended: false,
    capabilities: ["Data Processing", "Trend Analysis", "Statistical Modeling"]
  },
  {
    id: "quality-assurance",
    name: "Quality Assurance Agent",
    specialty: "Quality Control",
    description: "Reviews maintenance procedures and outcomes to ensure quality standards and best practices are maintained",
    icon: CheckCircle,
    recommended: false,
    capabilities: ["Quality Control", "Procedure Review", "Best Practices"]
  }
];

export default function AgenticAgentMobilization() {
  const [, setLocation] = useLocation();
  const [selectedAgents, setSelectedAgents] = useState<string[]>([
    "predictive-analysis",
    "sensor-monitoring", 
    "maintenance-scheduler",
    "component-diagnostics",
    "risk-assessment"
  ]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAgentToggle = (agentId: string) => {
    setSelectedAgents(prev => 
      prev.includes(agentId) 
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    );
  };

  const handleLaunchTeam = () => {
    setLocation("/agentic-splash");
  };

  const handleBackToDetail = () => {
    setLocation("/agentic-claim-detail/AIR-A320-4512");
  };

  const filteredAgents = availableAgents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedAgentDetails = availableAgents.filter(agent => 
    selectedAgents.includes(agent.id)
  );

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
                onClick={handleBackToDetail}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Alert
              </Button>
              <img 
                src={logoPath} 
                alt="Invisible Logo" 
                className="h-8 w-auto"
              />
              <div className="ml-6">
                <h1 className="text-2xl font-bold text-gray-900">AI Agent Mobilization</h1>
                <p className="text-sm text-gray-500">Select AI agents for maintenance analysis</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Users className="h-4 w-4" />
                <span>{selectedAgents.length} Agents Selected</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Agent Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Available AI Agents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search agents by name, specialty, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="space-y-4">
                  {filteredAgents.map((agent) => {
                    const IconComponent = agent.icon;
                    const isSelected = selectedAgents.includes(agent.id);
                    
                    return (
                      <Card 
                        key={agent.id} 
                        className={`cursor-pointer transition-all duration-200 ${
                          isSelected 
                            ? 'ring-2 ring-blue-500 bg-blue-50' 
                            : 'hover:shadow-md'
                        }`}
                        onClick={() => handleAgentToggle(agent.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg flex-shrink-0">
                              <IconComponent className="h-6 w-6 text-blue-600" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                    {agent.name}
                                    {agent.recommended && (
                                      <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                                        Recommended
                                      </Badge>
                                    )}
                                  </h3>
                                  <p className="text-sm font-medium text-blue-600">{agent.specialty}</p>
                                </div>
                                
                                <Checkbox 
                                  checked={isSelected}
                                  onChange={() => handleAgentToggle(agent.id)}
                                  className="ml-4"
                                />
                              </div>
                              
                              <p className="text-sm text-gray-600 mb-3">{agent.description}</p>
                              
                              <div className="flex flex-wrap gap-1">
                                {agent.capabilities.map((capability, index) => (
                                  <Badge 
                                    key={index} 
                                    variant="outline" 
                                    className="text-xs bg-gray-50"
                                  >
                                    {capability}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Team Summary */}
          <div className="space-y-6">
            {/* Selected Team */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Selected Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedAgentDetails.length > 0 ? (
                  <div className="space-y-3">
                    {selectedAgentDetails.map((agent) => {
                      const IconComponent = agent.icon;
                      return (
                        <div key={agent.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
                            <IconComponent className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-gray-900 truncate">{agent.name}</p>
                            <p className="text-xs text-gray-500 truncate">{agent.specialty}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No agents selected</p>
                    <p className="text-sm text-gray-400">Select agents to build your AI team</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Team Capabilities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Team Capabilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedAgentDetails.length > 0 ? (
                  <div className="space-y-2">
                    {Array.from(new Set(selectedAgentDetails.flatMap(agent => agent.capabilities))).map((capability, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-gray-700">{capability}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Select agents to see team capabilities</p>
                )}
              </CardContent>
            </Card>

            {/* Launch Team */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Ready to Launch
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  You are mobilizing {selectedAgents.length} AI agents to analyze the maintenance alert and provide comprehensive recommendations.
                </p>
                
                <Button 
                  onClick={handleLaunchTeam}
                  disabled={selectedAgents.length === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
                >
                  <Bot className="h-4 w-4 mr-2" />
                  Launch Processing Team
                </Button>
                
                {selectedAgents.length === 0 && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Select at least one agent to continue
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 