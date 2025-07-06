import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface GrowthChartProps {
  data: Array<{
    month: string;
    users: number;
    revenue: number;
  }>;
}

export const GrowthChart = ({ data }: GrowthChartProps) => {
  return (
    <Card className="bg-gradient-card border-border/50">
      <CardHeader>
        <CardTitle>Growth Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px"
                }}
              />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                name="Users"
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="hsl(var(--success))" 
                strokeWidth={3}
                dot={{ fill: "hsl(var(--success))", strokeWidth: 2, r: 4 }}
                name="Revenue ($)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};