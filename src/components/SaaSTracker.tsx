import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Share, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MetricCard } from "./MetricCard";
import IntegratedSettingsModal from "./IntegratedSettingsModal";
import { GrowthChart } from "./GrowthChart";
import { InsightsPanel } from "./InsightsPanel";
import { ProgressDashboard } from "./ProgressDashboard";
import { AdvancedMetrics } from "./AdvancedMetrics";
import { AnalyticsCharts } from "./AnalyticsCharts";


interface SaaSData {
  name: string;
  currentUsers: number;
  goalUsers: number;
  monthlyRevenue: number;
  revenueGoal: number;
  churnRate: number;
  growthRate: number;
  historicalData: Array<{
    month: string;
    users: number;
    revenue: number;
  }>;
}

const RadialProgress = ({ progress, size = 200 }: { progress: number; size?: number }) => {
  const center = size / 2;
  const segments = 12; // Number of radial segments
  const rings = 5; // Number of concentric rings
  const maxRadius = center - 20;
  const minRadius = 30;
  
  // Calculate how many segments should be filled based on progress
  const totalCells = segments * rings;
  const filledCells = Math.floor((progress / 100) * totalCells);
  
  const renderRadialGrid = () => {
    const elements = [];
    
    // Create concentric rings and radial lines
    for (let ring = 0; ring < rings; ring++) {
      const radius = minRadius + (ring * (maxRadius - minRadius)) / (rings - 1);
      
      for (let segment = 0; segment < segments; segment++) {
        const angle = (segment * 360) / segments;
        const cellIndex = ring * segments + segment;
        const isFilled = cellIndex < filledCells;
        
        // Create radial segment path
        const startAngle = (angle - 360 / segments / 2) * Math.PI / 180;
        const endAngle = (angle + 360 / segments / 2) * Math.PI / 180;
        const innerR = ring === 0 ? minRadius : minRadius + ((ring - 1) * (maxRadius - minRadius)) / (rings - 1);
        const outerR = radius;
        
        const x1 = center + innerR * Math.cos(startAngle);
        const y1 = center + innerR * Math.sin(startAngle);
        const x2 = center + outerR * Math.cos(startAngle);
        const y2 = center + outerR * Math.sin(startAngle);
        const x3 = center + outerR * Math.cos(endAngle);
        const y3 = center + outerR * Math.sin(endAngle);
        const x4 = center + innerR * Math.cos(endAngle);
        const y4 = center + innerR * Math.sin(endAngle);
        
        const pathData = `M ${x1} ${y1} L ${x2} ${y2} A ${outerR} ${outerR} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerR} ${innerR} 0 0 0 ${x1} ${y1}`;
        
        elements.push(
          <path
            key={`segment-${ring}-${segment}`}
            d={pathData}
            fill={isFilled ? `url(#radialGradient-${cellIndex})` : "hsl(var(--border))"}
            stroke="hsl(var(--background))"
            strokeWidth="1"
            className={`transition-all duration-300 ${isFilled ? 'animate-pulse-slow' : ''}`}
            style={{
              animationDelay: `${cellIndex * 50}ms`
            }}
          />
        );
      }
    }
    
    // Add radial lines
    for (let i = 0; i < segments; i++) {
      const angle = (i * 360) / segments * Math.PI / 180;
      const x1 = center + minRadius * Math.cos(angle);
      const y1 = center + minRadius * Math.sin(angle);
      const x2 = center + maxRadius * Math.cos(angle);
      const y2 = center + maxRadius * Math.sin(angle);
      
      elements.push(
        <line
          key={`radial-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="hsl(var(--border))"
          strokeWidth="1"
          opacity="0.5"
        />
      );
    }
    
    // Add concentric circles
    for (let i = 0; i < rings; i++) {
      const radius = minRadius + (i * (maxRadius - minRadius)) / (rings - 1);
      elements.push(
        <circle
          key={`ring-${i}`}
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="1"
          opacity="0.5"
        />
      );
    }
    
    return elements;
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="overflow-visible">
        <defs>
          {/* Create multiple gradients for different segments */}
          {Array.from({ length: totalCells }, (_, i) => (
            <radialGradient key={i} id={`radialGradient-${i}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(var(--primary))" opacity="0.8" />
              <stop offset="50%" stopColor="hsl(var(--accent))" opacity="0.6" />
              <stop offset="100%" stopColor="hsl(var(--primary))" opacity="0.9" />
            </radialGradient>
          ))}
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {renderRadialGrid()}
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          {Math.round(progress)}%
        </span>
        <span className="text-xs text-muted-foreground mt-1">Progress</span>
      </div>
    </div>
  );
};

