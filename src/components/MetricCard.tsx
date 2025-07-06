import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface MetricCardProps {
  title: string;
  current: number;
  goal: number;
  prefix?: string;
  suffix?: string;
  trend?: number;
  color?: "primary" | "success" | "destructive" | "secondary";
}

export const MetricCard = ({ 
  title, 
  current, 
  goal, 
  prefix = "", 
  suffix = "", 
  trend = 0,
  color = "primary" 
}: MetricCardProps) => {
  const progress = goal > 0 ? (current / goal) * 100 : 0;
  const remaining = Math.max(goal - current, 0);
  
  const getProgressColor = () => {
    if (progress >= 100) return "bg-success";
    if (progress >= 75) return "bg-primary";
    if (progress >= 50) return "bg-accent";
    return "bg-secondary";
  };

  const getTrendColor = () => {
    if (trend > 0) return "text-success";
    if (trend < 0) return "text-destructive";
    return "text-muted-foreground";
  };

  return (
    <Card className="bg-gradient-card border-border/50 hover:border-primary/20 transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold">
            {prefix}{current.toLocaleString()}{suffix}
          </span>
          {trend !== 0 && (
            <Badge variant="outline" className={getTrendColor()}>
              {trend > 0 ? "+" : ""}{trend}%
            </Badge>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Goal: {prefix}{goal.toLocaleString()}{suffix}</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={Math.min(progress, 100)} className={`h-2 ${getProgressColor()}`} />
        </div>
        
        <div className="text-xs text-muted-foreground">
          <span>{remaining.toLocaleString()} {suffix} remaining</span>
        </div>
      </CardContent>
    </Card>
  );
};