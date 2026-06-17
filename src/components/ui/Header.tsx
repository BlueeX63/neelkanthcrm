"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

interface HeaderProps {
  onMenuToggle?: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const pathname = usePathname();
  
  const today = new Date();
  const formattedDate = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;

  // Basic title formatting from pathname
  const title = pathname === "/dashboard" 
    ? "Dashboard" 
    : pathname.split("/").pop()?.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase()) || "Dashboard";

  return (
    <header className="min-h-20 flex flex-col md:flex-row items-start md:items-center justify-between px-4 sm:px-6 md:px-8 py-4 bg-transparent gap-4 w-full">
      <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto">
        {onMenuToggle && (
          <button 
            onClick={onMenuToggle}
            className="md:hidden p-2 -ml-2 text-gray-600 hover:text-black focus:outline-none"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
        <div className="flex flex-col min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-gray-900 truncate">
            {title}
          </h1>
          <div className="text-[10px] sm:text-xs text-gray-400 mt-1 flex flex-wrap items-center gap-2">
            <span className="hidden sm:inline">Welcome To Neelkanth ↗</span>
            <span suppressHydrationWarning className="bg-brand-500/10 text-brand-600 px-2 py-0.5 rounded-md font-medium whitespace-nowrap">
              Current Logged in Date: {formattedDate}
            </span>
          </div>
        </div>
      </div>


    </header>
  );
}
