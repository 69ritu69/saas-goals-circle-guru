import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Copy, Share } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SaaSData {
  name: string;
  currentUsers: number;
  goalUsers: number;
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
  });
  const [isEditing, setIsEditing] = useState(true);
  const { toast } = useToast();

  const progress = saasData.goalUsers > 0 ? (saasData.currentUsers / saasData.goalUsers) * 100 : 0;

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
    const shareText = `🚀 ${saasData.name} Progress Update!\n\n📊 Current Users: ${saasData.currentUsers.toLocaleString()}\n🎯 Goal: ${saasData.goalUsers.toLocaleString()} users\n📈 Progress: ${Math.round(progress)}%\n\n#SaaS #Growth #Startup`;
    
    navigator.clipboard.writeText(shareText);
    toast({
      title: "Copied to clipboard!",
      description: "Share your progress on social media.",
    });
  };

  const handleShare = async () => {
    const shareText = `🚀 ${saasData.name} Progress Update!\n\n📊 Current Users: ${saasData.currentUsers.toLocaleString()}\n🎯 Goal: ${saasData.goalUsers.toLocaleString()} users\n📈 Progress: ${Math.round(progress)}%\n\n#SaaS #Growth #Startup`;
    
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
        <div className="grid gap-8 md:grid-cols-2">
          {/* Setup Card */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                SaaS Details
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
                <Label htmlFor="goal-users">Goal Users</Label>
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

              {isEditing && (
                <Button onClick={handleSave} className="w-full">
                  Save Details
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Progress Card */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Progress Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <RadialProgress progress={Math.min(progress, 100)} size={240} />
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Current Users</span>
                  <Badge variant="secondary" className="text-lg">
                    {saasData.currentUsers.toLocaleString()}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Goal</span>
                  <Badge variant="outline" className="text-lg">
                    {saasData.goalUsers.toLocaleString()}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Remaining</span>
                  <Badge variant="destructive" className="text-lg">
                    {Math.max(saasData.goalUsers - saasData.currentUsers, 0).toLocaleString()}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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
                  📊 Current Users: {saasData.currentUsers.toLocaleString()}
                  {"\n"}
                  🎯 Goal: {saasData.goalUsers.toLocaleString()} users
                  {"\n"}
                  📈 Progress: {Math.round(progress)}%
                  {"\n\n"}
                  #SaaS #Growth #Startup
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