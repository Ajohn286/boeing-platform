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
  Target,
  Plane,
  Wrench,
  Eye,
  Truck,
  BookOpen,
  Cpu,
  Palette
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
      title: "Fleet Availability",
      value: "98.7%",
      change: "+2.1%",
      changeText: "from last month",
      icon: Plane,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      title: "Predictive Alerts",
      value: "156",
      change: "-12",
      changeText: "reduced this week",
      icon: Wrench,
      iconBg: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      title: "Quality Pass Rate",
      value: "99.4%",
      change: "+0.3%",
      changeText: "inspection accuracy",
      icon: Eye,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      title: "Supply Chain Efficiency",
      value: "94.2%",
      change: "+1.8%",
      changeText: "JIT delivery rate",
      icon: Truck,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600"
    }
  ];

  const recentActivities = [
    {
      title: "Engine health alert resolved",
      subtitle: '787-10 engine sensor anomaly • 1 hour ago',
      icon: Wrench,
      iconBg: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      title: "Quality inspection completed",
      subtitle: "Wing assembly batch #737-2024-089 • 3 hours ago",
      icon: Eye,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      title: "Digital twin simulation",
      subtitle: "747-8F structural stress analysis • 5 hours ago",
      icon: Cpu,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600"
    }
  ];

  const systemMetrics = [
    { name: "Predictive Maintenance Accuracy", value: "96.8%", percentage: 96, color: "bg-green-600" },
    { name: "Computer Vision Detection", value: "99.1%", percentage: 99, color: "bg-green-600" },
    { name: "Supply Chain Response Time", value: "2.3hrs", percentage: 88, color: "bg-blue-600" }
  ];

  return (
    <div className="content-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header with Boeing Logo */}
        <div className="mb-8">
          <div className="flex items-center">
            <img
              src="/media/Boeing_logo.png"
              alt="Boeing"
              className="h-10 w-auto mr-6"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Operations Platform</h1>
              <p className="text-lg text-gray-600 mt-2">Comprehensive fleet management and predictive maintenance dashboard</p>
            </div>
          </div>
        </div>

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
                      <span className={`text-sm font-medium ${metric.name === "Memory Usage" ? "text-yellow-600" :
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

        {/* Boeing Operations Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* AI System Health */}
          <Card className="bg-white border-border">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">AI System Health</h3>
            </div>
            <CardContent className="p-6 space-y-4">
              <HealthIndicator status="healthy" label="Predictive Maintenance Engine" />
              <HealthIndicator status="healthy" label="Computer Vision System" />
              <HealthIndicator status="warning" label="Supply Chain AI" />
              <HealthIndicator status="healthy" label="Knowledge Management" />
            </CardContent>
          </Card>

          {/* Processing Status */}
          <Card className="bg-white border-border">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Processing Status</h3>
            </div>
            <CardContent className="p-6 space-y-3">
              <TaskStatus status="completed" label="Engine Health Analysis" />
              <TaskStatus status="in-progress" label="Wing Assembly Inspection" />
              <TaskStatus status="completed" label="Supply Chain Optimization" />
              <TaskStatus status="pending" label="Digital Twin Simulation" />
            </CardContent>
          </Card>

          {/* Top Performing Aircraft Models */}
          <Card className="bg-white border-border">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Fleet Performance (YTD)</h3>
            </div>
            <CardContent className="p-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">787-10</span>
                <span className="text-green-600 font-semibold">99.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">737 MAX 8</span>
                <span className="text-green-600 font-semibold">98.8%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">747-8F</span>
                <span className="text-green-600 font-semibold">97.9%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">777-300ER</span>
                <span className="text-green-600 font-semibold">98.5%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <MetricCard title="Maintenance Efficiency" value="94.2%" change={2.1} trend="up" />
          <MetricCard title="Quality Detection Rate" value="99.1%" change={0.3} trend="up" />
          <MetricCard title="Supply Chain Lead Time" value="2.3hrs" change={-15} trend="down" />
          <MetricCard title="Document Processing" value="96%" change={1.8} trend="up" />
        </div>

        {/* Boeing Alerts */}
        <div className="space-y-4 mt-6">
          <StatusAlert status="success" title="Predictive Maintenance Alert Resolved">
            Engine sensor anomaly on 787-10 successfully addressed, preventing unscheduled downtime.
          </StatusAlert>

          <StatusAlert status="warning" title="Quality Inspection Required">
            Batch #737-2024-089 requires manual review due to computer vision uncertainty.
          </StatusAlert>

          <StatusAlert status="info" title="Supply Chain Optimization">
            AI-optimized delivery schedule reduces lead time by 15% for critical components.
          </StatusAlert>
        </div>

        {/* Use Case Distribution */}
        <Card className="bg-white border-border mt-6">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">AI Use Case Distribution</h3>
          </div>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">Predictive Maintenance</span>
                </div>
                <span className="text-sm font-semibold">35%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Quality Inspection</span>
                </div>
                <span className="text-sm font-semibold">28%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium">Supply Chain Optimization</span>
                </div>
                <span className="text-sm font-semibold">20%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm font-medium">Knowledge Management</span>
                </div>
                <span className="text-sm font-semibold">12%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium">Digital Twins & Design</span>
                </div>
                <span className="text-sm font-semibold">5%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Use Cases Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <Card className="bg-white border-border">
            <div className="px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-foreground">Predictive Maintenance</h3>
              </div>
            </div>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-3">
                AI analyzes sensor data from aircraft components to predict failures before they happen.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Engine Monitoring</span>
                  <span className="text-green-600 font-medium">Active</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Structural Health</span>
                  <span className="text-green-600 font-medium">Active</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Fleet Reliability</span>
                  <span className="text-blue-600 font-medium">98.7%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-border">
            <div className="px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-foreground">Quality Inspection</h3>
              </div>
            </div>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-3">
                AI-driven vision systems inspect parts for defects during manufacturing.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Defect Detection</span>
                  <span className="text-green-600 font-medium">99.1%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Production Speed</span>
                  <span className="text-green-600 font-medium">+25%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Manual Review</span>
                  <span className="text-blue-600 font-medium">-60%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-border">
            <div className="px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-foreground">Supply Chain</h3>
              </div>
            </div>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-3">
                AI forecasts demand and optimizes logistics, parts inventory, and procurement.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>JIT Delivery</span>
                  <span className="text-green-600 font-medium">94.2%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Lead Time</span>
                  <span className="text-green-600 font-medium">-15%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Inventory Cost</span>
                  <span className="text-blue-600 font-medium">-12%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-border">
            <div className="px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold text-foreground">Knowledge Management</h3>
              </div>
            </div>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-3">
                AI parses engineering documents, manuals, and compliance requirements.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Document Processing</span>
                  <span className="text-green-600 font-medium">96%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Review Speed</span>
                  <span className="text-green-600 font-medium">+40%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Compliance Rate</span>
                  <span className="text-blue-600 font-medium">99.8%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-border">
            <div className="px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-foreground">Digital Twins</h3>
              </div>
            </div>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-3">
                AI-powered digital twins simulate aircraft lifecycle and performance.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Real-time Monitoring</span>
                  <span className="text-green-600 font-medium">Active</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Performance Testing</span>
                  <span className="text-green-600 font-medium">Active</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Predictive Analytics</span>
                  <span className="text-blue-600 font-medium">95%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-border">
            <div className="px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-pink-600" />
                <h3 className="text-lg font-semibold text-foreground">Design Optimization</h3>
              </div>
            </div>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-3">
                AI generates lightweight and efficient designs for aircraft components.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Weight Reduction</span>
                  <span className="text-green-600 font-medium">-8%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Fuel Efficiency</span>
                  <span className="text-green-600 font-medium">+12%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Material Usage</span>
                  <span className="text-blue-600 font-medium">-15%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
