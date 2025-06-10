// src/components/layout/LayoutSelector.tsx
import ClientLayout from "./client-layout";
import DashboardLayout from "./dashboard-layout";
import { useEffect, useState } from "react";
import AuthMiddleware from "../auth-middleware/auth-middleware";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { useRouter } from "next/router";
import { PUBLIC_ROUTES, CLIENT_ROUTES, ADMIN_ROUTES, USER_TYPE } from "@/libs/constants";

interface LayoutSelectorProps {
  children: React.ReactNode;
}

const LayoutSelector = ({ children }: LayoutSelectorProps) => {
  const [role, setRole] = useState<string | null>(null);
  const userRole = useSelector((state: RootState) => state.auth.userRole?.name);
  const isLoggedIn = true;
  const router = useRouter();
  const currentPath = router.pathname;

  const isClientRoute = CLIENT_ROUTES.includes(currentPath);
  const isAdminRoute = [...CLIENT_ROUTES, ...ADMIN_ROUTES].includes(
    currentPath
  );
  const isPublicRoute = PUBLIC_ROUTES.includes(currentPath);

  useEffect(() => {
    const loggedInUserRole = localStorage.getItem("loggedInUserRoleId");
    setRole(userRole || USER_TYPE.client);
  }, [userRole]);

  // Redirect to /unauthenticated if route is not allowed
  useEffect(() => {
    if (!isPublicRoute && !isClientRoute && !isAdminRoute) {
      router.replace("/unauthenticated");
    }
  }, [currentPath, isPublicRoute, isClientRoute, isAdminRoute, router]);

  // Public pages: no layout
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // No layout for /unauthenticated
  if (currentPath === "/unauthenticated") {
    return <>{children}</>;
  }

  const shouldHideHeader = CLIENT_ROUTES.some((route) =>
    currentPath.startsWith(route + "/")
  );

  return (
    <AuthMiddleware>
      {role === USER_TYPE.client && isLoggedIn && isClientRoute ? (
        <ClientLayout header={!shouldHideHeader}>{children}</ClientLayout>
      ) : role === "admin" && isLoggedIn && isAdminRoute ? (
        <DashboardLayout>{children}</DashboardLayout>
      ) : (
        <>{children}</>
      )}
    </AuthMiddleware>
  );
};

export default LayoutSelector;
