// src/components/layout/LayoutSelector.tsx
import ClientLayout from "./client-layout";
import DashboardLayout from "./dashboard-layout";
import { useEffect, useState } from "react";

interface LayoutSelectorProps {
  children: React.ReactNode;
}

const LayoutSelector = ({ children }: LayoutSelectorProps) => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Example: get role from localStorage or Redux
    const userRole = localStorage.getItem("loggedInUserRoleId");
    setRole("client");
  }, []);

  if (role === "client") {
    return <ClientLayout>{children}</ClientLayout>;
  }
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default LayoutSelector;