"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Upload,
  Briefcase,
  Menu,
  X,
  ChevronRight,
  Settings,
  LogOut,
  HelpCircle,
  Scan,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { checkAuth, logout } from "@/utils/auth"; // Import auth functions
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Logout Function
  const handleLogout = () => {
    logout(); // Call the logout function from utils/auth.tsx
    router.push("/");
  };

  useEffect(() => {
    if (typeof window !== "undefined" && !checkAuth()) {
      router.push("/");
    }

    // Extract the current tab from the URL
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      const tabParam = url.searchParams.get("tab");
      if (tabParam) {
        setActiveTab(tabParam);
      } else if (pathname === "/dashboard") {
        setActiveTab("dashboard");
      }
    }
  }, [pathname, router]);

  const tabs = [
    {
      name: "Dashboard",
      id: "dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      gradient: "from-violet-500 to-indigo-600",
    },
    {
      name: "CV Management",
      id: "upload",
      path: "/dashboard",
      icon: Upload,
      gradient: "from-violet-500 to-indigo-600",
    },
    {
      name: "Job Descriptions",
      id: "jobs",
      path: "/dashboard",
      icon: Briefcase,
      gradient: "from-violet-500 to-indigo-600",
    },
  ];

  const utilityTabs = [
    {
      name: "Settings",
      id: "settings",
      path: "/dashboard",
      icon: Settings,
    },
    {
      name: "Help & Support",
      id: "help",
      path: "/dashboard",
      icon: HelpCircle,
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as HTMLElement).closest("#sidebar")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  // Background animation for the sidebar
  const sidebarVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  // Handle tab navigation
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    
    if (tabId === "dashboard") {
      router.push("/dashboard");
    } else {
      router.push(`/dashboard?tab=${tabId}`);
    }
    
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50 bg-zinc-900/80 text-white backdrop-blur-md shadow-lg rounded-xl border border-zinc-800"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Sidebar */}
      <motion.aside
        id="sidebar"
        initial="hidden"
        animate="visible"
        variants={sidebarVariants}
        className={cn(
          "fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-zinc-950 to-zinc-900 text-white shadow-xl border-r border-zinc-800/50 z-50 transform transition-transform duration-300 ease-in-out",
          "backdrop-blur-xl",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0"
        )}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 -left-20 w-64 h-64 rounded-full bg-violet-600 opacity-5 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [-20, 10, -20],
              opacity: [0.03, 0.08, 0.03],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="absolute -bottom-32 -right-20 w-80 h-80 rounded-full bg-indigo-600 opacity-5 blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Header */}
        <div className="p-6 border-b border-zinc-800/50 flex justify-between items-center backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center shadow-lg">
              <Scan className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                Smart CV Scanner
              </h2>
              <p className="text-xs text-zinc-400">AI-powered recruiting</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-zinc-800/50 rounded-lg"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-5 h-5 text-zinc-400" />
          </Button>
        </div>

        {/* Navigation */}
        <div className="mt-6 px-3 space-y-1.5">
          <div className="mb-4 px-4">
            <p className="text-xs uppercase text-zinc-500 font-medium tracking-wider">
              Main Navigation
            </p>
          </div>

          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <div
                key={tab.id}
                className="relative"
                onMouseEnter={() => setHoveredTab(tab.id)}
                onMouseLeave={() => setHoveredTab(null)}
              >
                <AnimatePresence>
                  {(isActive || hoveredTab === tab.id) && (
                    <motion.div
                      className={cn(
                        "absolute inset-0 rounded-xl",
                        isActive
                          ? "bg-gradient-to-r from-violet-600/20 to-indigo-600/10"
                          : "bg-zinc-800/30"
                      )}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </AnimatePresence>

                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start px-4 py-2.5 text-zinc-400 hover:text-white transition-all duration-200 h-auto",
                    "relative group hover:bg-transparent",
                    isActive && "text-white font-medium"
                  )}
                  onClick={() => handleTabClick(tab.id)}
                >
                  <motion.div
                    className="flex items-center"
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div
                      className={cn(
                        "relative w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200",
                        isActive
                          ? "bg-gradient-to-br " + tab.gradient
                          : "bg-zinc-800/50 group-hover:bg-zinc-800"
                      )}
                    >
                      <tab.icon
                        className={cn(
                          "w-4.5 h-4.5 transition-all duration-200",
                          isActive
                            ? "text-white"
                            : "text-zinc-400 group-hover:text-white"
                        )}
                      />

                      {isActive && (
                        <motion.div
                          className="absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full bg-white"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </div>
                    <span className="ml-3 text-sm font-medium">{tab.name}</span>

                    {isActive && (
                      <motion.div
                        className="ml-auto"
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight className="w-4 h-4 text-zinc-400" />
                      </motion.div>
                    )}
                  </motion.div>
                </Button>
              </div>
            );
          })}

          {/* Utility Navigation */}
          <div className="mt-8 mb-2 px-4">
            <p className="text-xs uppercase text-zinc-600 font-medium tracking-wider">
              Utilities
            </p>
          </div>

          {utilityTabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <div key={tab.id} className="relative">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start px-4 py-2.5 text-sm text-zinc-500 hover:text-white transition-all duration-200 h-auto",
                    "hover:bg-zinc-800/30 rounded-lg",
                    isActive && "text-white bg-zinc-800/40"
                  )}
                  onClick={(event) => {
                    event.preventDefault(); // Prevents navigation
                    setIsOpen(false);
                  }}
                >
                  <motion.div
                    className="flex items-center"
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <tab.icon className="w-4 h-4 mr-3 text-zinc-500" />
                    <span>{tab.name}</span>
                  </motion.div>
                </Button>
              </div>
            );
          })}
        </div>

        {/* User Profile & System Status */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="border-t border-zinc-800/50 pt-4 pb-2">
            <div className="flex items-center px-3 py-2 bg-zinc-800/30 rounded-lg mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2" />
              <span className="text-xs text-zinc-300">System online</span>
              <div className="ml-auto text-xs text-zinc-500">v2.3.1</div>
            </div>

            <div className="flex items-center space-x-3 px-3 py-2 bg-zinc-800/30 rounded-lg hover:bg-zinc-800/50 transition-colors cursor-pointer">
              <div className="relative w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center shadow-md border border-zinc-700/30">
                <Image
                  src="/res-1.png"
                  alt="User Avatar"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  HR Manager
                </p>
                <p className="text-xs text-zinc-500 truncate">hr@company.com</p>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg hover:bg-zinc-700/30"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 text-zinc-400" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Logout</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Background Overlay (Mobile Only) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}