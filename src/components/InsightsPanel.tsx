import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface InsightsPanelProps {
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

export const InsightsPanel = ({ data }: InsightsPanelProps) => {
  const { currentUsers, goalUsers, monthlyRevenue, revenueGoal, churnRate, growthRate, historicalData } = data;
  
  // Calculate insights
  const timeToGoal = growthRate > 0 ? Math.ceil((goalUsers - currentUsers) / (currentUsers * (growthRate / 100))) : 0;
  const revenuePerUser = currentUsers > 0 ? monthlyRevenue / currentUsers : 0;
  const projectedRevenue = goalUsers * revenuePerUser;
  
  // Calculate month-over-month trends if historical data exists
  const getMonthlyTrend = () => {
    if (historicalData.length < 2) return { users: 0, revenue: 0 };
    
    const lastMonth = historicalData[historicalData.length - 1];
    const prevMonth = historicalData[historicalData.length - 2];
    
    const userTrend = prevMonth.users > 0 ? ((lastMonth.users - prevMonth.users) / prevMonth.users) * 100 : 0;
    const revenueTrend = prevMonth.revenue > 0 ? ((lastMonth.revenue - prevMonth.revenue) / prevMonth.revenue) * 100 : 0;
    
    return { users: Math.round(userTrend * 10) / 10, revenue: Math.round(revenueTrend * 10) / 10 };
  };
  
  const trends = getMonthlyTrend();
  
  const getGrowthStatus = () => {
    if (growthRate >= 10) return { text: "Excellent Growth", color: "bg-success" };
    if (growthRate >= 5) return { text: "Good Growth", color: "bg-primary" };
    if (growthRate > 0) return { text: "Slow Growth", color: "bg-secondary" };
    return { text: "No Growth", color: "bg-destructive" };
  };

  const getChurnStatus = () => {
    if (churnRate <= 2) return { text: "Excellent", color: "bg-success" };
    if (churnRate <= 5) return { text: "Good", color: "bg-primary" };
    if (churnRate <= 10) return { text: "Average", color: "bg-secondary" };
    return { text: "High Risk", color: "bg-destructive" };
  };

  const insights = [
    {
      title: "Time to Goal",
      value: timeToGoal > 0 ? `${timeToGoal} months` : "Set growth rate",
      description: "At current growth rate",
      trend: null
    },
    {
      title: "Revenue per User",
      value: `$${revenuePerUser.toFixed(2)}`,
      description: "Average monthly revenue",
      trend: trends.revenue !== 0 ? trends.revenue : null
    },
    {
      title: "Monthly Growth",
      value: `${trends.users !== 0 ? trends.users : growthRate}%`,
      description: trends.users !== 0 ? "Actual last month" : "Target growth rate",
      trend: trends.users !== 0 ? trends.users : null
    },
    {
      title: "User Momentum",
      value: `${growthRate}%`,
      description: "Monthly user growth target",
      badge: getGrowthStatus()
    },
    {
      title: "Churn Rate",
      value: `${churnRate}%`,
      description: "Monthly user churn",
      badge: getChurnStatus()
    },
    {
      title: "Revenue Trend",
      value: `${trends.revenue !== 0 ? (trends.revenue > 0 ? '+' : '') + trends.revenue : 'N/A'}%`,
      description: trends.revenue !== 0 ? "Last month change" : "No historical data",
      trend: trends.revenue !== 0 ? trends.revenue : null
    }
  ];

  return (
    <Card className="bg-gradient-card border-border/50">
      <CardHeader>
        <CardTitle>Key Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/20">
            <div className="space-y-1">
              <p className="font-medium">{insight.title}</p>
              <p className="text-sm text-muted-foreground">{insight.description}</p>
            </div>
            <div className="text-right space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-lg font-bold">{insight.value}</p>
                {insight.trend !== null && insight.trend !== undefined && (
                  <Badge variant="outline" className={
                    insight.trend > 0 ? "text-success border-success" : 
                    insight.trend < 0 ? "text-destructive border-destructive" : 
                    "text-muted-foreground"
                  }>
                    {insight.trend > 0 ? "↗" : insight.trend < 0 ? "↘" : "→"}
                  </Badge>
                )}
              </div>
              {insight.badge && (
                <Badge className={`${insight.badge.color} text-white`}>
                  {insight.badge.text}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};