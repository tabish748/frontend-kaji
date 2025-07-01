import React, { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/router";
import { useLanguage } from "@/localization/LocalContext";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import {
  CUSTOMER_PUBLIC_ROUTES,
  CLIENT_ROUTES,
  ADMIN_ROUTES,
  USER_TYPE,
  ADMIN_PUBLIC_ROUTES,
} from "@/libs/constants";

interface AuthMiddlewareProps {
  children: ReactNode;
}

const AuthMiddleware: React.FC<AuthMiddlewareProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { t } = useLanguage();
  const userRole = localStorage.getItem("loggedInUser")
    ? JSON.parse(localStorage.getItem("loggedInUser")!).userRole
    : null;
  const currentPath = router.pathname;

  useEffect(() => {
    const token = localStorage.getItem("token");
    const departmentId = String(
      JSON.parse(localStorage.getItem("userDepartment") || "{}")?.id || null
    );
    const loggedInUser = JSON.parse(
      localStorage.getItem("loggedInUser") || "{}"
    );

    // Handle public routes
    if (
      CUSTOMER_PUBLIC_ROUTES.includes(currentPath) ||
      ADMIN_PUBLIC_ROUTES.includes(currentPath)
    ) {
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
    if (userRole === USER_TYPE.customer) {
      // Check if current path is in client routes
      if (loggedInUser?.profile_completed === 0 && 
          currentPath !== "/cn-info" && 
          currentPath !== "/cn-info-child") {
        if (loggedInUser?.profile_completion_steps?.customer_order_form === false) {
          router.push(`/cn-info/?section=customer${router.query.lang ? `&lang=${router.query.lang}` : ''}`);
          return;
        } else {
          router.push("/cn-info-child");
          return;
        }
      }

      // Check if profile is completed but child_info is not completed
      if (loggedInUser?.profile_completed === 1 && 
          loggedInUser?.profile_completion_steps?.child_info === false &&
          currentPath !== "/cn-info-child") {
        router.push("/cn-info-child");
        return;
      }

      const isClientRoute = CLIENT_ROUTES.some((route) =>
        currentPath.startsWith(route)
      );
      if (!isClientRoute) {
        router.push("/unauthenticated");
        return;
      }
    }

    // Handle admin routes
    if (userRole === USER_TYPE.admin) {
      const isAdminRoute = [...ADMIN_ROUTES].some((route) =>
        currentPath.startsWith(route)
      );
      if (!isAdminRoute) {
        router.push("/unauthenticated");
        return;
      }
    }

    // Handle invalid or undefined roles
    if (
      userRole !== USER_TYPE.customer &&
      userRole !== USER_TYPE.admin &&
      !CUSTOMER_PUBLIC_ROUTES.includes(currentPath) &&
      !ADMIN_PUBLIC_ROUTES.includes(currentPath)
    ) {
      router.push("/cn-login");
      return;
    }

    setIsLoading(false);
  }, [router, userRole, currentPath]);

  if (isLoading) {
    return (
      <div className="checkingMiddleWareSection">
        <h1>{t("checkingAuthentication")}</h1>
      </div>
    );
  }

  return children;
};

export default AuthMiddleware;
