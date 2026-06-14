"use client";

import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  
  // Basic title formatting from pathname
  const title = pathname === "/dashboard" 
    ? "Dashboard" 
    : pathname.split("/").pop()?.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase()) || "Dashboard";

  return (
    <header className="h-20 flex items-center justify-between px-8 bg-transparent">
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{title}</h1>
        <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
          <span>Welcome To Neelkanth ↗</span>
          <span className="bg-brand-500/10 text-brand-600 px-2 py-0.5 rounded-md font-medium">
            Current Logged in Date & Time: 14-06-2026 03:11 PM
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-sm border border-gray-100">
          <span className="text-sm font-medium text-gray-600">AMC REMAINING DAYS :</span>
          <span className="text-sm font-bold text-gray-900">61</span>
        </div>
      </div>
    </header>
  );
}
