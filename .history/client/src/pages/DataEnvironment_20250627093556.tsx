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

const airbusDataSources = [
  {
    name: "Predictive Maintenance",
    description: "Sensor, engine, and maintenance data for failure prediction and reliability.",
    status: "Healthy",
    records: "1,245,000"
  },
  {
    name: "Quality Inspection with Computer Vision",
    description: "Visual inspection data, defect annotations, and CAD references for part quality.",
    status: "Healthy",
    records: "2,340,000"
  },
  {
    name: "Supply Chain Optimization",
    description: "Procurement, inventory, logistics, and demand data for supply chain efficiency.",
    status: "Needs Attention",
    records: "985,000"
  },
  {
    name: "Knowledge Management for Documentation",
    description: "Engineering, maintenance, and regulatory documents for fast retrieval.",
    status: "Healthy",
    records: "3,120,000"
  },
  {
    name: "Digital Twins for Monitoring and Performance Testing",
    description: "3D models, sensor streams, and performance history for real-time simulation.",
    status: "Healthy",
    records: "1,780,000"
  },
  {
    name: "Design Optimization (Generative Design)",
    description: "Design, material, and performance data for AI-driven component optimization.",
    status: "Healthy",
    records: "540,000"
  }
];

const statusBadge = (status) =>
  status === "Healthy"
    ? "bg-green-100 text-green-800"
    : "bg-orange-100 text-orange-800";

const statusLabel = (status) =>
  status === "Healthy" ? "Healthy" : "Needs Attention";

export default function DataEnvironment() {
  const [tab, setTab] = useState("overview");
  const [activeLayer, setActiveLayer] = useState("overview");
  const [expandedTables, setExpandedTables] = useState<string[]>([]);

  const dataSources = [
    {
      name: "Predictive Maintenance",
      description: "AI analyzes sensor and maintenance data to predict failures and optimize reliability.",
      datasets: [
        "Flight Operational Data (ACARS, FOQA): flight duration, altitude, speed",
        "Engine Health Monitoring: vibration, EGT, oil pressure/temp, N1/N2 speeds",
        "Structural Health Monitoring: stress/strain, crack propagation, integrity assessments",
        "Maintenance Logs: fault reports, work orders, MTBF records",
        "Environmental Data: weather, sand, salt, humidity"
      ],
      notes: [
        "Requires time-series processing and anomaly detection.",
        "Accurate data labeling for 'failure' vs 'non-failure' is critical."
      ]
    },
    {
      name: "Quality Inspection with Computer Vision",
      description: "AI-driven vision systems inspect parts for defects during manufacturing.",
      datasets: [
        "High-Resolution Images/Videos: visual data of parts, multiple perspectives",
        "Defect Annotations: labeled cracks, warping, corrosion, FOD, misalignments",
        "CAD Models & Reference Images: ground truth for comparison",
        "Lighting/Environment Variants: images under diverse conditions"
      ],
      notes: [
        "Supervised learning with labeled image datasets.",
        "3D data/depth maps enhance analysis of complex parts."
      ]
    },
    {
      name: "Supply Chain Optimization",
      description: "AI forecasts demand and optimizes logistics, inventory, and procurement.",
      datasets: [
        "Historical Procurement Data: purchase orders, lead times, vendor reliability",
        "Inventory Data: stock levels, warehouse throughput, part lifecycles",
        "Logistics Data: shipment tracking, delivery times, disruptions",
        "Demand Forecasts & Production Schedules: seasonality, historical demand",
        "External Events: market trends, geopolitical disruptions, strikes, shortages"
      ],
      notes: [
        "ERP integration (SAP, Oracle) is common.",
        "Uses reinforcement learning or time-series forecasting."
      ]
    },
    {
      name: "Knowledge Management for Documentation",
      description: "AI parses engineering documents and compliance files for fast retrieval.",
      datasets: [
        "Engineering Documents: manuals, design docs, parts catalogs, STC",
        "Maintenance Manuals: AMM, IPC, CMM",
        "Regulatory Documents: FAA/EASA compliance, airworthiness directives",
        "Past Queries & Navigation Logs: technician search behavior, FAQ graphs"
      ],
      notes: [
        "Uses NLP for classification, summarization, semantic search.",
        "Ontologies for aviation terminology are beneficial."
      ]
    },
    {
      name: "Digital Twins for Monitoring and Performance Testing",
      description: "AI-powered digital twins simulate and monitor aircraft lifecycle and performance.",
      datasets: [
        "CAD/CAE/CFD Models: 3D models and simulations",
        "Sensor Data Streams: real-time aircraft data",
        "Material Properties: thermal, electrical, mechanical characteristics",
        "Maintenance & Performance History: real vs simulated behavior"
      ],
      notes: [
        "Requires high-fidelity simulation and real-time sync.",
        "IoT and edge computing integration may be needed."
      ]
    },
    {
      name: "Design Optimization (Generative Design)",
      description: "AI generates lightweight, efficient designs for aircraft components.",
      datasets: [
        "Design Parameters: constraints, load conditions, part dimensions",
        "Material Data: composites, alloys, properties",
        "Performance Metrics: drag, stress points, fatigue life",
        "Historical Designs & Results: past designs and test data",
        "Regulatory Constraints: certification requirements, design rules"
      ],
      notes: [
        "Uses generative algorithms for optimal design.",
        "Improves fuel efficiency and reduces material usage."
      ]
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
          <h2 className="text-2xl font-bold mb-6">Overview</h2>
          <div>
            <h3 className="text-lg font-semibold mb-2">Data Capture & Ingestion</h3>
            <p className="mb-6 text-gray-600">Connected enterprise systems and data sources</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {airbusDataSources.map((ds) => (
                <div
                  key={ds.name}
                  className="border rounded-xl bg-white p-6 flex flex-col gap-2 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 text-blue-700 rounded-full w-10 h-10 flex items-center justify-center">
                        <svg width="24" height="24" fill="none"><rect width="24" height="24" rx="6" fill="#2563eb"/><rect x="6" y="8" width="12" height="2" rx="1" fill="#fff"/><rect x="6" y="12" width="12" height="2" rx="1" fill="#fff"/><rect x="6" y="16" width="7" height="2" rx="1" fill="#fff"/></svg>
                      </div>
                      <div>
                        <div className="font-bold text-base leading-tight">{ds.name}</div>
                        <div className="text-gray-500 text-sm leading-tight">{ds.description}</div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(ds.status)}`}>{statusLabel(ds.status)}</span>
                  </div>
                  <div className="mt-4 text-sm text-gray-700 font-medium">Records: {ds.records}</div>
                </div>
              ))}
            </div>
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