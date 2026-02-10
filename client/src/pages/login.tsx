import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import logo from "@assets/image_1770740414805.png";
import { motion } from "framer-motion";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, user, isLoading, isLoggingIn } = useAuth();
  const [, setLocation] = useLocation();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (user) {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  const onSubmit = (data: LoginData) => {
    login(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <img src={logo} alt="Loading" className="w-16 h-16 opacity-50" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-4 relative z-10"
      >
        <div className="text-center mb-8">
          <img src={logo} alt="ClientOps" className="w-16 h-16 mx-auto mb-4 rounded-xl shadow-2xl shadow-primary/20" />
          <h1 className="text-4xl font-display font-bold tracking-tight">ClientOps</h1>
          <p className="text-muted-foreground mt-2">Premium Lead Management System</p>
        </div>

        <Card className="glass-card border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl">Admin Access</CardTitle>
            <CardDescription>Enter your credentials to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  {...register("username")} 
                  className="input-glass"
                  placeholder="admin"
                />
                {errors.username && <span className="text-xs text-red-500">{errors.username.message}</span>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  {...register("password")} 
                  className="input-glass"
                  placeholder="••••••••"
                />
                {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
              </div>
              <Button type="submit" className="w-full btn-primary-gradient mt-4" disabled={isLoggingIn}>
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Authenticating...
                  </>
                ) : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <p className="text-center text-xs text-muted-foreground mt-8">
          © 2024 ClientOps CRM. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
