import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Database, 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText, 
  ExternalLink,
  Activity,
  Globe,
  Server
} from "lucide-react";


export default function DataEnvironment() {
  const dataSources = [
    {
      name: "Portfolio Database",
      type: "Primary",
      status: "Active",
      records: "2.4M",
      icon: Database,
      color: "bg-blue-100 text-blue-700"
    },
    {
      name: "Manager Reports",
      type: "Documents",
      status: "Syncing",
      records: "1,847",
      icon: FileText,
      color: "bg-green-100 text-green-700"
    },
    {
      name: "Market Data Feed",
      type: "Real-time",
      status: "Active",
      records: "Live",
      icon: TrendingUp,
      color: "bg-purple-100 text-purple-700"
    },
    {
      name: "ESG Analytics",
      type: "External",
      status: "Active",
      records: "15K",
      icon: Globe,
      color: "bg-emerald-100 text-emerald-700"
    }
  ];

  const integrations = [
    { name: "Bloomberg Terminal", status: "Connected", icon: Server },
    { name: "PitchBook Data", status: "Connected", icon: BarChart3 },
    { name: "MSCI ESG Research", status: "Connected", icon: Activity },
    { name: "Refinitiv Workspace", status: "Connected", icon: Database }
  ];

  return (
    <div className="content-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Data Environment</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Unified data platform for wealth management analytics and visualization
          </p>
        </div>

        {/* Data Sources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dataSources.map((source, index) => {
            const Icon = source.icon;
            return (
              <Card key={index} className="bg-white dark:bg-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{source.name}</CardTitle>
                  <div className={`p-2 rounded-full ${source.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{source.records}</div>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant={source.status === "Active" ? "default" : "secondary"}>
                      {source.status}
                    </Badge>
                    <span className="text-xs text-gray-500">{source.type}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Harvard Wealth Management Visualization - Full Width */}
        <Card className="mb-8 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Harvard Wealth Management Data Visualization</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Interactive data exploration and analysis platform
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open('https://harvard-wealth-management-bav37zs66-invisible-prototypes.vercel.app/visualize', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Full View
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="w-full h-[800px] border rounded-lg overflow-hidden bg-white dark:bg-gray-900">
              <iframe
                src="https://harvard-wealth-management-bav37zs66-invisible-prototypes.vercel.app/visualize"
                className="w-full h-full border-0"
                title="Harvard Wealth Management Data Visualization"
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Integrations */}
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Active Integrations</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              External data sources and APIs
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {integrations.map((integration, index) => {
                const Icon = integration.icon;
                return (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 text-blue-700 rounded-full">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{integration.name}</div>
                        <div className="text-xs text-gray-500">{integration.status}</div>
                      </div>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Data Pipeline Status */}
        <Card className="mt-8 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Data Pipeline Status</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Real-time monitoring of data flows and processing
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">99.7%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">2.3TB</div>
                <div className="text-sm text-gray-600">Data Processed Today</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600">14ms</div>
                <div className="text-sm text-gray-600">Avg Response Time</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}