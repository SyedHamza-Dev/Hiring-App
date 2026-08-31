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
  LogOut,
  Scan,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { checkAuth, logout } from "@/utils/auth";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  useEffect(() => {
    if (typeof window !== "undefined" && !checkAuth()) {
      router.push("/");
    }

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
    { name: "Dashboard", id: "dashboard", icon: LayoutDashboard },
    { name: "CV Management", id: "upload", icon: Upload },
    { name: "Job Descriptions", id: "jobs", icon: Briefcase },
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
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50 bg-white text-gray-700 shadow-md rounded-lg border border-gray-200"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="w-5 h-5" />
      </Button>

      <aside
        id="sidebar"
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-200 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="h-16 px-5 border-b border-gray-100 flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <Scan className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-gray-900 truncate">
              Smart CV Scanner
            </h2>
            <p className="text-xs text-gray-400 truncate">
              AI-powered recruiting
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden ml-auto h-8 w-8"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-4 h-4 text-gray-400" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <tab.icon
                  className={cn(
                    "w-4 h-4 shrink-0",
                    isActive ? "text-blue-600" : "text-gray-400"
                  )}
                />
                {tab.name}
              </button>
            );
          })}
        </nav>

        {/* User + status */}
        <div className="p-3 border-t border-gray-100 space-y-2 shrink-0">
          <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-gray-500">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            System online
          </div>
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-semibold shrink-0">
              HR
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                HR Manager
              </p>
              <p className="text-xs text-gray-400 truncate">
                hr@company.com
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-md hover:bg-gray-100 shrink-0"
              title="Logout"
            >
              <LogOut className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
