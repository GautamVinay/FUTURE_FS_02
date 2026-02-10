import { Layout } from "@/components/layout";
import { StatCard } from "@/components/stat-card";
import { useDashboardStats } from "@/hooks/use-activities";
import { Users, UserPlus, TrendingUp, CheckCircle, Clock } from "lucide-react";
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
  Cell
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = ['#E61E32', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];

export default function Dashboard() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-2xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-96 w-full rounded-2xl" />
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Dashboard Overview</h1>
            <p className="text-muted-foreground mt-1">Here's what's happening with your leads today.</p>
          </div>
          <div className="text-sm text-muted-foreground bg-muted/30 px-3 py-1 rounded-full border border-border/50">
            Last updated: {format(new Date(), "h:mm a")}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Leads"
            value={stats?.totalLeads || 0}
            icon={Users}
            description="Active in pipeline"
            trend="neutral"
            delay={0.1}
          />
          <StatCard
            title="New Leads"
            value={stats?.newLeads || 0}
            icon={UserPlus}
            description="This month"
            trend="up"
            delay={0.2}
          />
          <StatCard
            title="Converted"
            value={stats?.convertedLeads || 0}
            icon={CheckCircle}
            description="Successful deals"
            trend="up"
            delay={0.3}
          />
          <StatCard
            title="Conversion Rate"
            value={`${stats?.conversionRate || 0}%`}
            icon={TrendingUp}
            description="Lead to Deal"
            trend={stats?.conversionRate > 20 ? "up" : "neutral"}
            delay={0.4}
          />
        </div>

        {/* Charts & Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Pie Chart - Leads by Status */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-1"
          >
            <Card className="glass-card h-full">
              <CardHeader>
                <CardTitle>Leads by Status</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats?.leadsByStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {stats?.leadsByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '0.5rem'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {stats?.leadsByStatus.map((entry, index) => (
                    <div key={entry.status} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      {entry.status}: {entry.count}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Activity Feed */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-2"
          >
            <Card className="glass-card h-full">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.recentActivity.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">No recent activity</div>
                  ) : (
                    stats?.recentActivity.map((activity, i) => (
                      <div key={activity.id} className="flex gap-4 items-start group">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 border border-border group-hover:border-primary/50 transition-colors">
                          <Clock className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-foreground">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(activity.createdAt!), "MMM d, h:mm a")}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
