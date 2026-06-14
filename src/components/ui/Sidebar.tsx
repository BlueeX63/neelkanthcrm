"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  UserCog,
  Package,
  ShoppingCart,
  FileText,
  UserPlus,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const defaultMenuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Customer Master", href: "/dashboard/customer-master", icon: Users },
  { name: "Karigar Master", href: "/dashboard/karigar-master", icon: UserCog },
  { name: "Item Master", href: "/dashboard/item-master", icon: Package },
  { name: "Order Master", href: "/dashboard/order-master", icon: ShoppingCart },
];

export default function Sidebar({ isCollapsed, onNavigate }: { isCollapsed?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  const [menuItems, setMenuItems] = useState(defaultMenuItems);

  useEffect(() => {
    const fetchUserRole = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.user_type === 'ADMINISTRATOR') {
        setMenuItems([...defaultMenuItems, { name: "Users Master", href: "/dashboard/users-master", icon: UserPlus }]);
      }
    };
    fetchUserRole();
  }, []);

  return (
    <aside className="w-full px-3 py-6 flex flex-col h-screen sticky top-0 overflow-y-auto custom-scrollbar">
      <div className={cn("flex items-center mb-10 transition-all duration-300", isCollapsed ? "justify-center px-0" : "px-3")}>
        <Image src="/logo.png" alt="Neelkanth" width={32} height={32} className="rounded-sm shrink-0" />
        <span className={cn(
          "font-semibold text-lg tracking-tight whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out",
          isCollapsed ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100 pl-3"
        )}>
          Neelkanth
        </span>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              title={isCollapsed ? item.name : undefined}
              className={cn(
                "group relative flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-300",
                isActive
                  ? "text-black"
                  : "text-gray-500 hover:text-black hover:bg-gray-100",
                isCollapsed ? "justify-center" : "justify-start"
              )}
            >
              <div className="flex items-center z-10 relative">
                <item.icon
                  className={cn(
                    "w-5 h-5 transition-colors duration-300 shrink-0",
                    isActive ? "text-black" : "text-gray-400 group-hover:text-black"
                  )}
                />
                <span className={cn(
                  "whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out",
                  isCollapsed ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100 pl-3"
                )}>
                  {item.name}
                </span>
              </div>

              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-gray-200/50 rounded-md"
                  transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-1">
        <button 
          onClick={async () => {
            const { createClient } = await import("@/utils/supabase/client");
            const supabase = createClient();
            await supabase.auth.signOut();
            window.location.href = "/login";
          }}
          className={cn(
            "flex items-center px-3 py-2.5 w-full rounded-md text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-300 cursor-pointer",
            isCollapsed ? "justify-center" : "justify-start"
          )}
          title={isCollapsed ? "Log Out" : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span className={cn(
            "whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out text-left",
            isCollapsed ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100 pl-3"
          )}>
            Log Out
          </span>
        </button>
      </div>
    </aside>
  );
}
