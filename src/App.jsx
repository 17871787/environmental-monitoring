import React, { useState, useMemo, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, RadialBarChart, RadialBar, PieChart, Pie, Cell, AreaChart, Area, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ScatterChart, Scatter } from 'recharts';
import { Globe, AlertTriangle, CheckCircle, Info, Send, Sparkles, Leaf, Droplets, Factory, Activity, Users, Tractor, MessageSquare, BarChart3, Save, Trash2, Plus, Minus, TreePine, Wind, Thermometer, Waves, Circle, Shield, Map, Eye, FileText, Bell, Filter, ChevronDown, ChevronRight, Building2, Truck, Award } from 'lucide-react';

// TNFD-aligned risk thresholds
const TNFD_THRESHOLDS = {
  waterStress: { low: 10, medium: 20, high: 40, critical: 80 },
  biodiversityRisk: { low: 20, medium: 40, high: 70, critical: 90 },
  nutrientRunoff: { low: 15, medium: 30, high: 50, critical: 75 },
  soilDegradation: { low: 10, medium: 25, high: 45, critical: 70 },
  floodRisk: { low: 5, medium: 15, high: 30, critical: 50 },
  droughtRisk: { low: 10, medium: 25, high: 45, critical: 70 }
};

// Environmental scheme requirements
const ENVIRONMENTAL_SCHEMES = {
  SFI: {
    name: 'Sustainable Farming Incentive',
    requirements: ['coverCrops', 'hedgerows', 'waterManagement', 'soilHealth'],
    paymentRate: '£25-£115/ha'
  },
  CS: {
    name: 'Countryside Stewardship',
    requirements: ['biodiversity', 'waterQuality', 'woodland', 'heritage'],
    paymentRate: '£28-£640/ha'
  },
  ELM: {
    name: 'Environmental Land Management',
    requirements: ['netZero', 'biodiversity', 'waterQuality', 'animalWelfare'],
    paymentRate: 'Variable'
  }
};

// Sample farm data for the processor's 270 farms
const generateSampleFarms = () => {
  const regions = ['Southwest', 'Northwest', 'Midlands', 'Yorkshire', 'Southeast'];
  const farmTypes = ['Intensive Dairy', 'Mixed Farming', 'Grass-Fed Dairy', 'Organic Dairy'];
  
  return Array.from({ length: 12 }, (_, i) => ({
    id: `FARM_${String(i + 1).padStart(3, '0')}`,
    name: `${['Green Valley', 'Hill Top', 'Oak Tree', 'River Side', 'Meadow View', 'Spring Field', 'Manor', 'Willow', 'Pine Ridge', 'Stone Bridge', 'Elm Grove', 'Heather'][i]} Farm`,
    region: regions[i % regions.length],
    type: farmTypes[i % farmTypes.length],
    area: 80 + Math.random() * 120,
    cows: 100 + Math.random() * 150,
    milkYield: 6000 + Math.random() * 3000,
    compliance: {
      tnfd: Math.random() > 0.3,
      nvz: Math.random() > 0.2,
      sfi: Math.random() > 0.4,
      waterPermit: Math.random() > 0.1
    },
    metrics: {
      waterEfficiency: 60 + Math.random() * 35,
      biodiversityScore: 30 + Math.random() * 60,
      nutrientEfficiency: 40 + Math.random() * 45,
      soilHealth: 2 + Math.random() * 2.5,
      carbonFootprint: 800 + Math.random() * 800,
      riskScore: Math.random() * 100
    },
    lastUpdated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    alerts: Math.floor(Math.random() * 5)
  }));
};

const defaultInputs = {
  // Portfolio view settings
  selectedRegion: 'all',
  selectedFarmType: 'all',
  selectedCompliance: 'all',
  // Individual farm inputs (when viewing specific farm)
  farmArea: 100,
  dairyCows: 120,
  milkPerCow: 7000,
  // Water management
  waterSources: 3,
  storageCapacity: 5000,
  recyclingRate: 40,
  dischargePoints: 2,
  // Biodiversity features
  coverCropArea: 20,
  hedgerowLength: 5,
  wetlandArea: 2,
  woodlandArea: 8,
  // Compliance tracking
  nvzCompliant: true,
  waterPermitValid: true,
  sfiEnrolled: false,
  csEnrolled: true,
  // Environmental metrics
  nitrogenEfficiency: 65,
  phosphorusEfficiency: 70,
  soilOrganicMatter: 3.2,
  biodiversityIndex: 45
};

