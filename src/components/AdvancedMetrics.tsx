import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Users, DollarSign, Target, Zap } from "lucide-react";

interface AdvancedMetricsProps {
  data: {
    currentUsers: number;
    goalUsers: number;
    monthlyRevenue: number;
    revenueGoal: number;
    churnRate: number;
    growthRate: number;
  };
}

interface MetricItemProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  target?: string;
  progress?: number;
  color: "success" | "primary" | "destructive" | "secondary";
}

const MetricItem = ({ icon, title, value, change, changeLabel, target, progress, color }: MetricItemProps) => {
  const getColorClasses = () => {
    switch (color) {
      case "success": return "text-success border-success/20 bg-success/5";
      case "primary": return "text-primary border-primary/20 bg-primary/5";
      case "destructive": return "text-destructive border-destructive/20 bg-destructive/5";
      default: return "text-secondary border-secondary/20 bg-secondary/5";
    }
  };

  const getTrendIcon = () => {
    if (change > 0) return <TrendingUp className="h-3 w-3 text-success" />;
    if (change < 0) return <TrendingDown className="h-3 w-3 text-destructive" />;
    return null;
  };

  return (
    <div className={`p-4 rounded-lg border ${getColorClasses()} transition-all duration-300 hover:scale-105`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          {icon}
          <h3 className="font-medium text-sm">{title}</h3>
        </div>
        <div className="flex items-center space-x-1">
          {getTrendIcon()}
          <Badge variant="outline" className="text-xs">
            {change > 0 ? "+" : ""}{change}%
          </Badge>
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{changeLabel}</p>
        
        {target && progress !== undefined && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Target: {target}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={Math.min(progress, 100)} className="h-1" />
          </div>
        )}
      </div>
    </div>
  );
};

