import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ProgressDashboardProps {
  data: {
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
  };
}

const CircularProgress = ({ progress, size = 120, strokeWidth = 8, label, value }: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  label: string;
  value: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--border))"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="opacity-20"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
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
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold">{Math.round(progress)}%</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    </div>
  );
};

const GaugeProgress = ({ progress, label, value, maxValue }: {
  progress: number;
  label: string;
  value: number;
  maxValue: number;
}) => {
  const getGaugeColor = () => {
    if (progress >= 80) return "text-success";
    if (progress >= 60) return "text-primary";
    if (progress >= 40) return "text-accent";
    return "text-muted-foreground";
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{label}</span>
        <Badge variant="outline" className={getGaugeColor()}>
          {value.toLocaleString()} / {maxValue.toLocaleString()}
        </Badge>
      </div>
      <div className="relative">
        <Progress value={Math.min(progress, 100)} className="h-3" />
        <div className={`absolute top-0 left-0 h-3 rounded-full transition-all duration-500 ${
          progress >= 80 ? 'bg-success' : 
          progress >= 60 ? 'bg-primary' : 
          progress >= 40 ? 'bg-accent' : 'bg-secondary'
        }`} style={{ width: `${Math.min(progress, 100)}%` }} />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0</span>
        <span className="font-medium">{Math.round(progress)}% Complete</span>
        <span>{maxValue.toLocaleString()}</span>
      </div>
    </div>
  );
};

export const ProgressDashboard = ({ data }: ProgressDashboardProps) => {
  const userProgress = data.goalUsers > 0 ? (data.currentUsers / data.goalUsers) * 100 : 0;
  const revenueProgress = data.revenueGoal > 0 ? (data.monthlyRevenue / data.revenueGoal) * 100 : 0;
  
  // Calculate additional metrics
  const revenuePerUser = data.currentUsers > 0 ? data.monthlyRevenue / data.currentUsers : 0;
  const projectedMRR = data.goalUsers * revenuePerUser;
  const growthMomentum = data.growthRate * (1 - data.churnRate / 100);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Primary Metrics with Circular Progress */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="text-center">User Growth</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <CircularProgress 
            progress={userProgress} 
            label="Users"
            value={`${data.currentUsers}/${data.goalUsers}`}
          />
          <div className="text-center space-y-1">
            <p className="text-2xl font-bold">{data.currentUsers.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">
              {(data.goalUsers - data.currentUsers).toLocaleString()} remaining
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="text-center">Revenue Growth</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <CircularProgress 
            progress={revenueProgress} 
            label="Revenue"
            value={`$${data.monthlyRevenue}/$${data.revenueGoal}`}
          />
          <div className="text-center space-y-1">
            <p className="text-2xl font-bold">${data.monthlyRevenue.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">
              ${(data.revenueGoal - data.monthlyRevenue).toLocaleString()} to goal
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <GaugeProgress
            progress={Math.max(0, 100 - data.churnRate * 10)}
            label="Retention Rate"
            value={100 - data.churnRate}
            maxValue={100}
          />
          
          <GaugeProgress
            progress={Math.min(data.growthRate * 5, 100)}
            label="Growth Momentum"
            value={Math.round(growthMomentum * 10) / 10}
            maxValue={20}
          />
          
          <div className="pt-2 border-t border-border/50">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Revenue per User</span>
              <span className="font-bold">${revenuePerUser.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-muted-foreground">Projected MRR at Goal</span>
              <span className="font-bold">${projectedMRR.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};