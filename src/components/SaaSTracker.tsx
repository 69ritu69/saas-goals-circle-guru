import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Share, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MetricCard } from "./MetricCard";
import { GrowthChart } from "./GrowthChart";
import { InsightsPanel } from "./InsightsPanel";

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
    goalUsers: 1000,
    monthlyRevenue: 0,
    revenueGoal: 10000,
    churnRate: 5,
    growthRate: 10,
    historicalData: [
      { month: "Jan", users: 100, revenue: 500 },
      { month: "Feb", users: 150, revenue: 750 },
      { month: "Mar", users: 220, revenue: 1100 },
      { month: "Apr", users: 300, revenue: 1500 },
      { month: "May", users: 400, revenue: 2000 },
      { month: "Jun", users: 520, revenue: 2600 },
    ],
  });
  const [isEditing, setIsEditing] = useState(true);
  const { toast } = useToast();

  const progress = saasData.goalUsers > 0 ? (saasData.currentUsers / saasData.goalUsers) * 100 : 0;
  const revenueProgress = saasData.revenueGoal > 0 ? (saasData.monthlyRevenue / saasData.revenueGoal) * 100 : 0;

  const handleSave = () => {
    if (saasData.name.trim()) {
      setIsEditing(false);
      toast({
        title: "SaaS Details Saved!",
        description: "Your progress tracking has been updated.",
      });
    }
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
            SaaS Growth Tracker
          </h1>
          <p className="text-muted-foreground text-lg">
            Track your monthly active users and achieve your growth goals
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
            {/* Key Metrics Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="Monthly Active Users"
                current={saasData.currentUsers}
                goal={saasData.goalUsers}
                trend={saasData.growthRate}
              />
              <MetricCard
                title="Monthly Revenue"
                current={saasData.monthlyRevenue}
                goal={saasData.revenueGoal}
                prefix="$"
                trend={15}
                color="success"
              />
              <MetricCard
                title="Churn Rate"
                current={saasData.churnRate}
                goal={2}
                suffix="%"
                trend={-2}
                color="destructive"
              />
              <MetricCard
                title="Growth Rate"
                current={saasData.growthRate}
                goal={20}
                suffix="%"
                trend={5}
                color="primary"
              />
            </div>

            {/* Progress Visualization */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle>User Progress Visualization</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <RadialProgress progress={Math.min(progress, 100)} size={240} />
                </CardContent>
              </Card>

              <InsightsPanel data={saasData} />
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            {/* Detailed Metrics */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle>User Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <MetricCard
                      title="Daily Active Users"
                      current={Math.floor(saasData.currentUsers * 0.3)}
                      goal={Math.floor(saasData.goalUsers * 0.3)}
                      trend={8}
                    />
                    <MetricCard
                      title="Weekly Active Users"
                      current={Math.floor(saasData.currentUsers * 0.7)}
                      goal={Math.floor(saasData.goalUsers * 0.7)}
                      trend={12}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle>Revenue Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <MetricCard
                      title="Average Revenue Per User"
                      current={saasData.currentUsers > 0 ? Math.floor(saasData.monthlyRevenue / saasData.currentUsers) : 0}
                      goal={50}
                      prefix="$"
                      trend={10}
                      color="success"
                    />
                    <MetricCard
                      title="Lifetime Value"
                      current={saasData.currentUsers > 0 ? Math.floor((saasData.monthlyRevenue / saasData.currentUsers) * 12) : 0}
                      goal={600}
                      prefix="$"
                      trend={15}
                      color="success"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <GrowthChart data={saasData.historicalData} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            {/* Setup Card */}
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
                      placeholder="1000"
                      value={saasData.goalUsers}
                      onChange={(e) =>
                        setSaasData({
                          ...saasData,
                          goalUsers: parseInt(e.target.value) || 1000,
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
                      placeholder="10000"
                      value={saasData.revenueGoal}
                      onChange={(e) =>
                        setSaasData({
                          ...saasData,
                          revenueGoal: parseInt(e.target.value) || 10000,
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
                      placeholder="5"
                      value={saasData.churnRate}
                      onChange={(e) =>
                        setSaasData({
                          ...saasData,
                          churnRate: parseInt(e.target.value) || 5,
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
                      placeholder="10"
                      value={saasData.growthRate}
                      onChange={(e) =>
                        setSaasData({
                          ...saasData,
                          growthRate: parseInt(e.target.value) || 10,
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {isEditing && (
                  <Button onClick={handleSave} className="w-full">
                    Save Configuration
                  </Button>
                )}
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
      </div>
    </div>
  );
};