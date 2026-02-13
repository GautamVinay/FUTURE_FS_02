import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useDashboardStats } from "@/hooks/use-activities";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { TrendingUp, Users, Target, Zap } from "lucide-react";

const COLORS = ['#E61E32', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];

export default function AnalyticsPage() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-64 bg-white/5" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="h-[400px] w-full bg-white/5" />
            <Skeleton className="h-[400px] w-full bg-white/5" />
          </div>
        </div>
      </Layout>
    );
  }

  const performanceData = [
    { name: 'Mon', leads: 4, conversion: 25 },
    { name: 'Tue', leads: 7, conversion: 40 },
    { name: 'Wed', leads: 3, conversion: 33 },
    { name: 'Thu', leads: 9, conversion: 55 },
    { name: 'Fri', leads: 5, conversion: 45 },
    { name: 'Sat', leads: 2, conversion: 20 },
    { name: 'Sun', leads: 1, conversion: 15 },
  ];

  const sourceData = [
    { name: 'Website', value: 45 },
    { name: 'LinkedIn', value: 30 },
    { name: 'Referral', value: 15 },
    { name: 'Cold Email', value: 10 },
  ];

  return (
    <Layout>
      <div className="space-y-8 pb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-display font-bold text-gradient">Analytics & Performance</h1>
          <p className="text-muted-foreground text-lg mt-2">Data-driven insights for your CRM growth.</p>
        </motion.div>

        {/* High-Level Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold">Total Retention</p>
              <p className="text-2xl font-display font-bold">94.2%</p>
            </div>
          </Card>
          <Card className="glass-card p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
              <Target className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold">Goal Attainment</p>
              <p className="text-2xl font-display font-bold">87%</p>
            </div>
          </Card>
          <Card className="glass-card p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <Zap className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold">Velocity Index</p>
              <p className="text-2xl font-display font-bold">4.8x</p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Sales Trend Line Graph */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-card h-[450px]">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Lead Conversion Trend</CardTitle>
                <CardDescription>Daily performance tracking</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsla(var(--border),0.1)" vertical={false} />
                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '1rem',
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="leads" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={4} 
                      dot={{ r: 6, fill: 'hsl(var(--primary))', strokeWidth: 2, stroke: '#fff' }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="conversion" 
                      stroke="#3B82F6" 
                      strokeWidth={2} 
                      strokeDasharray="5 5" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Revenue Source Pie Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-card h-[450px]">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Lead Source Analysis</CardTitle>
                <CardDescription>Where your growth comes from</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="45%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {sourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '1rem',
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