const UKDairyDashboard = () => {
  const [inputs, setInputs] = useState(defaultInputs);
  const [activeView, setActiveView] = useState('portfolio'); // 'portfolio' or 'farm'
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [chatMessages, setChatMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [farms] = useState(generateSampleFarms());

  // Calculate portfolio metrics
  const portfolioMetrics = useMemo(() => {
    let filteredFarms = farms;
    
    if (inputs.selectedRegion !== 'all') {
      filteredFarms = filteredFarms.filter(f => f.region === inputs.selectedRegion);
    }
    if (inputs.selectedFarmType !== 'all') {
      filteredFarms = filteredFarms.filter(f => f.type === inputs.selectedFarmType);
    }
    
    const totalFarms = filteredFarms.length;
    const totalArea = filteredFarms.reduce((sum, f) => sum + f.area, 0);
    const totalCows = filteredFarms.reduce((sum, f) => sum + f.cows, 0);
    const totalMilk = filteredFarms.reduce((sum, f) => sum + (f.cows * f.milkYield), 0);
    
    const avgBiodiversity = filteredFarms.reduce((sum, f) => sum + f.metrics.biodiversityScore, 0) / totalFarms;
    const avgWaterEfficiency = filteredFarms.reduce((sum, f) => sum + f.metrics.waterEfficiency, 0) / totalFarms;
    const avgNutrientEfficiency = filteredFarms.reduce((sum, f) => sum + f.metrics.nutrientEfficiency, 0) / totalFarms;
    
    const complianceRates = {
      tnfd: filteredFarms.filter(f => f.compliance.tnfd).length / totalFarms * 100,
      nvz: filteredFarms.filter(f => f.compliance.nvz).length / totalFarms * 100,
      sfi: filteredFarms.filter(f => f.compliance.sfi).length / totalFarms * 100,
      waterPermit: filteredFarms.filter(f => f.compliance.waterPermit).length / totalFarms * 100
    };
    
    const riskDistribution = {
      low: filteredFarms.filter(f => f.metrics.riskScore <= 25).length,
      medium: filteredFarms.filter(f => f.metrics.riskScore > 25 && f.metrics.riskScore <= 50).length,
      high: filteredFarms.filter(f => f.metrics.riskScore > 50 && f.metrics.riskScore <= 75).length,
      critical: filteredFarms.filter(f => f.metrics.riskScore > 75).length
    };
    
    return {
      totalFarms,
      totalArea,
      totalCows,
      totalMilk: totalMilk / 1000000, // Convert to million liters
      avgBiodiversity,
      avgWaterEfficiency,
      avgNutrientEfficiency,
      complianceRates,
      riskDistribution,
      filteredFarms
    };
  }, [farms, inputs.selectedRegion, inputs.selectedFarmType]);

  // TNFD metrics calculation
  const tnfdMetrics = useMemo(() => {
    const farms = portfolioMetrics.filteredFarms;
    
    return {
      landMetrics: {
        naturalHabitat: farms.reduce((sum, f) => sum + (f.area * 0.15), 0), // 15% average
        ecosystemConnectivity: avgBiodiversity => avgBiodiversity / 100,
        soilHealth: farms.reduce((sum, f) => sum + f.metrics.soilHealth, 0) / farms.length
      },
      waterMetrics: {
        withdrawalIntensity: farms.reduce((sum, f) => sum + (f.cows * 50), 0), // 50L per cow estimate
        treatmentEfficiency: portfolioMetrics.avgWaterEfficiency,
        dischargeQuality: farms.filter(f => f.compliance.waterPermit).length / farms.length * 100
      },
      biodiversityMetrics: {
        intactnessIndex: portfolioMetrics.avgBiodiversity,
        speciesRichness: farms.reduce((sum, f) => sum + (f.metrics.biodiversityScore * 0.8), 0) / farms.length,
        pollinatorSupport: farms.filter(f => f.metrics.biodiversityScore > 60).length / farms.length * 100
      }
    };
  }, [portfolioMetrics]);

  // Risk assessment
  const getRiskLevel = (score) => {
    if (score <= 25) return { level: 'Low', color: 'text-green-600', bg: 'bg-green-100' };
    if (score <= 50) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (score <= 75) return { level: 'High', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { level: 'Critical', color: 'text-red-600', bg: 'bg-red-100' };
  };

  // Chat functionality for TNFD guidance - DISABLED FOR DEPLOYMENT
  const sendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;
    
    const userMessage = currentMessage.trim();
    setCurrentMessage("");
    setIsLoading(true);
    
    const newMessages = [...chatMessages, { type: 'user', content: userMessage }];
    setChatMessages(newMessages);
    
    // Mock response for deployment without API key
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        type: 'assistant', 
        content: "This is a demo response. To enable AI assistance, please configure your API key.",
        actionItems: ["Configure API credentials", "Review TNFD documentation"],
        schemeOpportunities: ["SFI enrollment available"],
        riskAlerts: []
      }]);
      setIsLoading(false);
    }, 1000);
  };

  const MetricCard = ({ title, value, unit, trend, status, icon, onClick }) => {
    const statusConfig = status ? getRiskLevel(status) : { level: '', color: 'text-gray-600', bg: 'bg-gray-100' };
    
    return (
      <div 
        className={`bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
            {icon}
          </div>
          {status && (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
              {statusConfig.level}
            </span>
          )}
        </div>
        <div className="text-3xl font-bold text-gray-800 mb-1">
          {typeof value === 'number' ? value.toFixed(1) : value}{unit}
        </div>
        <div className="text-sm font-medium text-gray-600">{title}</div>
        {trend && (
          <div className={`text-xs mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last month
          </div>
        )}
      </div>
    );
  };

  const ComplianceCard = ({ scheme, rate, requirements, payment }) => (
    <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-800">{scheme}</h4>
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold text-blue-600">{rate.toFixed(0)}%</div>
          {rate >= 90 ? 
            <CheckCircle className="w-5 h-5 text-green-600" /> : 
            <AlertTriangle className="w-5 h-5 text-orange-600" />
          }
        </div>
      </div>
      <div className="text-sm text-gray-600 mb-2">Payment: {payment}</div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
        <div 
          className={`h-full transition-all duration-500 ${
            rate >= 90 ? 'bg-green-500' : rate >= 70 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${rate}%` }}
        />
      </div>
      <div className="text-xs text-gray-500">
        {requirements.join(', ')}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  UK Dairy Environmental Monitoring
                </h1>
                <p className="text-gray-600">TNFD-Aligned Supply Chain Dashboard</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                activeView === 'portfolio' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveView('portfolio')}
            >
              <Building2 className="w-4 h-4 inline mr-2" />
              Portfolio View
            </button>
            <button
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                activeView === 'farm' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveView('farm')}
            >
              <Tractor className="w-4 h-4 inline mr-2" />
              Farm Detail
            </button>
          </div>
        </div>

        {/* Portfolio View */}
        {activeView === 'portfolio' && (
          <>
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <MetricCard
                title="Total Supplier Farms"
                value={portfolioMetrics.totalFarms}
                unit=""
                icon={<Tractor className="w-6 h-6 text-blue-600" />}
              />
              <MetricCard
                title="Total Milk Production"
                value={portfolioMetrics.totalMilk}
                unit="M L/year"
                trend={2.3}
                icon={<Droplets className="w-6 h-6 text-blue-600" />}
              />
              <MetricCard
                title="TNFD Compliance"
                value={portfolioMetrics.complianceRates.tnfd}
                unit="%"
                status={100 - portfolioMetrics.complianceRates.tnfd}
                icon={<FileText className="w-6 h-6 text-blue-600" />}
              />
              <MetricCard
                title="High Risk Farms"
                value={portfolioMetrics.riskDistribution.critical + portfolioMetrics.riskDistribution.high}
                unit=""
                status={((portfolioMetrics.riskDistribution.critical + portfolioMetrics.riskDistribution.high) / portfolioMetrics.totalFarms) * 100}
                icon={<AlertTriangle className="w-6 h-6 text-blue-600" />}
              />
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Supply Chain Overview</h3>
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {showFilters ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
              
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-gray-200 mb-4">
                  <select
                    className="border border-gray-300 rounded-xl px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    value={inputs.selectedRegion}
                    onChange={e => setInputs({...inputs, selectedRegion: e.target.value})}
                  >
                    <option value="all">All Regions</option>
                    <option value="Southwest">Southwest</option>
                    <option value="Northwest">Northwest</option>
                    <option value="Midlands">Midlands</option>
                    <option value="Yorkshire">Yorkshire</option>
                    <option value="Southeast">Southeast</option>
                  </select>
                  
                  <select
                    className="border border-gray-300 rounded-xl px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    value={inputs.selectedFarmType}
                    onChange={e => setInputs({...inputs, selectedFarmType: e.target.value})}
                  >
                    <option value="all">All Farm Types</option>
                    <option value="Intensive Dairy">Intensive Dairy</option>
                    <option value="Mixed Farming">Mixed Farming</option>
                    <option value="Grass-Fed Dairy">Grass-Fed Dairy</option>
                    <option value="Organic Dairy">Organic Dairy</option>
                  </select>
                  
                  <select
                    className="border border-gray-300 rounded-xl px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    value={inputs.selectedCompliance}
                    onChange={e => setInputs({...inputs, selectedCompliance: e.target.value})}
                  >
                    <option value="all">All Compliance Status</option>
                    <option value="compliant">Fully Compliant</option>
                    <option value="partial">Partial Compliance</option>
                    <option value="non-compliant">Non-Compliant</option>
                  </select>
                </div>
              )}

              {/* Farm List */}
              <div className="max-h-96 overflow-y-auto">
                <div className="grid grid-cols-1 gap-3">
                  {portfolioMetrics.filteredFarms.map((farm) => {
                    const risk = getRiskLevel(farm.metrics.riskScore);
                    return (
                      <div
                        key={farm.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
                        onClick={() => {
                          setSelectedFarm(farm.id);
                          setActiveView('farm');
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                              <Tractor className="w-6 h-6 text-blue-600" />
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800">{farm.name}</div>
                            <div className="text-sm text-gray-600">
                              {farm.region} • {farm.type} • {farm.area.toFixed(0)} ha
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-800">
                              {farm.cows} cows
                            </div>
                            <div className="text-xs text-gray-600">
                              {(farm.milkYield / 1000).toFixed(1)}k L/cow
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {farm.alerts > 0 && (
                              <div className="flex items-center gap-1 text-orange-600">
                                <Bell className="w-4 h-4" />
                                <span className="text-xs">{farm.alerts}</span>
                              </div>
                            )}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${risk.bg} ${risk.color}`}>
                              {risk.level}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* TNFD Metrics Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Environmental Performance */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Environmental Performance</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={[
                      {
                        metric: 'Water Efficiency',
                        current: portfolioMetrics.avgWaterEfficiency,
                        target: 85,
                        fullMark: 100
                      },
                      {
                        metric: 'Biodiversity',
                        current: portfolioMetrics.avgBiodiversity,
                        target: 70,
                        fullMark: 100
                      },
                      {
                        metric: 'Nutrient Efficiency',
                        current: portfolioMetrics.avgNutrientEfficiency,
                        target: 75,
                        fullMark: 100
                      },
                      {
                        metric: 'Soil Health',
                        current: tnfdMetrics.landMetrics.soilHealth * 20,
                        target: 70,
                        fullMark: 100
                      },
                      {
                        metric: 'Carbon Management',
                        current: 60,
                        target: 80,
                        fullMark: 100
                      }
                    ]}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Radar
                        name="Current Performance"
                        dataKey="current"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                      <Radar
                        name="Target"
                        dataKey="target"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.1}
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                      <Tooltip />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Risk Distribution */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Risk Distribution</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Low Risk', value: portfolioMetrics.riskDistribution.low, fill: '#10b981' },
                          { name: 'Medium Risk', value: portfolioMetrics.riskDistribution.medium, fill: '#f59e0b' },
                          { name: 'High Risk', value: portfolioMetrics.riskDistribution.high, fill: '#f97316' },
                          { name: 'Critical Risk', value: portfolioMetrics.riskDistribution.critical, fill: '#ef4444' }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} farms`, 'Count']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Compliance Overview */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Environmental Scheme Compliance</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ComplianceCard
                  scheme="SFI"
                  rate={portfolioMetrics.complianceRates.sfi}
                  requirements={ENVIRONMENTAL_SCHEMES.SFI.requirements}
                  payment={ENVIRONMENTAL_SCHEMES.SFI.paymentRate}
                />
                <ComplianceCard
                  scheme="Countryside Stewardship"
                  rate={75} // Mock data
                  requirements={ENVIRONMENTAL_SCHEMES.CS.requirements}
                  payment={ENVIRONMENTAL_SCHEMES.CS.paymentRate}
                />
                <ComplianceCard
                  scheme="NVZ Compliance"
                  rate={portfolioMetrics.complianceRates.nvz}
                  requirements={['Nutrient management', 'Storage', 'Application timing']}
                  payment="Regulatory requirement"
                />
              </div>
            </div>
          </>
        )}

        {/* Farm Detail View */}
        {activeView === 'farm' && (
          <div className="space-y-6">
            {/* Farm Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    {selectedFarm ? farms.find(f => f.id === selectedFarm)?.name : 'Select a Farm'}
                  </h2>
                  <p className="text-blue-100">
                    Individual farm environmental monitoring and compliance tracking
                  </p>
                </div>
                <div className="text-right">
                  <select
                    className="bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-xl px-4 py-2"
                    value={selectedFarm || ''}
                    onChange={e => setSelectedFarm(e.target.value)}
                  >
                    <option value="">Select Farm</option>
                    {farms.map(farm => (
                      <option key={farm.id} value={farm.id} className="text-gray-800">
                        {farm.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {selectedFarm && (
              <>
                {/* Farm Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(() => {
                    const farm = farms.find(f => f.id === selectedFarm);
                    return [
                      <MetricCard
                        title="Biodiversity Score"
                        value={farm.metrics.biodiversityScore}
                        unit="/100"
                        status={100 - farm.metrics.biodiversityScore}
                        icon={<TreePine className="w-6 h-6 text-green-600" />}
                      />,
                      <MetricCard
                        title="Water Efficiency"
                        value={farm.metrics.waterEfficiency}
                        unit="%"
                        status={100 - farm.metrics.waterEfficiency}
                        icon={<Droplets className="w-6 h-6 text-blue-600" />}
                      />,
                      <MetricCard
                        title="Nutrient Efficiency"
                        value={farm.metrics.nutrientEfficiency}
                        unit="%"
                        trend={1.2}
                        icon={<Leaf className="w-6 h-6 text-emerald-600" />}
                      />,
                      <MetricCard
                        title="Carbon Footprint"
                        value={farm.metrics.carbonFootprint / 1000}
                        unit=" tCO₂e/ha"
                        status={(farm.metrics.carbonFootprint - 800) / 10}
                        icon={<Wind className="w-6 h-6 text-gray-600" />}
                      />
                    ];
                  })()}
                </div>

                {/* Farm Detail Tabs */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
                  <div className="flex border-b border-gray-200">
                    {['Water Audit', 'Biodiversity', 'Compliance', 'TNFD Metrics'].map((tab) => (
                      <button
                        key={tab}
                        className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                          activeTab === tab.toLowerCase().replace(' ', '')
                            ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                        }`}
                        onClick={() => setActiveTab(tab.toLowerCase().replace(' ', ''))}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className="p-6">
                    {activeTab === 'wateraudit' && (
                      <div className="space-y-6">
                        <h3 className="text-xl font-bold text-gray-800">Water Management Assessment</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-blue-50 rounded-xl p-4">
                            <h4 className="font-semibold text-blue-800 mb-3">Water Sources & Storage</h4>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-700">Borehole Sources</span>
                                <span className="font-medium">2</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-700">Storage Capacity</span>
                                <span className="font-medium">5,000 L</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-700">Recycling Rate</span>
                                <span className="font-medium">40%</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-green-50 rounded-xl p-4">
                            <h4 className="font-semibold text-green-800 mb-3">Treatment & Discharge</h4>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-700">Treatment Type</span>
                                <span className="font-medium">Biological</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-700">Discharge Points</span>
                                <span className="font-medium">1</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-700">Permit Status</span>
                                <span className="font-medium text-green-600">Valid</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'biodiversity' && (
                      <div className="space-y-6">
                        <h3 className="text-xl font-bold text-gray-800">Biodiversity Features</h3>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-green-50 rounded-xl p-4 text-center">
                            <TreePine className="w-8 h-8 text-green-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-green-700">8%</div>
                            <div className="text-sm text-gray-600">Woodland</div>
                          </div>
                          <div className="bg-blue-50 rounded-xl p-4 text-center">
                            <Waves className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-blue-700">2%</div>
                            <div className="text-sm text-gray-600">Wetlands</div>
                          </div>
                          <div className="bg-emerald-50 rounded-xl p-4 text-center">
                            <Leaf className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-emerald-700">5km</div>
                            <div className="text-sm text-gray-600">Hedgerows</div>
                          </div>
                          <div className="bg-amber-50 rounded-xl p-4 text-center">
                            <Circle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-amber-700">20%</div>
                            <div className="text-sm text-gray-600">Cover Crops</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'compliance' && (
                      <div className="space-y-6">
                        <h3 className="text-xl font-bold text-gray-800">Compliance Status</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(() => {
                            const farm = farms.find(f => f.id === selectedFarm);
                            return [
                              {
                                name: 'TNFD Reporting',
                                status: farm.compliance.tnfd,
                                description: 'Nature-related financial disclosures'
                              },
                              {
                                name: 'NVZ Compliance',
                                status: farm.compliance.nvz,
                                description: 'Nitrate Vulnerable Zone regulations'
                              },
                              {
                                name: 'Water Permit',
                                status: farm.compliance.waterPermit,
                                description: 'Abstraction and discharge permits'
                              },
                              {
                                name: 'SFI Enrolled',
                                status: farm.compliance.sfi,
                                description: 'Sustainable Farming Incentive scheme'
                              }
                            ].map((item, i) => (
                              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div>
                                  <div className="font-medium text-gray-800">{item.name}</div>
                                  <div className="text-sm text-gray-600">{item.description}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {item.status ? (
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                  ) : (
                                    <AlertTriangle className="w-5 h-5 text-red-600" />
                                  )}
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    item.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                  }`}>
                                    {item.status ? 'Compliant' : 'Action Required'}
                                  </span>
                                </div>
                              </div>
                            ));
                          })()}
                        </div>
                      </div>
                    )}

                    {activeTab === 'tnfdmetrics' && (
                      <div className="space-y-6">
                        <h3 className="text-xl font-bold text-gray-800">TNFD-Aligned Metrics</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="bg-green-50 rounded-xl p-4">
                            <h4 className="font-semibold text-green-800 mb-3">Land & Ecosystems</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Natural Habitat</span>
                                <span className="font-medium">15.2 ha</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Connectivity Score</span>
                                <span className="font-medium">7.3/10</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Soil Organic Carbon</span>
                                <span className="font-medium">3.2%</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-blue-50 rounded-xl p-4">
                            <h4 className="font-semibold text-blue-800 mb-3">Water Systems</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Withdrawal Intensity</span>
                                <span className="font-medium">6,000 L/day</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Treatment Efficiency</span>
                                <span className="font-medium">85%</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Discharge Quality</span>
                                <span className="font-medium">Compliant</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-purple-50 rounded-xl p-4">
                            <h4 className="font-semibold text-purple-800 mb-3">Biodiversity Impact</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Intactness Index</span>
                                <span className="font-medium">45/100</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Species Richness</span>
                                <span className="font-medium">36 species</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Pollinator Support</span>
                                <span className="font-medium">High</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Chat Panel */}
        <div className="fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              TNFD Expert Assistant
            </h3>
            <p className="text-xs text-gray-600 mt-1">Ask about compliance, risks, and opportunities</p>
          </div>
          
          <div className="h-80 overflow-y-auto p-4 space-y-3">
            {chatMessages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <FileText className="w-8 h-8 mx-auto mb-3 text-blue-400" />
                <p className="text-sm mb-4">Ask about TNFD reporting & environmental compliance</p>
                <div className="space-y-2">
                  <button 
                    className="w-full text-left p-2 bg-blue-50 rounded-lg text-xs hover:bg-blue-100 transition-colors"
                    onClick={() => setCurrentMessage("What farms need immediate attention for TNFD compliance?")}
                  >
                    Which farms need immediate TNFD attention?
                  </button>
                  <button 
                    className="w-full text-left p-2 bg-green-50 rounded-lg text-xs hover:bg-green-100 transition-colors"
                    onClick={() => setCurrentMessage("What environmental scheme opportunities are available?")}
                  >
                    What scheme opportunities are available?
                  </button>
                </div>
              </div>
            )}
            
            {chatMessages.map((message, index) => (
              <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-3 py-2 rounded-xl text-sm ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {message.content}
                  
                  {message.actionItems && (
                    <div className="mt-2 pt-2 border-t border-gray-300/30">
                      <div className="font-semibold mb-1 text-xs opacity-80">Actions:</div>
                      <ul className="space-y-1">
                        {message.actionItems.slice(0, 2).map((item, i) => (
                          <li key={i} className="text-xs opacity-90">• {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-3 py-2 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                    <span className="text-xs">Analyzing...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-gray-100">
            <div className="flex space-x-2">
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="Ask about TNFD compliance..."
                value={currentMessage}
                onChange={e => setCurrentMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                disabled={isLoading}
              />
              <button
                className="bg-blue-600 text-white rounded-xl px-3 py-2 hover:bg-blue-700 disabled:opacity-50 transition-colors"
                onClick={sendMessage}
                disabled={isLoading || !currentMessage.trim()}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UKDairyDashboard;