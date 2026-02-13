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
        <motion.img
          src={logo}
          alt="ClientOps Logo"
          initial={{ y: 0 }}
          animate={{ y: [-20, 0, -20] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-32 h-32 object-contain"
        />
        
        <div className="w-48 h-1.5 bg-muted rounded-full overflow-hidden relative">
          <motion.div
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-0 bottom-0 w-1/2 bg-primary rounded-full blur-[1px] shadow-[0_0_8px_rgba(var(--primary),0.5)]"
          />
        </div>
      </div>
    </motion.div>
  );
}
