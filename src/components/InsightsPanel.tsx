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
  };
}

export const InsightsPanel = ({ data }: InsightsPanelProps) => {
  const { currentUsers, goalUsers, monthlyRevenue, revenueGoal, churnRate, growthRate } = data;
  
  // Calculate insights
  const timeToGoal = growthRate > 0 ? Math.ceil((goalUsers - currentUsers) / (currentUsers * (growthRate / 100))) : 0;
  const revenuePerUser = currentUsers > 0 ? monthlyRevenue / currentUsers : 0;
  const projectedRevenue = goalUsers * revenuePerUser;
  
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
      description: "At current growth rate"
    },
    {
      title: "Revenue per User",
      value: `$${revenuePerUser.toFixed(2)}`,
      description: "Average monthly revenue"
    },
    {
      title: "Projected Revenue",
      value: `$${projectedRevenue.toLocaleString()}`,
      description: "When goal is reached"
    },
    {
      title: "Growth Rate",
      value: `${growthRate}%`,
      description: "Monthly user growth",
      badge: getGrowthStatus()
    },
    {
      title: "Churn Rate",
      value: `${churnRate}%`,
      description: "Monthly user churn",
      badge: getChurnStatus()
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
              <p className="text-lg font-bold">{insight.value}</p>
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