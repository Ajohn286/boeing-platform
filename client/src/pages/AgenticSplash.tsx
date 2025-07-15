import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Bot, 
  Plane, 
  Activity, 
  Shield, 
  Zap,
  CheckCircle,
  ArrowRight
} from "lucide-react";
// Logo now served from public/media directory
const logoPath = "/media/logo.png";

export default function AgenticSplash() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    {
      icon: Plane,
      title: "Aircraft Maintenance Alert Detected",
      description: "AI system has identified a critical maintenance issue requiring immediate attention",
      color: "text-blue-600"
    },
    {
      icon: Activity,
      title: "Multi-Modal Analysis Initiated",
      description: "Processing video, audio, sensor data, and documentation for comprehensive assessment",
      color: "text-green-600"
    },
    {
      icon: Bot,
      title: "AI Agent Team Assembled",
      description: "Specialized agents mobilized for predictive analysis, risk assessment, and compliance review",
      color: "text-purple-600"
    },
    {
      icon: Shield,
      title: "Safety Protocols Activated",
      description: "Regulatory compliance and safety standards verification in progress",
      color: "text-orange-600"
    },
    {
      icon: CheckCircle,
      title: "Ready for Analysis",
      description: "All systems prepared for real-time maintenance decision support",
      color: "text-green-600"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  const handleStartAnalysis = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLocation("/agentic-dashboard");
    }, 1000);
  };

  const handleSkipToQueue = () => {
    setLocation("/agentic-claim-queue");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img 
              src={logoPath} 
              alt="Invisible Logo" 
              className="h-12 w-auto"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Aircraft Predictive Maintenance
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Advanced multi-agent system for real-time maintenance analysis and decision support
          </p>
        </div>

        {/* Progress Steps */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="space-y-6">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                
                return (
                  <div 
                    key={index}
                    className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-500 ${
                      isActive 
                        ? 'bg-blue-50 border-2 border-blue-200' 
                        : isCompleted 
                          ? 'bg-green-50 border-2 border-green-200'
                          : 'bg-gray-50 border-2 border-gray-200'
                    }`}
                  >
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                      isActive 
                        ? 'bg-blue-100' 
                        : isCompleted 
                          ? 'bg-green-100'
                          : 'bg-gray-100'
                    }`}>
                      <IconComponent className={`h-6 w-6 ${
                        isActive 
                          ? 'text-blue-600' 
                          : isCompleted 
                            ? 'text-green-600'
                            : 'text-gray-400'
                      }`} />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={`font-semibold text-lg ${
                        isActive 
                          ? 'text-blue-900' 
                          : isCompleted 
                            ? 'text-green-900'
                            : 'text-gray-500'
                      }`}>
                        {step.title}
                      </h3>
                      <p className={`text-sm ${
                        isActive 
                          ? 'text-blue-700' 
                          : isCompleted 
                            ? 'text-green-700'
                            : 'text-gray-400'
                      }`}>
                        {step.description}
                      </p>
                    </div>
                    
                    {isCompleted && (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleStartAnalysis}
            disabled={currentStep < steps.length - 1 || isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg disabled:bg-gray-300"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Launching Analysis...
              </>
            ) : (
              <>
                <Zap className="h-5 w-5 mr-2" />
                Launch Analysis Dashboard
                <ArrowRight className="h-5 w-5 ml-2" />
              </>
            )}
          </Button>
          
          <Button
            onClick={handleSkipToQueue}
            variant="outline"
            className="px-8 py-3 text-lg"
          >
            Skip to Alert Queue
          </Button>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-12">
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Plane className="h-4 w-4" />
              <span>Airbus A220 Maintenance</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span>Real-time Monitoring</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Safety Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 