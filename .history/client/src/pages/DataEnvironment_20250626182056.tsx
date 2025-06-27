import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Database, 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText, 
  ExternalLink,
  Activity,
  Globe,
  Server,
  Shield,
  Zap,
  Target,
  CheckCircle,
  AlertTriangle,
  Clock,
  Filter,
  Layers,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Download,
  Upload,
  RefreshCw,
  Settings,
  Eye,
  Code,
  BookOpen
} from "lucide-react";
import { useState } from "react";

export default function DataEnvironment() {
  const [activeLayer, setActiveLayer] = useState("overview");
  const [expandedTables, setExpandedTables] = useState<string[]>([]);

  const dataSources = [
    {
      name: "FAA AVIATOR System",
      description: "Aviation workforce credentialing and training records",
      records: "45,231",
      status: "Healthy"
    },
    {
      name: "Air Traffic Skills Assessment (ATSA)",
      description: "Assessment results and candidate tracking for air traffic controllers",
      records: "12,890",
      status: "Healthy"
    },
    {
      name: "ATC Sector DB",
      description: "Air Traffic Control Sectors Data",
      records: "23,456",
      status: "Healthy"
    },
    {
      name: "NTSB: Airspace data",
      description: "Airspace data",
      records: "15,432",
      status: "Healthy"
    },
    {
      name: "NTSB: Near Misses and collisions",
      description: "Near Misses and collisions",
      records: "9,823",
      status: "Needs Attention"
    },
    {
      name: "NTSB: Highway Safety Data",
      description: "Highway Safety Data",
      records: "34,567",
      status: "Healthy"
    },
    {
      name: "FAA Acquisition Management System (AMS)",
      description: "Centralized procurement and contract management for FAA operations",
      records: "234,567",
      status: "Healthy"
    },
    {
      name: "Proposal Management System (PMS)",
      description: "Announced, created and funded proposals",
      records: "11,234",
      status: "Healthy"
    },
    {
      name: "System for Award Management (SAM)",
      description: "Federal vendor registration and eligibility verification",
      records: "982,345",
      status: "Needs Attention"
    },
    {
      name: "SBIR Portal",
      description: "Small Business Innovation Research program management and submissions",
      records: "15,432",
      status: "Healthy"
    },
    {
      name: "NHTSA Acquisition Management System (NAMS)",
      description: "Centralized procurement and contract management",
      records: "22,345",
      status: "Healthy"
    },
    {
      name: "Continental Road Maintenance Data (CRMD)",
      description: "Data covering road maintenance",
      records: "34,567",
      status: "Healthy"
    },
    {
      name: "Highway Performance Monitoring System (HPMS)",
      description: "National highway data collection and performance metrics",
      records: "345,678",
      status: "Healthy"
    },
    {
      name: "NHTSA",
      description: "Highway traffic data (for DOT extension)",
      records: "45,678",
      status: "Healthy"
    },
    {
      name: "National Rail Acquisition Management System (NRAMS)",
      description: "Centralized procurement and contract management",
      records: "33,456",
      status: "Healthy"
    }
  ];

  const medallionLayers = [
    {
      name: "Bronze",
      color: "#FF9800",
      bg: "bg-orange-50",
      border: "border-orange-200",
      header: "text-orange-700",
      progress: 92,
      issues: 26458,
      resolved: 24531,
      rules: [
        { label: "Timeliness Check", type: "System", status: "Active" },
        { label: "Completeness Validation", type: "System", status: "Active" },
        { label: "File Format Check", type: "System", status: "Active" },
        { label: "Schema Validation", type: "System", status: "In Progress" }
      ],
      records: "8.2M",
      batchTime: "42 min"
    },
    {
      name: "Silver",
      color: "#757575",
      bg: "bg-gray-50",
      border: "border-gray-200",
      header: "text-gray-700",
      progress: 78,
      issues: 14329,
      resolved: 12984,
      rules: [
        { label: "Name Standardization", type: "Business", status: "Active" },
        { label: "Address Validation", type: "Business", status: "Active" },
        { label: "Policy Date Format Check", type: "Business", status: "Active" },
        { label: "Customer ID Validation", type: "Business", status: "In Progress" },
        { label: "Email Format Validation", type: "Business", status: "Active" },
        { label: "Gender Code Standardization", type: "Business", status: "In Progress" },
        { label: "Claim Amount Range Check", type: "Business", status: "Active" },
        { label: "Duplicate Detection", type: "System", status: "In Progress" }
      ],
      records: "7.9M",
      batchTime: "1h 15min"
    },
    {
      name: "Gold",
      color: "#FFD600",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      header: "text-yellow-700",
      progress: 84,
      issues: 4892,
      resolved: 4518,
      rules: [
        { label: "Customer Golden Record", type: "Business", status: "Active" },
        { label: "Policy Master Record", type: "Business", status: "Active" },
        { label: "Claims Consolidated View", type: "Business", status: "In Progress" },
        { label: "Cross-system Record Linking", type: "System", status: "In Progress" }
      ],
      records: "7.8M",
      batchTime: "55 min"
    }
  ];

  const bronzeTables = [
    { name: "customer_raw", records: 1250000, quality: 75, lastUpdated: "2 hours ago" },
    { name: "orders_raw", records: 890000, quality: 82, lastUpdated: "1 hour ago" },
    { name: "products_raw", records: 45000, quality: 91, lastUpdated: "30 minutes ago" },
    { name: "transactions_raw", records: 2100000, quality: 78, lastUpdated: "45 minutes ago" }
  ];

  const silverTables = [
    { name: "customers_cleansed", records: 1180000, quality: 92, lastUpdated: "1 hour ago" },
    { name: "orders_validated", records: 845000, quality: 95, lastUpdated: "45 minutes ago" },
    { name: "products_catalog", records: 42000, quality: 98, lastUpdated: "15 minutes ago" },
    { name: "transactions_processed", records: 1980000, quality: 89, lastUpdated: "30 minutes ago" }
  ];

  const goldTables = [
    { name: "customer_analytics", records: 850000, quality: 98, lastUpdated: "30 minutes ago" },
    { name: "sales_performance", records: 650000, quality: 99, lastUpdated: "20 minutes ago" },
    { name: "product_insights", records: 35000, quality: 100, lastUpdated: "10 minutes ago" },
    { name: "financial_summary", records: 1200000, quality: 98, lastUpdated: "15 minutes ago" }
  ];

  const dataQualityMetrics = [
    { metric: "Completeness", bronze: 78, silver: 92, gold: 98 },
    { metric: "Accuracy", bronze: 75, silver: 89, gold: 97 },
    { metric: "Consistency", bronze: 82, silver: 94, gold: 99 },
    { metric: "Timeliness", bronze: 85, silver: 91, gold: 96 }
  ];

  const toggleTableExpansion = (tableName: string) => {
    setExpandedTables(prev => 
      prev.includes(tableName) 
        ? prev.filter(name => name !== tableName)
        : [...prev, tableName]
    );
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 95) return "text-green-600";
    if (quality >= 85) return "text-yellow-600";
    return "text-red-600";
  };

  const statusColor = (status: string) =>
    status === "Healthy"
      ? "bg-green-100 text-green-800"
      : "bg-orange-100 text-orange-800";

  const statusBadge = (status: string) =>
    status === "Active"
      ? "bg-green-100 text-green-800"
      : "bg-orange-100 text-orange-800";

  const progressBarColor = (layer: string) => {
    if (layer === "Bronze") return "bg-orange-400";
    if (layer === "Silver") return "bg-blue-500";
    if (layer === "Gold") return "bg-yellow-400";
    return "bg-gray-300";
  };

  return (
    <div className="content-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Data Platform</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Comprehensive data platform with Medallion architecture for data quality and governance
          </p>
        </div>

        {/* Data Sources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {dataSources.map((source, index) => {
            const Icon = FileText;
            return (
              <Card key={index} className="bg-white dark:bg-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{source.name}</CardTitle>
                  <div className={`p-2 rounded-full ${statusColor(source.status)}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{source.records}</div>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant={source.status === "Healthy" ? "default" : "secondary"}>
                      {source.status}
                    </Badge>
                    <span className="text-xs text-gray-500">{source.description}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Medallion Architecture Overview */}
        <Card className="mb-8 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Medallion Architecture Overview
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Data flows through three layers: Bronze (raw structured), Silver (cleansed), and Gold (curated)
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {medallionLayers.map((layer, index) => (
                <div key={layer.name} className="text-center p-6 border rounded-lg">
                  <div className={`inline-flex p-3 rounded-full ${layer.color} mb-4`}>
                    <Database className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{layer.name} Layer</h3>
                  <p className="text-sm text-gray-600 mb-4">{layer.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Tables:</span>
                      <span className="font-medium">{layer.tables}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Records:</span>
                      <span className="font-medium">{layer.records}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Quality:</span>
                      <span className={`font-medium ${getQualityColor(layer.quality)}`}>
                        {layer.quality}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data Quality Pipeline */}
        <Card className="mb-8 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Data Quality Pipeline
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Automated validation, cleansing, and governance across all data layers
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Quality Metric</th>
                    <th className="text-center py-2">Bronze</th>
                    <th className="text-center py-2">Silver</th>
                    <th className="text-center py-2">Gold</th>
                  </tr>
                </thead>
                <tbody>
                  {dataQualityMetrics.map((metric) => (
                    <tr key={metric.metric} className="border-b">
                      <td className="py-2 font-medium">{metric.metric}</td>
                      <td className="text-center py-2">
                        <span className={`font-medium ${getQualityColor(metric.bronze)}`}>
                          {metric.bronze}%
                        </span>
                      </td>
                      <td className="text-center py-2">
                        <span className={`font-medium ${getQualityColor(metric.silver)}`}>
                          {metric.silver}%
                        </span>
                      </td>
                      <td className="text-center py-2">
                        <span className={`font-medium ${getQualityColor(metric.gold)}`}>
                          {metric.gold}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Layer Details Tabs */}
        <Tabs value={activeLayer} onValueChange={setActiveLayer} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bronze">Bronze Layer</TabsTrigger>
            <TabsTrigger value="silver">Silver Layer</TabsTrigger>
            <TabsTrigger value="gold">Gold Layer</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <h2 className="text-2xl font-bold mb-6">Data Quality Pipeline</h2>
            <div className="mb-2 text-gray-600">
              Automated data processing and quality management across bronze, silver, and gold data layers
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {medallionLayers.map((layer) => (
                <div
                  key={layer.name}
                  className={`rounded-xl border ${layer.border} ${layer.bg} flex flex-col shadow-sm`}
                >
                  <div className="flex items-center justify-between px-5 pt-5 pb-2">
                    <div className={`font-bold text-lg ${layer.header}`}>{layer.name}</div>
                    <button className="flex items-center gap-1 text-xs font-medium border rounded px-2 py-1 border-gray-300 bg-white hover:bg-gray-50">
                      Quality Details <RefreshCw className="h-3 w-3 ml-1" />
                    </button>
                  </div>
                  <div className="px-5 pt-2">
                    <div className="text-xs font-medium text-gray-600 mb-1">Data Processing Status</div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1 h-2 rounded bg-gray-200 overflow-hidden">
                        <div
                          className={`h-2 rounded ${progressBarColor(layer.name)}`}
                          style={{ width: `${layer.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-700">{layer.progress}%</span>
                    </div>
                    <div className="flex justify-between text-xs mb-4">
                      <span className="text-gray-500">Issues: <span className="font-semibold text-gray-700">{layer.issues.toLocaleString()}</span></span>
                      <span className="text-green-700">Resolved: <span className="font-semibold">{layer.resolved.toLocaleString()}</span></span>
                    </div>
                  </div>
                  <div className="px-5 pb-2">
                    <div className="font-semibold text-sm mb-2">
                      {layer.name === "Bronze" && "Data Quality Rules"}
                      {layer.name === "Silver" && "Business Data Quality Rules"}
                      {layer.name === "Gold" && "MDM Match & Merge Process"}
                    </div>
                    <ul className="mb-4 space-y-2">
                      {layer.rules.map((rule) => (
                        <li key={rule.label} className="flex items-center gap-2 text-sm">
                          {rule.status === "Active" ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <RefreshCw className="h-4 w-4 text-orange-500 animate-spin-slow" />
                          )}
                          <span className="font-medium">{rule.label}</span>
                          <span className="text-xs text-gray-500">{rule.type}</span>
                          <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-semibold ${statusBadge(rule.status)}`}>{rule.status}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-between items-center px-5 pb-5 mt-auto text-xs text-gray-700 border-t pt-3">
                    <div>
                      <div className="font-semibold">Records</div>
                      <div>{layer.records}</div>
                    </div>
                    <div>
                      <div className="font-semibold">Batch Processing Time</div>
                      <div>{layer.batchTime}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bronze" className="mt-6">
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-orange-100 text-orange-700 rounded-full">
                    <Database className="h-4 w-4" />
                  </div>
                  Bronze Layer - Structured Data
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Raw data is parsed into standardized, readable formats with basic validation and schema enforcement
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bronzeTables.map((table) => (
                    <div key={table.name} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleTableExpansion(table.name)}
                          >
                            {expandedTables.includes(table.name) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                          <div>
                            <h4 className="font-medium">{table.name}</h4>
                            <p className="text-sm text-gray-500">
                              {table.records.toLocaleString()} records • Updated {table.lastUpdated}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getQualityColor(table.quality)}>
                            {table.quality}% quality
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {expandedTables.includes(table.name) && (
                        <div className="mt-4 pl-8">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Schema:</span> Structured JSON
                            </div>
                            <div>
                              <span className="font-medium">Validation:</span> Basic format check
                            </div>
                            <div>
                              <span className="font-medium">Lineage:</span> Source tracked
                            </div>
                            <div>
                              <span className="font-medium">Status:</span> Active ingestion
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="silver" className="mt-6">
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-gray-100 text-gray-700 rounded-full">
                    <Database className="h-4 w-4" />
                  </div>
                  Silver Layer - Cleansed Data
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Data is refined through cleansing, validation, and integration for reliable analytics
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {silverTables.map((table) => (
                    <div key={table.name} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleTableExpansion(table.name)}
                          >
                            {expandedTables.includes(table.name) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                          <div>
                            <h4 className="font-medium">{table.name}</h4>
                            <p className="text-sm text-gray-500">
                              {table.records.toLocaleString()} records • Updated {table.lastUpdated}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getQualityColor(table.quality)}>
                            {table.quality}% quality
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {expandedTables.includes(table.name) && (
                        <div className="mt-4 pl-8">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Cleansing:</span> Duplicates removed
                            </div>
                            <div>
                              <span className="font-medium">Validation:</span> Business rules applied
                            </div>
                            <div>
                              <span className="font-medium">Integration:</span> Cross-table consistency
                            </div>
                            <div>
                              <span className="font-medium">Status:</span> Ready for analysis
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gold" className="mt-6">
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-yellow-100 text-yellow-700 rounded-full">
                    <Database className="h-4 w-4" />
                  </div>
                  Gold Layer - Curated Data
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Business-ready datasets tailored for high-value use cases and decision-making
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {goldTables.map((table) => (
                    <div key={table.name} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleTableExpansion(table.name)}
                          >
                            {expandedTables.includes(table.name) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                          <div>
                            <h4 className="font-medium">{table.name}</h4>
                            <p className="text-sm text-gray-500">
                              {table.records.toLocaleString()} records • Updated {table.lastUpdated}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getQualityColor(table.quality)}>
                            {table.quality}% quality
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {expandedTables.includes(table.name) && (
                        <div className="mt-4 pl-8">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Aggregation:</span> Business metrics
                            </div>
                            <div>
                              <span className="font-medium">Governance:</span> Full compliance
                            </div>
                            <div>
                              <span className="font-medium">Use Case:</span> Executive dashboards
                            </div>
                            <div>
                              <span className="font-medium">Status:</span> Production ready
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Data Pipeline Status */}
        <Card className="mt-8 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Data Pipeline Status
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Real-time monitoring of data flows and processing across all layers
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">99.7%</div>
                <div className="text-sm text-gray-600">Pipeline Uptime</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">2.3TB</div>
                <div className="text-sm text-gray-600">Data Processed Today</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600">14ms</div>
                <div className="text-sm text-gray-600">Avg Processing Time</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-orange-600">156</div>
                <div className="text-sm text-gray-600">Active Workflows</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}