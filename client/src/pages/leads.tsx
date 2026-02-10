import { Layout } from "@/components/layout";
import { LeadsTable } from "@/components/leads-table";
import { motion } from "framer-motion";

export default function LeadsPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-1"
        >
          <h1 className="text-3xl font-display font-bold">Leads Management</h1>
          <p className="text-muted-foreground">View, filter, and manage your pipeline.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <LeadsTable />
        </motion.div>
      </div>
    </Layout>
  );
}
