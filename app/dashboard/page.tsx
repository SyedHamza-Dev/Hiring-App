"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Candidates from "@/components/Candidates";
import DashboardContent from "@/components/Dashboard";
import JobDescriptions from "@/components/JobDescriptions";
import UploadCV from "@/components/UploadCV";
import LayoutWrapper from "@/components/LayoutWrapper";

function DashboardContentWithParams() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "dashboard";

  return (
    <>
      {activeTab === "dashboard" && <DashboardContent />}
      {activeTab === "upload" && <UploadCV />}
      {activeTab === "jobs" && <JobDescriptions />}
      {activeTab === "candidates" && <Candidates />}
    </>
  );
}

export default function Dashboard() {
  return (
    <LayoutWrapper>
      <Suspense fallback={<div>Loading...</div>}>
        <DashboardContentWithParams />
      </Suspense>
    </LayoutWrapper>
  );
}
