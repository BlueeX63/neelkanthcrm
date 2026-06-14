"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function ChartCard({
  title,
  subtitle,
  children,
  delay = 0,
  className,
}: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "bg-white p-6 rounded-md shadow-sm border border-gray-200 flex flex-col hover:shadow-md hover:border-gray-300 transition-shadow duration-300",
        className
      )}
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 tracking-tight">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
      <div className="flex-1 w-full relative min-h-[300px]">
        {children}
      </div>
    </motion.div>
  );
}
