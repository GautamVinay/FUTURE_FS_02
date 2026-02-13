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
import logo from "@assets/LOGO-1_1770995498064.png";
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

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-4 relative z-10"
      >
        <div className="text-center mb-8">
          <img src={logo} alt="ClientOps" className="w-24 h-24 mx-auto mb-4 object-contain" />
          <h1 className="text-4xl font-display font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">ClientOps</h1>
          <p className="text-muted-foreground mt-2 font-medium tracking-wide">.TRACK. FOLLOW. CONVERT.</p>
        </div>

        <Card className="bg-white/5 backdrop-blur-2xl border-white/20 shadow-2xl rounded-2xl overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold">Admin Access</CardTitle>
            <CardDescription className="text-muted-foreground/70">Enter your credentials to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  {...register("username")} 
                  className="bg-white/5 border-white/10 focus:border-primary/50 transition-colors"
                  placeholder="admin"
                />
                {errors.username && <span className="text-xs text-destructive">{errors.username.message}</span>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  {...register("password")} 
                  className="bg-white/5 border-white/10 focus:border-primary/50 transition-colors"
                  placeholder="••••••••"
                />
                {errors.password && <span className="text-xs text-destructive">{errors.password.message}</span>}
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] mt-4" disabled={isLoggingIn}>
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Authenticating...
                  </>
                ) : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <p className="text-center text-xs text-muted-foreground/50 mt-8 font-medium">
          © 2024 CLIENTOPS CRM. ALL RIGHTS RESERVED.
        </p>
      </motion.div>
    </div>
  );
}
