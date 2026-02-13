import { motion } from "framer-motion";
import logo from "@assets/LOGO-1_1770995498064.png";

export function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
    >
      <div className="relative flex flex-col items-center gap-8">
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [-15, 0, -15] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative"
        >
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150" />
          <img
            src={logo}
            alt="ClientOps Logo"
            className="w-32 h-32 object-contain relative z-10"
          />
        </motion.div>
        
        <div className="w-64 h-2 bg-muted/30 rounded-full overflow-hidden relative backdrop-blur-md border border-white/10 shadow-inner">
          <motion.div
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full blur-[1px] shadow-[0_0_15px_rgba(var(--primary),0.6)]"
          />
        </div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-muted-foreground font-display text-sm tracking-widest uppercase"
        >
          Initializing CRM
        </motion.p>
      </div>
    </motion.div>
  );
}
