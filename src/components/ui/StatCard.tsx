"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  delay?: number;
  className?: string;
  layout?: "vertical" | "horizontal";
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  delay = 0,
  className,
  layout = "vertical",
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group bg-white p-6 rounded-md shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-300",
        className
      )}
    >
      <div className={cn(
        "flex",
        layout === "vertical" ? "flex-col gap-4" : "flex-row items-center justify-between"
      )}>
        {layout === "vertical" ? (
          <>
            <div className="flex items-center gap-4">
              {Icon && (
                <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 group-hover:scale-110 group-hover:bg-brand-100 transition-all duration-300">
                  <Icon className="w-6 h-6" strokeWidth={1.5} />
                </div>
              )}
              <div>
                <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
                <p className="text-sm font-medium text-gray-500 mt-0.5">{title}</p>
              </div>
            </div>
            {trend && (
              <div className="flex items-center gap-2 mt-2">
                <span className={cn(
                  "px-2 py-0.5 rounded-md text-xs font-semibold",
                  trend.isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                )}>
                  {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
                </span>
                <span className="text-xs text-gray-400 font-medium">vs last month</span>
              </div>
            )}
          </>
        ) : (
          <>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
              <div className="flex items-baseline gap-3">
                <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
                {trend && (
                  <span className={cn(
                    "text-xs font-semibold",
                    trend.isPositive ? "text-emerald-600" : "text-red-600"
                  )}>
                    {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
                  </span>
                )}
              </div>
            </div>
            {Icon && (
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-brand-600 group-hover:bg-brand-50 transition-all duration-300">
                <Icon className="w-5 h-5" />
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
