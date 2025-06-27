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
import { useState, useCallback, useRef, useEffect } from "react";
import { PieChart } from "recharts";
// @ts-ignore: No types for react-force-graph-2d
import ForceGraph2D from 'react-force-graph-2d';

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

const statusBadge = (status: string) =>
  status === "Healthy"
    ? "bg-green-100 text-green-800"
    : "bg-orange-100 text-orange-800";

const statusLabel = (status: string) =>
  status === "Healthy" ? "Healthy" : "Needs Attention";

const airbusEntities = [
  {
    id: 'predictive',
    name: 'Predictive Maintenance',
    description: 'Sensor, engine, and maintenance data for failure prediction and reliability.',
    instances: '1,245,000',
    color: '#2563eb',
  },
  {
    id: 'quality',
    name: 'Quality Inspection',
    description: 'Visual inspection data, defect annotations, and CAD references for part quality.',
    instances: '2,340,000',
    color: '#22c55e',
  },
  {
    id: 'supply',
    name: 'Supply Chain Optimization',
    description: 'Procurement, inventory, logistics, and demand data for supply chain efficiency.',
    instances: '985,000',
    color: '#22c55e',
  },
  {
    id: 'knowledge',
    name: 'Knowledge Management',
    description: 'Engineering, maintenance, and regulatory documents for fast retrieval.',
    instances: '3,120,000',
    color: '#22c55e',
  },
  {
    id: 'digital',
    name: 'Digital Twin',
    description: '3D models, sensor streams, and performance history for real-time simulation.',
    instances: '1,780,000',
    color: '#22c55e',
  },
  {
    id: 'design',
    name: 'Design Optimization',
    description: 'Design, material, and performance data for AI-driven component optimization.',
    instances: '540,000',
    color: '#22c55e',
  },
];

