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
  X,
  UserCircle
} from "lucide-react";
import logo from "@assets/LOGO-1_1770995498064.png";
import { EditDetailsDialog } from "./edit-details-dialog";
import { ThemeToggle } from "./theme-toggle";
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
        className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all duration-300 hover-elevate active-elevate-2 ${
          isActive(href) 
            ? "bg-primary/10 dark:bg-primary/20 backdrop-blur-xl border border-primary/20 shadow-lg text-primary font-semibold" 
            : "text-muted-foreground hover:text-foreground hover:bg-white/5"
        }`}
      >
        <Icon className="w-5 h-5" />
        <span>{label}</span>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-transparent text-foreground flex flex-col font-sans selection:bg-primary/20">
      {/* Navbar */}
      <nav className="px-4 md:px-6 lg:px-8 py-3 flex items-center justify-between border-b border-white/10 bg-white/5 dark:bg-black/20 backdrop-blur-2xl sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full group-hover:bg-primary/50 transition-all duration-500 scale-125" />
                <img src={logo} alt="ClientOps" className="w-8 h-8 md:w-10 md:h-10 relative z-10 object-contain drop-shadow-2xl" />
              </div>
              <span className="font-display font-bold text-xl md:text-2xl tracking-tight text-gradient">
                ClientOps
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2 lg:gap-4 bg-white/5 dark:bg-black/10 p-1 rounded-xl border border-white/10 backdrop-blur-md">
          <NavLink href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavLink href="/leads" icon={Users} label="Leads" />
          <NavLink href="/analytics" icon={PieChart} label="Analytics" />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white/5 dark:bg-black/10 p-1 rounded-xl border border-white/10 backdrop-blur-md">
            <ThemeToggle />
            <EditDetailsDialog />
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => logout()}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
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
            className="md:hidden absolute top-16 left-0 right-0 bg-white/5 backdrop-blur-2xl border-t border-white/10 z-40 p-4 flex flex-col gap-2 m-2 rounded-2xl shadow-2xl"
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
            <div className="h-px bg-white/10 my-2" />
            <div className="flex items-center justify-between px-4 py-2">
              <div className="flex items-center gap-2">
                <UserCircle className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{user?.name}</span>
              </div>
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
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 border-white/10 backdrop-blur-md"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <main className="flex-1 container mx-auto px-4 md:px-6 lg:px-8 py-8 animate-in fade-in duration-500 relative z-10">
        {children}
      </main>
    </div>
  );
}
