"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/ui/Sidebar";
import Header from "@/components/ui/Header";
import { ChevronLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppData } from "@/context/AppDataContext";

export default function DashboardLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { isLoading } = useAppData();

  // Close mobile sidebar on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden md:overflow-visible w-full">
      {/* Global Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-[2px] z-[100] flex flex-col items-center justify-center transition-opacity duration-300">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-black" />
            <p className="text-sm font-semibold text-gray-700 tracking-tight animate-pulse">Syncing Database...</p>
          </div>
        </div>
      )}

      {/* Mobile Overlay Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div 
        className={cn(
          "fixed top-0 bottom-0 z-50 transition-all duration-300 ease-in-out md:z-20",
          isCollapsed ? "md:w-[80px]" : "md:w-[260px]",
          isMobileOpen ? "w-[260px] left-0 shadow-2xl" : "w-[260px] -left-[260px] md:left-0 md:shadow-none"
        )}
      >
        <div className="bg-[#FAFAFA] h-full border-r border-gray-200 flex flex-col overflow-hidden w-full relative">
          <Sidebar isCollapsed={isCollapsed} onNavigate={() => setIsMobileOpen(false)} />
        </div>
        
        {/* Desktop Collapse Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 items-center justify-center bg-white border border-gray-200 rounded-full text-gray-400 hover:text-black hover:border-gray-300 shadow-sm hover:shadow-md z-50 cursor-pointer transition-all duration-300"
        >
          <ChevronLeft className={cn("w-4 h-4 transition-transform duration-300", isCollapsed && "rotate-180")} />
        </button>
      </div>

      {/* Main Content Area */}
      <main 
        className={cn(
          "flex-1 flex flex-col min-h-screen min-w-0 transition-all duration-300 ease-in-out w-full",
          isCollapsed ? "md:pl-[80px]" : "md:pl-[260px]",
          "pl-0"
        )}
      >
        <Header onMenuToggle={() => setIsMobileOpen(true)} />
        <div className="flex-1 px-4 sm:px-6 md:px-8 pb-12 pt-4 w-full overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
