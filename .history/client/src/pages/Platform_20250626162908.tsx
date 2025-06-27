import { Card, CardContent } from "@/components/ui/card";
import { 
  TrendingUp, 
  Database, 
  Brain, 
  Clock,
  Plus,
  CheckCircle,
  Bot,
  DollarSign,
  Users,
  FileText,
  BarChart3,
  Briefcase,
  Target
} from "lucide-react";
import { 
  StatusBadge, 
  StatusAlert, 
  HealthIndicator, 
  TaskStatus, 
  MetricCard 
} from "@/components/StatusComponents";

export default function Platform() {
  const statsCards = [
    {
      title: "Portfolio Value",
      value: "$2.4B",
      change: "+8.2%",
      changeText: "from last quarter",
      icon: DollarSign,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600"
    },
    {
      title: "Active Managers", 
      value: "47",
      change: "+3",
      changeText: "new this quarter",
      icon: Users,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      title: "Document Processing",
      value: "1,248", 
      change: "+12%",
      changeText: "reports processed",
      icon: FileText,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      title: "System Uptime",
      value: "99.9%",
      change: "+0.1%", 
      changeText: "from last month",
      icon: Clock,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600"
    }
  ];

  const recentActivities = [
    {
      title: "Manager report processed",
      subtitle: 'Sequoia Capital Q4 2024 update • 2 hours ago',
      icon: FileText,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      title: "Portfolio analysis completed",
      subtitle: "Private equity performance review • 4 hours ago",
      icon: CheckCircle,
      iconBg: "bg-green-100", 
      iconColor: "text-green-600"
    },
    {
      title: "New manager onboarded",
      subtitle: "Bain Capital Ventures • 6 hours ago",
      icon: Plus,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600"
    }
  ];

  const systemMetrics = [
    { name: "Document Processing", value: "95%", percentage: 95, color: "bg-green-600" },
    { name: "Data Extraction Accuracy", value: "98.7%", percentage: 98, color: "bg-green-600" },
    { name: "Query Response Time", value: "180ms", percentage: 85, color: "bg-blue-600" }
  ];

  return (
    <div className="content-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card key={index} className="bg-white border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {card.title}
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {card.value}
                      </p>
                    </div>
                    <div className={`w-12 h-12 ${card.iconBg} rounded-lg flex items-center justify-center`}>
                      <Icon className={`${card.iconColor} h-6 w-6`} />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-success font-medium">
                      {card.change}
                    </span>
                    <span className="text-muted-foreground ml-1">
                      {card.changeText}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Recent Activity and System Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white border-border">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`w-8 h-8 ${activity.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`${activity.iconColor} h-4 w-4`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {activity.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.subtitle}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-border">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">System Health</h3>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                {systemMetrics.map((metric, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        {metric.name}
                      </span>
                      <span className={`text-sm font-medium ${
                        metric.name === "Memory Usage" ? "text-yellow-600" : 
                        metric.name === "API Response Time" ? "text-green-600" : "text-blue-600"
                      }`}>
                        {metric.value}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className={`${metric.color} h-2 rounded-full`}
                        style={{ width: `${metric.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Investment Operations Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Data Pipeline Health */}
          <Card className="bg-white border-border">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Data Pipeline Health</h3>
            </div>
            <CardContent className="p-6 space-y-4">
              <HealthIndicator status="healthy" label="Document OCR Service" />
              <HealthIndicator status="healthy" label="Data Extraction Engine" />
              <HealthIndicator status="warning" label="Manager API Gateway" />
              <HealthIndicator status="healthy" label="Portfolio Database" />
            </CardContent>
          </Card>

          {/* Processing Status */}
          <Card className="bg-white border-border">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Processing Status</h3>
            </div>
            <CardContent className="p-6 space-y-3">
              <TaskStatus status="completed" label="Q4 Manager Reports" />
              <TaskStatus status="in-progress" label="PE Performance Analysis" />
              <TaskStatus status="completed" label="ESG Compliance Review" />
              <TaskStatus status="pending" label="Board Report Generation" />
            </CardContent>
          </Card>

          {/* Top Performing Managers */}
          <Card className="bg-white border-border">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Top Performers (YTD)</h3>
            </div>
            <CardContent className="p-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Sequoia Capital</span>
                <span className="text-green-600 font-semibold">+24.7%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Bain Capital</span>
                <span className="text-green-600 font-semibold">+18.3%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">General Atlantic</span>
                <span className="text-green-600 font-semibold">+16.9%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">TPG Capital</span>
                <span className="text-green-600 font-semibold">+15.2%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <MetricCard title="Portfolio IRR" value="18.4%" change={2.1} trend="up" />
          <MetricCard title="Document Accuracy" value="98.7%" change={0.3} trend="up" />
          <MetricCard title="Processing Speed" value="3.2min" change={-15} trend="down" />
          <MetricCard title="ESG Compliance" value="94%" change={1.8} trend="up" />
        </div>

        {/* Investment Alerts */}
        <div className="space-y-4 mt-6">
          <StatusAlert status="success" title="Manager Report Processing Complete">
            Q4 2024 reports from 47 managers successfully processed and analyzed.
          </StatusAlert>
          
          <StatusAlert status="warning" title="ESG Compliance Review Required">
            3 portfolio companies require updated ESG documentation for regulatory compliance.
          </StatusAlert>
          
          <StatusAlert status="info" title="New Investment Opportunity">
            AI-powered biotech startup identified matching Harvard's strategic criteria.
          </StatusAlert>
        </div>

        {/* Asset Class Distribution */}
        <Card className="bg-white border-border mt-6">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Asset Class Distribution</h3>
          </div>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">Private Equity</span>
                </div>
                <span className="text-sm font-semibold">42%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Venture Capital</span>
                </div>
                <span className="text-sm font-semibold">28%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium">Real Estate</span>
                </div>
                <span className="text-sm font-semibold">18%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm font-medium">Hedge Funds</span>
                </div>
                <span className="text-sm font-semibold">12%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