export const SaaSTracker = () => {
  const [saasData, setSaasData] = useState<SaaSData>({
    name: "",
    currentUsers: 0,
    goalUsers: 0,
    monthlyRevenue: 0,
    revenueGoal: 0,
    churnRate: 0,
    growthRate: 0,
    historicalData: [],
  });
  const [isEditing, setIsEditing] = useState(true);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const { toast } = useToast();

  // Check if essential details are filled
  const isEssentialDataEmpty = () => {
    return (
      !saasData.name.trim() ||
      saasData.currentUsers === 0 ||
      saasData.goalUsers === 0 ||
      saasData.monthlyRevenue === 0 ||
      saasData.revenueGoal === 0
    );
  };

  // Show settings modal automatically when essential data is empty
  useEffect(() => {
    if (isEssentialDataEmpty()) {
      setShowSettingsModal(true);
    }
  }, [saasData]);

  const progress = saasData.goalUsers > 0 ? (saasData.currentUsers / saasData.goalUsers) * 100 : 0;
  const revenueProgress = saasData.revenueGoal > 0 ? (saasData.monthlyRevenue / saasData.revenueGoal) * 100 : 0;

  const handleSettingsChange = (newData: SaaSData) => {
    setSaasData(newData);
    setShowSettingsModal(false);
  };


  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "SaaS Details Saved!",
      description: "Your progress tracking has been updated.",
    });
  };

  const handleCopy = () => {
    const shareText = `🚀 ${saasData.name} Progress Update!\n\n📊 Users: ${saasData.currentUsers.toLocaleString()}/${saasData.goalUsers.toLocaleString()} (${Math.round(progress)}%)\n💰 Revenue: $${saasData.monthlyRevenue.toLocaleString()}/$${saasData.revenueGoal.toLocaleString()} (${Math.round(revenueProgress)}%)\n📈 Growth Rate: ${saasData.growthRate}%/month\n📉 Churn Rate: ${saasData.churnRate}%\n\n#SaaS #Growth #Startup #Metrics`;
    
    navigator.clipboard.writeText(shareText);
    toast({
      title: "Copied to clipboard!",
      description: "Share your comprehensive progress on social media.",
    });
  };

  const handleShare = async () => {
    const shareText = `🚀 ${saasData.name} Progress Update!\n\n📊 Users: ${saasData.currentUsers.toLocaleString()}/${saasData.goalUsers.toLocaleString()} (${Math.round(progress)}%)\n💰 Revenue: $${saasData.monthlyRevenue.toLocaleString()}/$${saasData.revenueGoal.toLocaleString()} (${Math.round(revenueProgress)}%)\n📈 Growth Rate: ${saasData.growthRate}%/month\n📉 Churn Rate: ${saasData.churnRate}%\n\n#SaaS #Growth #Startup #Metrics`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${saasData.name} Progress`,
          text: shareText,
        });
      } catch (err) {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            SaaS Growth Tracker - Monitor Your Business Metrics
          </h1>
          <p className="text-muted-foreground text-lg">
            Track monthly active users, revenue goals, and business analytics for your SaaS startup. Monitor growth rates, churn metrics, and achieve your business objectives with comprehensive dashboard insights.
          </p>
        </div>

        {/* Main Dashboard */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Dashboard Overview</h2>
            {/* Enhanced Progress Dashboard */}
            <div id="progress-dashboard">
              <ProgressDashboard data={saasData} />
            </div>
            
            {/* Legacy Radial Progress (keeping as alternative visualization) */}
            <div id="insights-and-classic" className="grid gap-6 lg:grid-cols-2">
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle>Classic Progress View</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <RadialProgress progress={Math.min(progress, 100)} size={240} />
                </CardContent>
              </Card>

              <InsightsPanel data={saasData} />
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Business Metrics & KPIs</h2>
            {/* Advanced Business Metrics */}
            <div id="advanced-metrics">
              <AdvancedMetrics data={saasData} />
            </div>
            
            <h3 className="text-lg font-medium text-foreground mt-6 mb-4">Quick Metrics Summary</h3>
            {/* Legacy User & Revenue Metrics (keeping for comparison) */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle>User Engagement Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <MetricCard
                      title="Daily Active Users"
                      current={Math.floor(saasData.currentUsers * 0.25)}
                      goal={Math.floor(saasData.goalUsers * 0.25)}
                      trend={0}
                    />
                    <MetricCard
                      title="Weekly Active Users"
                      current={Math.floor(saasData.currentUsers * 0.65)}
                      goal={Math.floor(saasData.goalUsers * 0.65)}
                      trend={0}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle>Quick Revenue Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <MetricCard
                      title="Average Revenue Per User"
                      current={saasData.currentUsers > 0 ? Math.floor(saasData.monthlyRevenue / saasData.currentUsers) : 0}
                      goal={50}
                      prefix="$"
                      trend={0}
                      color="success"
                    />
                    <MetricCard
                      title="Lifetime Value"
                      current={saasData.currentUsers > 0 ? Math.floor((saasData.monthlyRevenue / saasData.currentUsers) * 12) : 0}
                      goal={600}
                      prefix="$"
                      trend={0}
                      color="success"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Growth Analytics & Trends</h2>
            {/* Growth Trend Chart */}
            <div id="analytics-charts">
              <GrowthChart data={saasData.historicalData} />
              
              {/* Advanced Analytics Charts */}
              <AnalyticsCharts data={saasData} />
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Configuration & Settings</h2>
            {/* SaaS Configuration Card */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  SaaS Configuration
                  {!isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="saas-name">SaaS Name</Label>
                    <Input
                      id="saas-name"
                      placeholder="Enter your SaaS name"
                      value={saasData.name}
                      onChange={(e) =>
                        setSaasData({ ...saasData, name: e.target.value })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="current-users">Current Monthly Active Users</Label>
                    <Input
                      id="current-users"
                      type="number"
                      placeholder="0"
                      value={saasData.currentUsers}
                      onChange={(e) =>
                        setSaasData({
                          ...saasData,
                          currentUsers: parseInt(e.target.value) || 0,
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="goal-users">User Goal</Label>
                    <Input
                      id="goal-users"
                      type="number"
                      placeholder="0"
                      value={saasData.goalUsers}
                      onChange={(e) =>
                        setSaasData({
                          ...saasData,
                          goalUsers: parseInt(e.target.value) || 0,
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="monthly-revenue">Monthly Revenue ($)</Label>
                    <Input
                      id="monthly-revenue"
                      type="number"
                      placeholder="0"
                      value={saasData.monthlyRevenue}
                      onChange={(e) =>
                        setSaasData({
                          ...saasData,
                          monthlyRevenue: parseInt(e.target.value) || 0,
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="revenue-goal">Revenue Goal ($)</Label>
                    <Input
                      id="revenue-goal"
                      type="number"
                      placeholder="0"
                      value={saasData.revenueGoal}
                      onChange={(e) =>
                        setSaasData({
                          ...saasData,
                          revenueGoal: parseInt(e.target.value) || 0,
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="churn-rate">Churn Rate (%)</Label>
                    <Input
                      id="churn-rate"
                      type="number"
                      placeholder="0"
                      value={saasData.churnRate}
                      onChange={(e) =>
                        setSaasData({
                          ...saasData,
                          churnRate: parseInt(e.target.value) || 0,
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="growth-rate">Growth Rate (%/month)</Label>
                    <Input
                      id="growth-rate"
                      type="number"
                      placeholder="0"
                      value={saasData.growthRate}
                      onChange={(e) =>
                        setSaasData({
                          ...saasData,
                          growthRate: parseInt(e.target.value) || 0,
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="space-y-3">
                    <Button onClick={handleSave} className="w-full">
                      Save Configuration
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Display Preferences Card */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Display Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Currency Symbol</Label>
                    <select className="w-full px-3 py-2 bg-background border border-border rounded-md">
                      <option value="$">$ - USD</option>
                      <option value="€">€ - EUR</option>
                      <option value="£">£ - GBP</option>
                      <option value="¥">¥ - JPY</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Number Format</Label>
                    <select className="w-full px-3 py-2 bg-background border border-border rounded-md">
                      <option value="en-US">1,234.56 (US)</option>
                      <option value="en-GB">1,234.56 (UK)</option>
                      <option value="de-DE">1.234,56 (DE)</option>
                      <option value="fr-FR">1 234,56 (FR)</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Compact Dashboard View</Label>
                    <input type="checkbox" className="h-4 w-4" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Show Animation Effects</Label>
                    <input type="checkbox" className="h-4 w-4" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Auto-refresh Data</Label>
                    <input type="checkbox" className="h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Goal Tracking Card */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Goal Tracking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Goal Period</Label>
                    <select className="w-full px-3 py-2 bg-background border border-border rounded-md">
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Progress Calculation</Label>
                    <select className="w-full px-3 py-2 bg-background border border-border rounded-md">
                      <option value="linear">Linear Progress</option>
                      <option value="weighted">Weighted by Time</option>
                      <option value="milestone">Milestone Based</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Send Goal Reminders</Label>
                    <input type="checkbox" className="h-4 w-4" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Celebrate Milestones</Label>
                    <input type="checkbox" className="h-4 w-4" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Weekly Progress Reports</Label>
                    <input type="checkbox" className="h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Management Card */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <Button variant="outline" className="w-full justify-start">
                    Export Dashboard Data (JSON)
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    Export Charts as Images
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    Import Historical Data
                  </Button>
                  
                  <Button variant="destructive" className="w-full justify-start">
                    Reset All Data
                  </Button>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Auto-backup Data</Label>
                      <input type="checkbox" className="h-4 w-4" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>Sync Across Devices</Label>
                      <input type="checkbox" className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Share Section */}
        {!isEditing && saasData.name && (
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Share Your Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg border border-border/50">
                <p className="text-sm whitespace-pre-line">
                  🚀 {saasData.name} Progress Update!
                  {"\n\n"}
                  📊 Users: {saasData.currentUsers.toLocaleString()}/{saasData.goalUsers.toLocaleString()} ({Math.round(progress)}%)
                  {"\n"}
                  💰 Revenue: ${saasData.monthlyRevenue.toLocaleString()}/${saasData.revenueGoal.toLocaleString()} ({Math.round(revenueProgress)}%)
                  {"\n"}
                  📈 Growth Rate: {saasData.growthRate}%/month
                  {"\n"}
                  📉 Churn Rate: {saasData.churnRate}%
                  {"\n\n"}
                  #SaaS #Growth #Startup #Metrics
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleCopy} className="flex-1">
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Text
                </Button>
                <Button onClick={handleShare} variant="outline" className="flex-1">
                  <Share className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        {/* Integrated Settings Modal - Auto-show when essential data is empty */}
        <IntegratedSettingsModal 
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          data={saasData}
          onSave={handleSettingsChange}
          isRequired={isEssentialDataEmpty()}
        />
      </div>
    </div>
  );
};