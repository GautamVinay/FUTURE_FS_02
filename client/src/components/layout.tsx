import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { 
  LayoutDashboard, 
  Users, 
  PieChart, 
  LogOut, 
  Moon, 
  Sun,
  Menu,
  X
} from "lucide-react";
import logo from "@assets/image_1770740414805.png";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { logout, user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location === path;

  const NavLink = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => (
    <Link href={href}>
      <div 
        className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
          isActive(href) 
            ? "bg-primary/10 text-primary font-medium" 
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
        }`}
      >
        <Icon className="w-5 h-5" />
        <span>{label}</span>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Navbar */}
      <nav className="glass-panel px-4 md:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full group-hover:bg-primary/30 transition-all duration-500" />
                <img src={logo} alt="ClientOps" className="w-8 h-8 md:w-10 md:h-10 relative z-10 rounded-lg" />
              </div>
              <span className="font-display font-bold text-xl md:text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                ClientOps
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2 lg:gap-6">
          <NavLink href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavLink href="/leads" icon={Users} label="Leads" />
          <NavLink href="/analytics" icon={PieChart} label="Analytics" />
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full hover:bg-muted/50"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          
          <div className="flex items-center gap-3 pl-3 border-l border-border/50">
            <span className="text-sm font-medium hidden lg:block">{user?.name}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => logout()}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-16 left-0 right-0 glass-card border-t border-border z-40 p-4 flex flex-col gap-2 m-2 rounded-2xl"
          >
            <div onClick={() => setIsMobileMenuOpen(false)}>
              <NavLink href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
            </div>
            <div onClick={() => setIsMobileMenuOpen(false)}>
              <NavLink href="/leads" icon={Users} label="Leads" />
            </div>
            <div onClick={() => setIsMobileMenuOpen(false)}>
              <NavLink href="/analytics" icon={PieChart} label="Analytics" />
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-sm font-medium">{user?.name}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>
            <Button 
              variant="outline" 
              onClick={() => logout()}
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <main className="flex-1 container mx-auto px-4 md:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
        {children}
      </main>
    </div>
  );
}
