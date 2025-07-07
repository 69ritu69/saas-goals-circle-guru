import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ComposedChart,
  Line
} from 'recharts';

interface AnalyticsChartsProps {
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

export const AnalyticsCharts = ({ data }: AnalyticsChartsProps) => {
  // Revenue breakdown data
  const revenueBreakdown = [
    { name: 'New Customers', value: Math.floor(data.monthlyRevenue * 0.4), color: 'hsl(var(--primary))' },
    { name: 'Existing Customers', value: Math.floor(data.monthlyRevenue * 0.5), color: 'hsl(var(--success))' },
    { name: 'Upgrades', value: Math.floor(data.monthlyRevenue * 0.1), color: 'hsl(var(--accent))' }
  ];

  // User acquisition funnel
  const acquisitionFunnel = [
    { stage: 'Visitors', count: 10000, conversion: 100 },
    { stage: 'Signups', count: 2000, conversion: 20 },
    { stage: 'Trial Users', count: 1500, conversion: 15 },
    { stage: 'Paid Users', count: data.currentUsers, conversion: (data.currentUsers / 10000) * 100 },
  ];

  // Monthly comparison data
  const monthlyComparison = data.historicalData.map((item, index) => ({
    ...item,
    previousYear: Math.floor(item.users * 0.7), // Simulated previous year data
    revenueGrowth: index > 0 ? ((item.revenue - data.historicalData[index - 1].revenue) / data.historicalData[index - 1].revenue) * 100 : 0,
    userGrowth: index > 0 ? ((item.users - data.historicalData[index - 1].users) / data.historicalData[index - 1].users) * 100 : 0
  }));

  // Cohort retention simulation
  const cohortData = [
    { month: 'M0', retention: 100 },
    { month: 'M1', retention: 85 },
    { month: 'M2', retention: 78 },
    { month: 'M3', retention: 72 },
    { month: 'M4', retention: 68 },
    { month: 'M5', retention: 65 },
    { month: 'M6', retention: 63 }
  ];

  // Forecasting data (6 months ahead)
  const forecastData = [...data.historicalData];
  for (let i = 1; i <= 6; i++) {
    const lastMonth = forecastData[forecastData.length - 1];
    const projectedUsers = Math.floor(lastMonth.users * (1 + data.growthRate / 100));
    const projectedRevenue = Math.floor(lastMonth.revenue * (1 + (data.growthRate + 5) / 100));
    
    forecastData.push({
      month: `Proj ${i}`,
      users: projectedUsers,
      revenue: projectedRevenue
    });
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Revenue Breakdown */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {revenueBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={CustomTooltip} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              {revenueBreakdown.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <div className="text-xs">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-muted-foreground">${item.value.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Acquisition Funnel */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>User Acquisition Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={acquisitionFunnel} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis 
                    dataKey="stage" 
                    type="category" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    width={80}
                  />
                  <Tooltip content={CustomTooltip} />
                  <Bar 
                    dataKey="count" 
                    fill="hsl(var(--primary))" 
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Year over Year Comparison */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle>Year-over-Year Growth Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={monthlyComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  yAxisId="users"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  yAxisId="growth"
                  orientation="right"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip content={CustomTooltip} />
                <Bar 
                  yAxisId="users"
                  dataKey="users" 
                  fill="hsl(var(--primary))" 
                  name="Current Year Users"
                  opacity={0.8}
                />
                <Bar 
                  yAxisId="users"
                  dataKey="previousYear" 
                  fill="hsl(var(--muted))" 
                  name="Previous Year Users"
                  opacity={0.6}
                />
                <Line 
                  yAxisId="growth"
                  type="monotone" 
                  dataKey="userGrowth" 
                  stroke="hsl(var(--success))" 
                  strokeWidth={3}
                  name="Growth Rate %"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Cohort Retention & Forecasting */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Cohort Retention Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cohortData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    domain={[0, 100]}
                  />
                  <Tooltip content={CustomTooltip} />
                  <Area 
                    type="monotone" 
                    dataKey="retention" 
                    stroke="hsl(var(--primary))" 
                    fill="url(#retentionGradient)"
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="retentionGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>6-Month Growth Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData}>
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
                  <Tooltip content={CustomTooltip} />
                  <Area 
                    type="monotone" 
                    dataKey="users" 
                    stroke="hsl(var(--primary))" 
                    fill="url(#forecastGradient)"
                    strokeWidth={2}
                    strokeDasharray={forecastData.findIndex(d => d.month.includes('Proj')) !== -1 ? "5 5" : "0"}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(var(--success))" 
                    fill="url(#revenueGradient)"
                    strokeWidth={2}
                    strokeDasharray={forecastData.findIndex(d => d.month.includes('Proj')) !== -1 ? "5 5" : "0"}
                  />
                  <defs>
                    <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};