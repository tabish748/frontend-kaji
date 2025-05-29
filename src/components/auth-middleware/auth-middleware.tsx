import React, { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/router";
import { useLanguage } from "@/localization/LocalContext";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { PUBLIC_ROUTES, CLIENT_ROUTES, ADMIN_ROUTES } from "@/libs/constants";

interface AuthMiddlewareProps {
  children: ReactNode;
}

const AuthMiddleware: React.FC<AuthMiddlewareProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { t } = useLanguage();
  const userRole = useSelector((state: RootState) => state.auth.userRole?.name);
  const currentPath = router.pathname;

  useEffect(() => {
    const token = localStorage.getItem("token");
    const departmentId =
      String(JSON.parse(localStorage.getItem("userDepartment") || "{}")?.id || null);
    const loggedInUserRole = localStorage.getItem("loggedInUserRoleId");

    // Handle public routes
    if (PUBLIC_ROUTES.includes(currentPath)) {
      setIsLoading(false);
      return;
    }

    // Redirect unauthenticated users trying to access protected routes
    // if (!token) {
    //   router.push('/unauthenticated');
    //   return;
    // }

    // Check if user is not authenticated
    // if (!token && !PUBLIC_ROUTES.includes(currentPath)) {
    //   router.push("/login");
    //   return;
    // }

    // All commented code preserved as is
    // if (!token) {
    //   window.location.href = "/login";
    //   return; // Early return to prevent further execution
    // }

    // // Check for role restrictions on specific paths
    // if (currentPath.includes('/settings') && loggedInUserRole) {
    //   const allowedRoles = ['1', '99',"2"];
    //   if (!allowedRoles.includes(loggedInUserRole)) {
    //     router.push('/unauthenticated');
    //     return; // Early return to prevent setting loading to false
    //   }
    // }

    // if (currentPath.includes('projectLegal/listing/') && departmentId) {
    //   const LegalAllowedRoles = ["1", '2'];
    //   if (!LegalAllowedRoles.includes(departmentId)) {
    //     router.push('/unauthenticated');
    //     return;
    //   }
    // }

    // if (currentPath.includes('projectConfirmed') && departmentId) {
    //   const TaxAllowedRoles = ['1', "2"];
    //   if (!TaxAllowedRoles.includes(departmentId)) {
    //     router.push('/unauthenticated');
    //     return;
    //   }
    // }
    // if (currentPath.includes('legalDashboard') && departmentId) {
    //   const TaxAllowedRoles = ["2"];
    //   if (!TaxAllowedRoles.includes(departmentId)) {
    //     router.push('/unauthenticated');
    //     return;
    //   }
    // }
  
    // if (currentPath.includes('insurance') && departmentId) {
    //   const InsuranceAllowedRoles = ['1', '2', '3'];
    //   if (!InsuranceAllowedRoles.includes(departmentId)) {
    //     router.push('/unauthenticated');
    //     return;
    //   }
    // }

    // if (currentPath.includes('employees') ||
    //   (currentPath.includes('inquiry')) ||
    //   (currentPath.includes('interview')) ||
    //   (
    //     (currentPath.includes('projectLegal')) ||
    //     (currentPath.includes('customer')) ||
    //     (currentPath.includes('projectConfirmed'))) && departmentId) {
    //   const restrictedPathForInsurance = ['3'];
    //   if (restrictedPathForInsurance.includes(departmentId)) {
    //     router.push('/unauthenticated');
    //     return;
    //   }
    // }

    // Handle client routes
    if (userRole === "client") {
      // Check if current path is in client routes
      const isClientRoute = CLIENT_ROUTES.some(route => currentPath.startsWith(route));
      if (!isClientRoute) {
        router.push("/unauthenticated");
        return;
      }
    }

    // Handle admin routes
    if (userRole === "admin") {
      // Admin can access both client and admin routes
      const isAdminRoute = [...CLIENT_ROUTES, ...ADMIN_ROUTES].some(route => currentPath.startsWith(route));
      if (!isAdminRoute) {
        router.push("/unauthenticated");
        return;
      }
    }

    setIsLoading(false);
  }, [router, userRole, currentPath]);

  if (isLoading) {
    return <div className="checkingMiddleWareSection">
      <h1>{t('checkingAuthentication')}</h1>
    </div>;
  }

  return children;
};

export default AuthMiddleware;
