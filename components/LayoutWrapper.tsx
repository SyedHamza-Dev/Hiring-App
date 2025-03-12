"use client";

import SideNav from "@/components/Sidebar";
import { usePathname } from "next/navigation";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login"; // Hide sidebar for login page

  if (isAuthPage) {
    return <>{children}</>; // Just return content without layout
  }

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 flex-none">
        <SideNav />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-grow">

        {/* Page Content */}
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
      </div>
    </div>
  );
}