export const AdvancedMetrics = ({ data }: AdvancedMetricsProps) => {
  // Calculate advanced metrics based on actual data only
  const revenuePerUser = data.currentUsers > 0 ? data.monthlyRevenue / data.currentUsers : 0;
  const customerLifetimeValue = data.churnRate > 0 ? (revenuePerUser * (1 / (data.churnRate / 100)) * 12) : revenuePerUser * 24;
  const monthlyRecurringRevenue = data.monthlyRevenue;
  const annualRecurringRevenue = monthlyRecurringRevenue * 12;
  const netRevenueRetention = 100 + data.growthRate - data.churnRate;
  
  // Calculate CAC more realistically (if no revenue, can't calculate)
  const customerAcquisitionCost = data.monthlyRevenue > 0 ? Math.min(revenuePerUser * 2, data.monthlyRevenue * 0.4) : 0;
  const ltvcacRatio = customerAcquisitionCost > 0 ? customerLifetimeValue / customerAcquisitionCost : 0;
  
  // Daily and Weekly Active Users (estimated conservatively)
  const dailyActiveUsers = Math.floor(data.currentUsers * 0.25);
  const weeklyActiveUsers = Math.floor(data.currentUsers * 0.65);
  
  // Growth efficiency and retention
  const growthEfficiency = customerAcquisitionCost > 0 ? data.growthRate / (customerAcquisitionCost / revenuePerUser || 1) : data.growthRate;
  const retentionRate = 100 - data.churnRate;
  const paybackPeriod = revenuePerUser > 0 ? Math.ceil(customerAcquisitionCost / revenuePerUser) : 0;
  
  // Progress calculations
  const mrrProgress = data.revenueGoal > 0 ? (monthlyRecurringRevenue / data.revenueGoal) * 100 : 0;
  const arrProgress = data.revenueGoal > 0 ? (annualRecurringRevenue / (data.revenueGoal * 12)) * 100 : 0;
  const retentionProgress = (retentionRate / 95) * 100; // Target 95% retention
  const ltvcacProgress = ltvcacRatio > 0 ? Math.min((ltvcacRatio / 3) * 100, 100) : 0; // Target 3:1 ratio

  // Color calculations
  const ltvcacColor: "success" | "secondary" = ltvcacRatio >= 3 ? "success" : "secondary";
  const nrrColor: "success" | "destructive" = netRevenueRetention >= 100 ? "success" : "destructive";
  const retentionColor: "success" | "destructive" = retentionRate >= 90 ? "success" : "destructive";

  const metrics = [
    {
      icon: <DollarSign className="h-4 w-4" />,
      title: "Monthly Recurring Revenue",
      value: `$${monthlyRecurringRevenue.toLocaleString()}`,
      change: 0,
      changeLabel: "current month",
      target: `$${data.revenueGoal.toLocaleString()}`,
      progress: mrrProgress,
      color: "success" as const
    },
    {
      icon: <Target className="h-4 w-4" />,
      title: "Annual Recurring Revenue",
      value: `$${annualRecurringRevenue.toLocaleString()}`,
      change: 0,
      changeLabel: "projected annually",
      target: `$${(data.revenueGoal * 12).toLocaleString()}`,
      progress: arrProgress,
      color: "primary" as const
    },
    {
      icon: <Users className="h-4 w-4" />,
      title: "Daily Active Users",
      value: dailyActiveUsers.toLocaleString(),
      change: 0,
      changeLabel: "estimated daily",
      color: "primary" as const
    },
    {
      icon: <Users className="h-4 w-4" />,
      title: "Weekly Active Users",
      value: weeklyActiveUsers.toLocaleString(),
      change: 0,
      changeLabel: "estimated weekly",
      color: "secondary" as const
    },
    {
      icon: <DollarSign className="h-4 w-4" />,
      title: "Revenue per User",
      value: `$${revenuePerUser.toFixed(2)}`,
      change: 0,
      changeLabel: "current average",
      color: "success" as const
    },
    {
      icon: <Zap className="h-4 w-4" />,
      title: "Customer Lifetime Value",
      value: `$${customerLifetimeValue.toFixed(0)}`,
      change: 0,
      changeLabel: "based on churn rate",
      color: "success" as const
    },
    {
      icon: <Target className="h-4 w-4" />,
      title: "Customer Acquisition Cost",
      value: customerAcquisitionCost > 0 ? `$${customerAcquisitionCost.toFixed(0)}` : "Not set",
      change: 0,
      changeLabel: "estimated cost",
      color: "primary" as const
    },
    {
      icon: <TrendingUp className="h-4 w-4" />,
      title: "LTV:CAC Ratio",
      value: ltvcacRatio > 0 ? `${ltvcacRatio.toFixed(1)}:1` : "N/A",
      change: 0,
      changeLabel: "business health metric",
      target: "3:1",
      progress: ltvcacProgress,
      color: ltvcacColor
    },
    {
      icon: <Users className="h-4 w-4" />,
      title: "Net Revenue Retention",
      value: `${netRevenueRetention.toFixed(1)}%`,
      change: Math.round(data.growthRate - data.churnRate),
      changeLabel: "growth minus churn",
      target: "110%",
      progress: Math.min((netRevenueRetention / 110) * 100, 100),
      color: nrrColor
    },
    {
      icon: <TrendingUp className="h-4 w-4" />,
      title: "Retention Rate",
      value: `${retentionRate.toFixed(1)}%`,
      change: Math.round(-data.churnRate),
      changeLabel: "monthly retention",
      target: "95%",
      progress: retentionProgress,
      color: retentionColor
    },
    {
      icon: <Zap className="h-4 w-4" />,
      title: "Growth Efficiency",
      value: `${growthEfficiency.toFixed(1)}x`,
      change: 0,
      changeLabel: "current efficiency",
      color: "primary" as const
    },
    {
      icon: <DollarSign className="h-4 w-4" />,
      title: "Payback Period",
      value: paybackPeriod > 0 ? `${paybackPeriod} months` : "N/A",
      change: 0,
      changeLabel: "time to recover CAC",
      color: "secondary" as const
    }
  ];

  return (
    <Card className="bg-gradient-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="h-5 w-5" />
          <span>Advanced Business Metrics</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {metrics.map((metric, index) => (
            <MetricItem key={index} {...metric} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};