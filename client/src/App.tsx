import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import LeadsPage from "@/pages/leads";
import LeadDetailPage from "@/pages/lead-detail";
import AnalyticsPage from "@/pages/analytics";
import { useAuth } from "@/hooks/use-auth";
import { AnimatedBackground } from "@/components/animated-background";
import { LoadingScreen } from "@/components/loading-screen";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// Protected Route Wrapper
function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null; // Handled by App level loader
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  return (
    <>
      <AnimatedBackground />
      <Component />
    </>
  );
}

function Router() {
  const { isLoading: isAuthLoading } = useAuth();
  const [isSplashLoading, setIsSplashLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const showLoading = isAuthLoading || isSplashLoading;
  
  return (
    <AnimatePresence mode="wait">
      {showLoading ? (
        <LoadingScreen key="loading" />
      ) : (
        <Switch key="router">
          <Route path="/login">
            <div className="relative min-h-screen">
              <AnimatedBackground />
              <LoginPage />
            </div>
          </Route>
          
          {/* Protected Routes */}
          <Route path="/" component={() => <ProtectedRoute component={Dashboard} />} />
          <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
          <Route path="/leads" component={() => <ProtectedRoute component={LeadsPage} />} />
          <Route path="/leads/:id" component={() => <ProtectedRoute component={LeadDetailPage} />} />
          <Route path="/analytics" component={() => <ProtectedRoute component={AnalyticsPage} />} />
          
          <Route component={NotFound} />
        </Switch>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="relative min-h-screen font-sans selection:bg-primary/20 selection:text-primary">
            <Router />
            <Toaster />
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
