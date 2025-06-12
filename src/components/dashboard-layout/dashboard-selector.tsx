// src/components/layout/LayoutSelector.tsx
import ClientLayout from "./client-layout";
import DashboardLayout from "./dashboard-layout";
import { useEffect, useState } from "react";
import AuthMiddleware from "../auth-middleware/auth-middleware";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { useRouter } from "next/router";
import { CUSTOMER_PUBLIC_ROUTES, ADMIN_PUBLIC_ROUTES, CUSTOMER_ROUTES, ADMIN_ROUTES, USER_TYPE } from "@/libs/constants";
import { useTheme } from "@/hooks/useTheme";

interface LayoutSelectorProps {
  children: React.ReactNode;
}

const LayoutSelector = ({ children }: LayoutSelectorProps) => {
  const [role, setRole] = useState<string | null>(null);
  const userRole = localStorage.getItem("loggedInUser") ? JSON.parse(localStorage.getItem("loggedInUser")!).userRole : null;
  const isLoggedIn = true;
  const router = useRouter();
  const currentPath = router.pathname;
  
  // Use the theme hook to automatically apply dashboard themes
  useTheme();

  const isCustomerRoute = CUSTOMER_ROUTES.includes(currentPath);
  const isAdminRoute = [...CUSTOMER_ROUTES, ...ADMIN_ROUTES].includes(
    currentPath
  );
  const isPublicRoute = [...CUSTOMER_PUBLIC_ROUTES, ...ADMIN_PUBLIC_ROUTES].includes(currentPath);

  useEffect(() => {
    const loggedInUserRole = localStorage.getItem("loggedInUserRoleId");
    setRole(userRole);
  }, [userRole]);

  // Redirect to /unauthenticated if route is not allowed
  useEffect(() => {
    if (!isPublicRoute && !isCustomerRoute && !isAdminRoute) {
      router.replace("/unauthenticated");
    }
  }, [currentPath, isPublicRoute, isCustomerRoute, isAdminRoute, router]);

  // Public pages: no layout
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // No layout for /unauthenticated
  if (currentPath === "/unauthenticated") {
    return <>{children}</>;
  }

  const shouldHideHeader = CUSTOMER_ROUTES.some((route) =>
    currentPath.startsWith(route + "/")
  );

  return (
    <AuthMiddleware>
      {role === USER_TYPE.customer && isLoggedIn && isCustomerRoute ? (
        <ClientLayout header={!shouldHideHeader}>{children}</ClientLayout>
      ) : role === USER_TYPE.admin && isLoggedIn && isAdminRoute ? (
        <DashboardLayout>{children}</DashboardLayout>
      ) : (
        <>{children}</>
      )}
    </AuthMiddleware>
  );
};

export default LayoutSelector;
