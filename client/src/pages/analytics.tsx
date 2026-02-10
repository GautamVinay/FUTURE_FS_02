import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardStats } from "@/hooks/use-activities";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function AnalyticsPage() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-80 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  // Mock data for the bar chart since backend stats are simple
  const performanceData = [
    { name: 'Mon', leads: 4 },
    { name: 'Tue', leads: 7 },
    { name: 'Wed', leads: 3 },
    { name: 'Thu', leads: 9 },
    { name: 'Fri', leads: 5 },
    { name: 'Sat', leads: 2 },
    { name: 'Sun', leads: 1 },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold">Analytics & Performance</h1>
          <p className="text-muted-foreground">Deep dive into your sales metrics.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-card h-full">
              <CardHeader>
                <CardTitle>Lead Generation (This Week)</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '0.5rem'
                      }}
                      cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
                    />
                    <Bar 
                      dataKey="leads" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Conversion Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Conversion Rate</span>
                      <span className="text-sm font-bold text-primary">{stats?.conversionRate}%</span>
                    </div>
                    <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${stats?.conversionRate}%` }} 
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                       <p className="text-xs text-green-600 dark:text-green-400 font-medium uppercase">Converted</p>
                       <p className="text-2xl font-bold mt-1 text-green-700 dark:text-green-300">{stats?.convertedLeads}</p>
                     </div>
                     <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                       <p className="text-xs text-blue-600 dark:text-blue-400 font-medium uppercase">Total Active</p>
                       <p className="text-2xl font-bold mt-1 text-blue-700 dark:text-blue-300">{stats?.totalLeads}</p>
                     </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card bg-primary/5 border-primary/20">
               <CardContent className="pt-6">
                 <h3 className="font-bold text-lg mb-2">Pro Tip</h3>
                 <p className="text-sm text-muted-foreground">Leads contacted within the first hour are 7x more likely to convert. Check your "New" leads regularly!</p>
               </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
