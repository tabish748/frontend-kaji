import React, { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/router";
import { useLanguage } from "@/localization/LocalContext";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";

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

    if (!token) {
      window.location.href = "/login";
      return; // Early return to prevent further execution
    }

    // Check for role restrictions on specific paths
    if (currentPath.includes('/settings') && loggedInUserRole) {
      const allowedRoles = ['1', '99',"2"];
      if (!allowedRoles.includes(loggedInUserRole)) {
        router.push('/unauthenticated');
        return; // Early return to prevent setting loading to false
      }
    }

    if (currentPath.includes('projectLegal/listing/') && departmentId) {
      const LegalAllowedRoles = ["1", '2'];
      if (!LegalAllowedRoles.includes(departmentId)) {
        router.push('/unauthenticated');
        return;
      }
    }

    if (currentPath.includes('projectConfirmed') && departmentId) {
      const TaxAllowedRoles = ['1', "2"];
      if (!TaxAllowedRoles.includes(departmentId)) {
        router.push('/unauthenticated');
        return;
      }
    }
    if (currentPath.includes('legalDashboard') && departmentId) {
      const TaxAllowedRoles = ["2"];
      if (!TaxAllowedRoles.includes(departmentId)) {
        router.push('/unauthenticated');
        return;
      }
    }
  

    if (currentPath.includes('insurance') && departmentId) {

      const InsuranceAllowedRoles = ['1', '2', '3'];
      if (!InsuranceAllowedRoles.includes(departmentId)) {

        router.push('/unauthenticated');
        return;
      }
    }

    if (currentPath.includes('employees') ||
      (currentPath.includes('inquiry')) ||
      (currentPath.includes('interview')) ||
      (
        (currentPath.includes('projectLegal')) ||
        (currentPath.includes('customer')) ||
        (currentPath.includes('projectConfirmed'))) && departmentId) {

      const restrictedPathForInsurance = ['3'];
      if (restrictedPathForInsurance.includes(departmentId)) {

        router.push('/unauthenticated');
        return;
      }
    }

    if (userRole === "client") {
      const allowedUrls = [
        "/",
        "/cn-about",
        "/cn-schedule",
        "/cn-invoice",
        "/cn-quotation",
        "/cn-announcement",
        "/cn-request",
        "/cn-changepassword"
      ];
      if (!allowedUrls.includes(currentPath)) {
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