const airbusLinks = [
  { source: 'predictive', target: 'supply' },
  { source: 'predictive', target: 'digital' },
  { source: 'predictive', target: 'quality' },
  { source: 'predictive', target: 'design' },
  { source: 'predictive', target: 'knowledge' },
  { source: 'supply', target: 'digital' },
  { source: 'quality', target: 'design' },
  { source: 'knowledge', target: 'digital' },
];

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
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

          {/* Data Quality Pipeline Section */}
          <div className="mt-12">
            <h3 className="text-lg font-semibold mb-2">Data Quality Pipeline</h3>
            <p className="mb-6 text-gray-600">Automated data processing and quality management across bronze, silver, and gold data layers</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Bronze */}
              <div className="border rounded-xl bg-[#FFFBF5] p-6 shadow-sm border-orange-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl font-bold text-orange-600">Bronze</span>
                  <button className="border border-gray-300 rounded px-3 py-1 text-xs font-medium flex items-center gap-1 hover:bg-gray-50">
                    Quality Details
                    <svg width="16" height="16" fill="none"><rect width="16" height="16" rx="3" fill="#888"/><rect x="4" y="6" width="8" height="1.5" rx="0.75" fill="#fff"/><rect x="4" y="9" width="5" height="1.5" rx="0.75" fill="#fff"/></svg>
                  </button>
                </div>
                <div className="mb-2 text-sm font-medium">Data Processing Status</div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-full bg-orange-100 rounded h-2">
                    <div className="bg-orange-400 h-2 rounded" style={{ width: '92%' }}></div>
                  </div>
                  <span className="text-xs font-semibold text-orange-700">92%</span>
                </div>
                <div className="flex justify-between text-xs text-gray-600 mb-4">
                  <span>Issues: 26,458</span>
                  <span>Resolved: 24,531</span>
                </div>
                <div className="font-semibold mb-2 text-sm">Data Quality Rules</div>
                <ul className="mb-6">
                  <li className="flex items-center justify-between mb-1 text-sm"><span>Timeliness Check <span className="text-xs text-gray-400 ml-1">System</span></span><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">Active</span></li>
                  <li className="flex items-center justify-between mb-1 text-sm"><span>Completeness Validation <span className="text-xs text-gray-400 ml-1">System</span></span><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">Active</span></li>
                  <li className="flex items-center justify-between mb-1 text-sm"><span>File Format Check <span className="text-xs text-gray-400 ml-1">System</span></span><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">Active</span></li>
                  <li className="flex items-center justify-between mb-1 text-sm"><span>Schema Validation <span className="text-xs text-gray-400 ml-1">System</span></span><span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-semibold">In Progress</span></li>
                </ul>
                <div className="flex justify-between text-xs text-gray-700 font-medium mt-auto">
                  <span>Records: <span className="font-bold text-base text-black">8.2M</span></span>
                  <span>Batch Processing Time: <span className="font-bold text-base text-black">42 min</span></span>
                </div>
              </div>
              {/* Silver */}
              <div className="border rounded-xl bg-[#F8FAFF] p-6 shadow-sm border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl font-bold text-blue-700">Silver</span>
                  <button className="border border-gray-300 rounded px-3 py-1 text-xs font-medium flex items-center gap-1 hover:bg-gray-50">
                    Quality Details
                    <svg width="16" height="16" fill="none"><rect width="16" height="16" rx="3" fill="#888"/><rect x="4" y="6" width="8" height="1.5" rx="0.75" fill="#fff"/><rect x="4" y="9" width="5" height="1.5" rx="0.75" fill="#fff"/></svg>
                  </button>
                </div>
                <div className="mb-2 text-sm font-medium">Data Processing Status</div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-full bg-blue-100 rounded h-2">
                    <div className="bg-blue-500 h-2 rounded" style={{ width: '78%' }}></div>
                  </div>
                  <span className="text-xs font-semibold text-blue-700">78%</span>
                </div>
                <div className="flex justify-between text-xs text-gray-600 mb-4">
                  <span>Issues: 14,329</span>
                  <span>Resolved: 12,984</span>
                </div>
                <div className="font-semibold mb-2 text-sm">Business Data Quality Rules</div>
                <ul className="mb-6">
                  <li className="flex items-center justify-between mb-1 text-sm"><span>Name Standardization <span className="text-xs text-gray-400 ml-1">Business</span></span><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">Active</span></li>
                  <li className="flex items-center justify-between mb-1 text-sm"><span>Address Validation <span className="text-xs text-gray-400 ml-1">Business</span></span><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">Active</span></li>
                  <li className="flex items-center justify-between mb-1 text-sm"><span>Policy Date Format Check <span className="text-xs text-gray-400 ml-1">Business</span></span><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">Active</span></li>
                  <li className="flex items-center justify-between mb-1 text-sm"><span>Customer ID Validation <span className="text-xs text-gray-400 ml-1">Business</span></span><span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-semibold">In Progress</span></li>
                  <li className="flex items-center justify-between mb-1 text-sm"><span>Email Format Validation <span className="text-xs text-gray-400 ml-1">Business</span></span><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">Active</span></li>
                  <li className="flex items-center justify-between mb-1 text-sm"><span>Gender Code Standardization <span className="text-xs text-gray-400 ml-1">Business</span></span><span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-semibold">In Progress</span></li>
                  <li className="flex items-center justify-between mb-1 text-sm"><span>Claim Amount Range Check <span className="text-xs text-gray-400 ml-1">Business</span></span><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">Active</span></li>
                  <li className="flex items-center justify-between mb-1 text-sm"><span>Duplicate Detection <span className="text-xs text-gray-400 ml-1">System</span></span><span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-semibold">In Progress</span></li>
                </ul>
                <div className="flex justify-between text-xs text-gray-700 font-medium mt-auto">
                  <span>Records: <span className="font-bold text-base text-black">7.9M</span></span>
                  <span>Batch Processing Time: <span className="font-bold text-base text-black">1h 15min</span></span>
                </div>
              </div>
              {/* Gold */}
              <div className="border rounded-xl bg-[#FFFCF5] p-6 shadow-sm border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl font-bold text-yellow-600">Gold</span>
                  <button className="border border-gray-300 rounded px-3 py-1 text-xs font-medium flex items-center gap-1 hover:bg-gray-50">
                    Quality Details
                    <svg width="16" height="16" fill="none"><rect width="16" height="16" rx="3" fill="#888"/><rect x="4" y="6" width="8" height="1.5" rx="0.75" fill="#fff"/><rect x="4" y="9" width="5" height="1.5" rx="0.75" fill="#fff"/></svg>
                  </button>
                </div>
                <div className="mb-2 text-sm font-medium">Data Processing Status</div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-full bg-yellow-100 rounded h-2">
                    <div className="bg-yellow-400 h-2 rounded" style={{ width: '84%' }}></div>
                  </div>
                  <span className="text-xs font-semibold text-yellow-700">84%</span>
                </div>
                <div className="flex justify-between text-xs text-gray-600 mb-4">
                  <span>Issues: 4,892</span>
                  <span>Resolved: 4,518</span>
                </div>
                <div className="font-semibold mb-2 text-sm">MDM Match & Merge Process</div>
                <ul className="mb-6">
                  <li className="flex items-center justify-between mb-1 text-sm"><span>Customer Golden Record <span className="text-xs text-gray-400 ml-1">Business</span></span><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">Active</span></li>
                  <li className="flex items-center justify-between mb-1 text-sm"><span>Policy Master Record <span className="text-xs text-gray-400 ml-1">Business</span></span><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">Active</span></li>
                  <li className="flex items-center justify-between mb-1 text-sm"><span>Claims Consolidated View <span className="text-xs text-gray-400 ml-1">Business</span></span><span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-semibold">In Progress</span></li>
                  <li className="flex items-center justify-between mb-1 text-sm"><span>Cross-system Record Linking <span className="text-xs text-gray-400 ml-1">System</span></span><span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-semibold">In Progress</span></li>
                </ul>
                <div className="flex justify-between text-xs text-gray-700 font-medium mt-auto">
                  <span>Records: <span className="font-bold text-base text-black">7.8M</span></span>
                  <span>Batch Processing Time: <span className="font-bold text-base text-black">55 min</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {tab === "master" && (
        <div>
          {/* Header and Description */}
          <h2 className="text-2xl font-bold mb-1">Master Data Management - Supplier Data 360</h2>
          <p className="text-gray-600 mb-4">Unified 360-degree view of supplier data from multiple enterprise systems with automatic reconciliation, matching, and merging to create a complete supplier profile.</p>

          {/* Tab Buttons */}
          <div className="flex gap-2 mb-2">
            <button className="px-4 py-1 rounded border border-gray-300 bg-black text-white font-medium text-sm">Golden Record</button>
            <button className="px-4 py-1 rounded border border-gray-200 bg-gray-50 text-gray-700 font-medium text-sm">ERP (SAP/NetSuite)</button>
            <button className="px-4 py-1 rounded border border-gray-200 bg-gray-50 text-gray-700 font-medium text-sm">FAA AMS</button>
            <button className="px-4 py-1 rounded border border-gray-200 bg-gray-50 text-gray-700 font-medium text-sm">SAM</button>
          </div>

          {/* Status Bar */}
          <div className="text-xs text-gray-500 mb-6">Viewing consolidated golden record • Data quality score: <span className="font-semibold text-green-700">95%</span> • Last consolidated: 2023-10-18</div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Supplier Card */}
            <div className="bg-white rounded-xl border p-6 flex flex-col gap-4 shadow-sm">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg width="32" height="32" fill="none"><circle cx="16" cy="16" r="16" fill="#2563eb"/><path d="M16 18c-3.2 0-6 1.6-6 3.6V24h12v-2.4c0-2-2.8-3.6-6-3.6Zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" fill="#fff"/></svg>
                </div>
                <div>
                  <div className="font-bold text-lg">Acme Infrastructure Inc.</div>
                  <div className="text-gray-500 text-sm">Construction Supplier</div>
                </div>
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2"><svg width="16" height="16" fill="none"><rect width="16" height="16" rx="4" fill="#e5e7eb"/><path d="M4 8a4 4 0 1 1 8 0A4 4 0 0 1 4 8Z" fill="#2563eb"/></svg><span>Email</span><span className="text-gray-700 ml-2">alice.johnson@acmeinfra.com</span></div>
                <div className="flex items-center gap-2"><svg width="16" height="16" fill="none"><rect width="16" height="16" rx="4" fill="#e5e7eb"/><path d="M8 4a4 4 0 0 1 4 4v1a4 4 0 0 1-8 0V8a4 4 0 0 1 4-4Z" fill="#2563eb"/></svg><span>Phone</span><span className="text-gray-700 ml-2">(555) 321-9876</span></div>
                <div className="flex items-center gap-2"><svg width="16" height="16" fill="none"><rect width="16" height="16" rx="4" fill="#e5e7eb"/><path d="M8 3a5 5 0 0 1 5 5c0 3.5-5 7-5 7S3 11.5 3 8a5 5 0 0 1 5-5Z" fill="#2563eb"/></svg><span>Location</span><span className="text-gray-700 ml-2">Washington, DC</span></div>
                <div className="flex items-center gap-2"><svg width="16" height="16" fill="none"><rect width="16" height="16" rx="4" fill="#e5e7eb"/><path d="M4 12V4h8v8H4Zm1-1h6V5H5v6Z" fill="#2563eb"/></svg><span>Contract Value</span><span className="text-gray-700 ml-2">$2,500,000</span></div>
              </div>
              <div className="mt-4">
                <div className="font-semibold text-sm mb-1">Reconciliation Details</div>
                <div className="text-xs mb-1"><span className="text-orange-600 font-medium">Conflicting Fields:</span> companyName, location</div>
                <div className="text-xs mb-1"><span className="text-green-700 font-medium">Resolved Fields:</span> email, phone</div>
                <div className="text-xs mb-1">Matching Rules Applied: Email Exact Match, Company Name Fuzzy Match</div>
                <div className="text-xs mt-2 mb-1 font-medium">Reconciliation Process:</div>
                <ol className="list-decimal ml-5 text-xs text-gray-700">
                  <li>Initial data ingestion</li>
                  <li>Standardization and cleansing</li>
                  <li>Duplicate detection</li>
                  <li>Record linking</li>
                  <li>Survivorship rules application</li>
                  <li>Golden record creation</li>
                </ol>
              </div>
            </div>
            {/* Contracts History & Analysis */}
            <div className="bg-white rounded-xl border p-6 flex flex-col gap-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-base">Contracts History & Analysis</div>
                <input className="border border-gray-300 rounded px-3 py-1 text-sm w-48" placeholder="Search contracts..." />
              </div>
              {/* Donut Chart */}
              <div className="flex items-center gap-4">
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle r="48" cx="60" cy="60" fill="transparent" stroke="#2563eb" strokeWidth="16" strokeDasharray="120 240" strokeDashoffset="0" />
                  <circle r="48" cx="60" cy="60" fill="transparent" stroke="#111827" strokeWidth="16" strokeDasharray="105 240" strokeDashoffset="-120" />
                  <circle r="48" cx="60" cy="60" fill="transparent" stroke="#22c55e" strokeWidth="16" strokeDasharray="75 240" strokeDashoffset="-225" />
                </svg>
                <div className="flex flex-col gap-1 text-xs">
                  <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full bg-blue-700"></span>Construction (40%)</div>
                  <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full bg-black"></span>Maintenance (35%)</div>
                  <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>Consulting (25%)</div>
                </div>
              </div>
              {/* Contracts Table */}
              <div className="mt-4">
                <div className="font-semibold text-sm mb-2">Contracts Details</div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs border">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-3 py-2 text-left font-semibold">Contract ID</th>
                        <th className="px-3 py-2 text-left font-semibold">Date</th>
                        <th className="px-3 py-2 text-left font-semibold">Type</th>
                        <th className="px-3 py-2 text-left font-semibold">Status</th>
                        <th className="px-3 py-2 text-left font-semibold">Value</th>
                        <th className="px-3 py-2 text-left font-semibold">Risk Level</th>
                        <th className="px-3 py-2 text-left font-semibold">Agency</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-3 py-2">CON-2023-001</td>
                        <td className="px-3 py-2">2023-09-10</td>
                        <td className="px-3 py-2">Construction</td>
                        <td className="px-3 py-2">Active</td>
                        <td className="px-3 py-2">$2,500,000</td>
                        <td className="px-3 py-2"><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">Low</span></td>
                        <td className="px-3 py-2">FAA</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2">CON-2022-015</td>
                        <td className="px-3 py-2">2022-06-18</td>
                        <td className="px-3 py-2">Maintenance</td>
                        <td className="px-3 py-2">Completed</td>
                        <td className="px-3 py-2">$1,200,000</td>
                        <td className="px-3 py-2"><span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-semibold">Medium</span></td>
                        <td className="px-3 py-2">NHTSA</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2">CON-2022-008</td>
                        <td className="px-3 py-2">2022-01-12</td>
                        <td className="px-3 py-2">Consulting</td>
                        <td className="px-3 py-2">Completed</td>
                        <td className="px-3 py-2">$800,000</td>
                        <td className="px-3 py-2"><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">Low</span></td>
                        <td className="px-3 py-2">FHWA</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {tab === "ontology" && (
        <OntologyView />
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

function OntologyView() {
  const [selectedEntity, setSelectedEntity] = useState<string>('predictive');
  const [selectedNode, setSelectedNode] = useState<typeof airbusEntities[0]>(airbusEntities[0]);
  const [graphWidth, setGraphWidth] = useState<number>(500);
  const graphContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleResize() {
      if (graphContainerRef.current) {
        setGraphWidth(graphContainerRef.current.offsetWidth);
      }
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const graphData = {
    nodes: airbusEntities.map(e => ({ ...e, val: e.id === selectedEntity ? 3 : 1 })),
    links: airbusLinks,
  };

  const handleNodeClick = useCallback((node: typeof airbusEntities[0]) => {
    setSelectedNode(node);
    setSelectedEntity(node.id);
  }, []);

  const handleEntityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedEntity(id);
    const found = airbusEntities.find(ent => ent.id === id);
    setSelectedNode(found ? found : airbusEntities[0]);
  };

  return (
    <div>
      {/* Header and Description */}
      <h2 className="text-2xl font-bold mb-1">Ontology & Object View</h2>
      <p className="text-gray-600 mb-4">Explore the data model ontology and relationships between entities.</p>

      {/* Entity Selector */}
      <div className="flex justify-end mb-2">
        <label className="mr-2 text-sm font-medium" htmlFor="entity-select">Entity</label>
        <select
          id="entity-select"
          className="border rounded px-3 py-1 text-sm"
          value={selectedEntity}
          onChange={handleEntityChange}
        >
          {airbusEntities.map(e => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>
      </div>

      {/* Force-Directed Graph Visualization */}
      <div className="bg-white rounded-xl border p-6 mb-6 shadow-sm flex flex-col items-center" ref={graphContainerRef} style={{ minHeight: 400 }}>
        <div className="font-semibold mb-2 w-full">{selectedNode.name} Relationships</div>
        <div className="flex items-center gap-4 mb-2 w-full">
          <span className="flex items-center gap-1 text-xs"><span className="inline-block w-3 h-3 rounded-full bg-blue-600"></span>Fields</span>
          <span className="flex items-center gap-1 text-xs"><span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>Instances</span>
        </div>
        <div className="relative w-full flex justify-center" style={{ height: 360 }}>
          <ForceGraph2D
            width={graphWidth - 32 > 0 ? graphWidth - 32 : 320}
            height={340}
            graphData={graphData}
            nodeLabel={(node: any) => node.name}
            nodeAutoColorBy={(node: any) => node.id === selectedEntity ? 'selected' : 'group'}
            nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
              ctx.beginPath();
              ctx.arc(node.x, node.y, node.id === selectedEntity ? 28 : 20, 0, 2 * Math.PI, false);
              ctx.fillStyle = node.color;
              ctx.fill();
              ctx.font = `${node.id === selectedEntity ? 14 : 10}px Sans-Serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = '#fff';
              ctx.fillText(node.name.split(' ')[0], node.x, node.y - 6);
              ctx.fillText(node.name.split(' ').slice(1).join(' '), node.x, node.y + 8);
            }}
            linkDirectionalArrowLength={6}
            linkDirectionalArrowRelPos={1}
            linkColor={() => '#bbb'}
            onNodeClick={handleNodeClick}
            cooldownTicks={50}
            onEngineStop={() => {}}
          />
          {/* Zoom, filter, settings icons (static for now) */}
          <div className="absolute top-2 right-2 flex gap-2 z-10">
            <button className="bg-white border rounded-full p-1 shadow"><svg width="18" height="18" fill="none"><circle cx="9" cy="9" r="8" stroke="#888" strokeWidth="2"/><path d="M9 5v8M5 9h8" stroke="#888" strokeWidth="2"/></svg></button>
            <button className="bg-white border rounded-full p-1 shadow"><svg width="18" height="18" fill="none"><circle cx="9" cy="9" r="8" stroke="#888" strokeWidth="2"/><path d="M6 9h6" stroke="#888" strokeWidth="2"/></svg></button>
            <button className="bg-white border rounded-full p-1 shadow"><svg width="18" height="18" fill="none"><rect x="4" y="7" width="10" height="4" rx="2" stroke="#888" strokeWidth="2"/></svg></button>
          </div>
        </div>
      </div>

      {/* Entity Schema & Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-4 shadow-sm">
          <div className="font-semibold text-blue-700 text-sm mb-2">Entity Schema: {selectedNode.name}</div>
          <div className="flex items-center gap-2 mb-1">
            <div className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center">
              <svg width="20" height="20" fill="none"><rect width="20" height="20" rx="5" fill="#2563eb"/><rect x="5" y="7" width="10" height="2" rx="1" fill="#fff"/><rect x="5" y="11" width="10" height="2" rx="1" fill="#fff"/><rect x="5" y="15" width="6" height="2" rx="1" fill="#fff"/></svg>
            </div>
            <div className="font-bold">{selectedNode.name}</div>
            <span className="ml-2 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-semibold">{selectedNode.instances} instances</span>
          </div>
          <div className="text-gray-600 text-sm">{selectedNode.description}</div>
        </div>
        <div className="bg-blue-600 rounded-xl p-4 flex items-center gap-3 shadow-sm">
          <div className="bg-white text-blue-700 rounded-full w-10 h-10 flex items-center justify-center">
            <svg width="24" height="24" fill="none"><rect width="24" height="24" rx="6" fill="#2563eb"/><rect x="6" y="8" width="12" height="2" rx="1" fill="#fff"/><rect x="6" y="12" width="12" height="2" rx="1" fill="#fff"/><rect x="6" y="16" width="7" height="2" rx="1" fill="#fff"/></svg>
          </div>
          <div>
            <div className="text-white font-bold">{selectedNode.name}</div>
            <div className="text-white text-xs">{selectedNode.instances} instances</div>
          </div>
        </div>
      </div>
    </div>
  );
}