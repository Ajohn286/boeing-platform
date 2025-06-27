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
import { PieChart } from "recharts";

export default function DataEnvironment() {
  const [tab, setTab] = useState("overview");
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

  const supplier = {
    name: "Acme Infrastructure Inc.",
    type: "Construction Supplier",
    email: "alice.johnson@acmeinfra.com",
    phone: "(555) 321-9876",
    location: "Washington, DC",
    contractValue: "$2,500,000",
    reconciliation: {
      conflicting: ["companyName", "location"],
      resolved: ["email", "phone"],
      rules: ["Email Exact Match", "Company Name Fuzzy Match"],
      process: [
        "Initial data ingestion",
        "Field-level matching and conflict detection",
        "Manual review for unresolved fields",
        "Golden record consolidation"
      ]
    }
  };

  const contractTypes = [
    { name: "Construction", value: 40, color: "#1976d2" },
    { name: "Maintenance", value: 35, color: "#388e3c" },
    { name: "Consulting", value: 25, color: "#7b1fa2" }
  ];

  const contracts = [
    {
      id: "CON-2023-001",
      date: "2023-09-10",
      type: "Construction",
      status: "Active",
      value: "$2,500,000",
      risk: "Low",
      agency: "FAA"
    }
    // Add more contracts as needed
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        {[
          { key: "overview", label: "Overview" },
          { key: "master", label: "Master Data Management" },
          { key: "ontology", label: "Ontology & Object View" },
          { key: "quality", label: "Data Quality" }
        ].map((t) => (
          <button
            key={t.key}
            className={`px-4 py-2 font-medium focus:outline-none transition-colors duration-150 ${
              tab === t.key
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === "overview" && (
        <div>
          <h1 className="text-3xl font-bold mb-2">Data Platform</h1>
          <p className="mb-8 text-gray-600">
            Comprehensive data platform with Medallion architecture for data quality and governance
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dataSources.map((ds) => (
              <div
                key={ds.name}
                className="border rounded-xl bg-white p-6 flex flex-col gap-2 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-lg">{ds.name}</div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-50">
                    <svg width="20" height="20" fill="none"><rect width="20" height="20" rx="4" fill="#B2F2D6"/><path d="M6 10.5l3 3 5-5" stroke="#22C55E" strokeWidth="2" fill="none"/></svg>
                  </div>
                </div>
                <div className="text-2xl font-bold">{ds.records}</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(ds.status)}`}>{ds.status}</span>
                  <span className="text-gray-500 text-sm">{ds.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab === "master" && (
        <div>
          <h2 className="text-2xl font-bold mb-2">Master Data Management</h2>
          <p className="text-gray-600">Your MDM content here.</p>
        </div>
      )}
      {tab === "ontology" && (
        <div>
          <h2 className="text-2xl font-bold mb-2">Ontology & Object View</h2>
          <p className="text-gray-600">Your ontology content here.</p>
        </div>
      )}
      {tab === "quality" && (
        <div>
          <h2 className="text-2xl font-bold mb-2">Data Quality</h2>
          <p className="text-gray-600">Your data quality content here.</p>
        </div>
      )}
    </div>
  );
}