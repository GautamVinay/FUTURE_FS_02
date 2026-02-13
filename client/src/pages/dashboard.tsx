import { Layout } from "@/components/layout";
import { StatCard } from "@/components/stat-card";
import { useDashboardStats } from "@/hooks/use-activities";
import { Users, TrendingUp, CheckCircle, Clock, Bell } from "lucide-react";
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";

const COLORS = ['#E61E32', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];

export default function Dashboard() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-2xl bg-white/5 backdrop-blur-lg" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Skeleton className="lg:col-span-2 h-[500px] w-full rounded-2xl bg-white/5 backdrop-blur-lg" />
            <Skeleton className="h-[500px] w-full rounded-2xl bg-white/5 backdrop-blur-lg" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-display font-bold text-gradient">Dashboard</h1>
            <p className="text-muted-foreground mt-2 text-lg">Welcome back! Here's your business performance today.</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-sm text-muted-foreground bg-white/5 dark:bg-black/20 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 shadow-sm"
          >
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live Updates • {format(new Date(), "MMM d, h:mm a")}
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Clients"
            value={stats?.totalLeads || 0}
            icon={Users}
            description="Active in pipeline"
            trend="up"
            delay={0.1}
          />
          <StatCard
            title="Active Deals"
            value={stats?.newLeads || 0}
            icon={TrendingUp}
            description="Pending conversion"
            trend="neutral"
            delay={0.2}
          />
          <StatCard
            title="Revenue"
            value={`$${((stats?.convertedLeads || 0) * 1250).toLocaleString()}`}
            icon={CheckCircle}
            description="This month"
            trend="up"
            delay={0.3}
          />
          <StatCard
            title="Conversion"
            value={`${stats?.conversionRate || 0}%`}
            icon={TrendingUp}
            description="Lead to Deal"
            trend={(stats?.conversionRate || 0) > 20 ? "up" : "neutral"}
            delay={0.4}
          />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Revenue Over Time Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <Card className="glass-card overflow-hidden border-white/10 shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between pb-8">
                <div>
                  <CardTitle className="text-2xl font-display font-bold">Revenue Performance</CardTitle>
                  <CardDescription>Live revenue tracking against targets</CardDescription>
                </div>
                <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary px-3 py-1">
                  +12.5% vs Last Month
                </Badge>
              </CardHeader>
              <CardContent className="h-[350px] px-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { name: 'Jan', revenue: 4500, target: 4000 },
                    { name: 'Feb', revenue: 5200, target: 4500 },
                    { name: 'Mar', revenue: 4800, target: 5000 },
                    { name: 'Apr', revenue: 6100, target: 5500 },
                    { name: 'May', revenue: 5900, target: 6000 },
                    { name: 'Jun', revenue: 7500, target: 6500 },
                  ]}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsla(var(--border),0.1)" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="hsla(var(--muted-foreground),0.5)" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="hsla(var(--muted-foreground),0.5)" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '1rem',
                        backdropFilter: 'blur(10px)',
                        color: '#fff'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Activity & Notifications */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-8"
          >
            <Card className="glass-card flex flex-col h-full max-h-[500px]">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-display font-bold">Activity Feed</CardTitle>
                  <CardDescription>Latest CRM updates</CardDescription>
                </div>
                <div className="relative">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0 overflow-hidden">
                <ScrollArea className="h-[400px] px-6">
                  <div className="space-y-6 pb-6">
                    <AnimatePresence>
                      {stats?.recentActivity.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">No recent activity</div>
                      ) : (
                        stats?.recentActivity.map((activity, i) => (
                          <motion.div 
                            key={activity.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex gap-4 items-start group"
                          >
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:border-primary/50 group-hover:bg-primary/10 transition-all duration-300">
                              <Clock className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                {activity.description}
                              </p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                {format(new Date(activity.createdAt!), "h:mm a")} • {format(new Date(activity.createdAt!), "MMM d")}
                              </p>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </AnimatePresence>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
