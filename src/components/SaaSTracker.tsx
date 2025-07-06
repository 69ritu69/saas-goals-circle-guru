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

const CircularProgress = ({ progress, size = 120 }: { progress: number; size?: number }) => {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--border))"
          strokeWidth="4"
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--accent))" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          {Math.round(progress)}%
        </span>
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
                <CircularProgress progress={Math.min(progress, 100)} size={140} />
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