import { motion } from "motion/react";
import { Cpu, Activity, HardDrive, Wifi } from "lucide-react";

export const SystemStats = () => {
  return (
    <div className="grid grid-cols-2 gap-4 p-4 font-mono">
      <StatCard icon={<Cpu size={16} />} label="Processor" value="24.2%" trend={0.1} />
      <StatCard icon={<Activity size={16} />} label="Nueral Link" value="Active" color="text-green-400" />
      <StatCard icon={<HardDrive size={16} />} label="Storage" value="892 TB" />
      <StatCard icon={<Wifi size={16} />} label="Latency" value="2.4ms" color="text-cyan-400" />
      
      <div className="col-span-2 mt-4 space-y-2">
        <label className="text-[10px] text-cyan-500/50 uppercase">Environment Analysis</label>
        <div className="h-2 w-full bg-cyan-900/30 rounded-full overflow-hidden border border-cyan-500/20">
          <motion.div 
            className="h-full bg-cyan-500/50"
            initial={{ width: "30%" }}
            animate={{ width: "85%" }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, trend, color = "text-cyan-500" }: any) => (
  <motion.div 
    whileHover={{ scale: 1.02, backgroundColor: "rgba(8, 145, 178, 0.1)" }}
    className="p-3 border border-cyan-500/20 bg-cyan-900/10 backdrop-blur-sm rounded-lg flex flex-col gap-2"
  >
    <div className="flex items-center justify-between text-cyan-500/50">
      {icon}
      <span className="text-[8px] uppercase tracking-wider">{label}</span>
    </div>
    <div className={cn("text-lg font-bold", color)}>
      {value}
    </div>
    {trend !== undefined && (
      <div className="text-[8px] text-cyan-300">
        {trend > 0 ? "+" : ""}{trend}% from last cycle
      </div>
    )}
  </motion.div>
);

import { cn } from "@/src/lib/utils";
