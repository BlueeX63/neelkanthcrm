"use client";

import { useState } from "react";
import Sidebar from "@/components/ui/Sidebar";
import Header from "@/components/ui/Header";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-background relative">
      <div 
        className={cn(
          "fixed left-0 top-0 bottom-0 z-20 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-[80px]" : "w-[260px]"
        )}
      >
        <div className="bg-[#FAFAFA] h-full border-r border-gray-200 flex flex-col overflow-hidden w-full">
          <Sidebar isCollapsed={isCollapsed} />
        </div>
        
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded-full text-gray-400 hover:text-black hover:border-gray-300 shadow-sm hover:shadow-md z-50 cursor-pointer transition-all duration-300"
        >
          <ChevronLeft className={cn("w-4 h-4 transition-transform duration-300", isCollapsed && "rotate-180")} />
        </button>
      </div>
      <main 
        className={cn(
          "flex-1 flex flex-col min-h-screen min-w-0 transition-[padding] duration-300 ease-in-out w-full",
          isCollapsed ? "pl-[80px]" : "pl-[260px]"
        )}
      >
        <Header />
        <div className="flex-1 px-8 pb-12 pt-4">
          {children}
        </div>
      </main>
    </div>
  );
}
