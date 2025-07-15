import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { CUSTOMER_PUBLIC_ROUTES, ADMIN_PUBLIC_ROUTES, CUSTOMER_ROUTES, ADMIN_ROUTES, USER_TYPE } from '@/libs/constants';

type DashboardType = 'customer' | 'admin';

export const useTheme = () => {
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);
  
  const getUserData = () => {
    if (typeof window === 'undefined') return null;
    try {
      const loggedInUser = localStorage.getItem("loggedInUser");
      return loggedInUser ? JSON.parse(loggedInUser) : null;
    } catch (error) {
      console.error('Error parsing logged in user data:', error);
      return null;
    }
  };

  const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('token') !== null;
  const userData = getUserData();
  const userRole = userData?.userRole || null;
  const currentPath = router.pathname;

  const getDashboardType = (): DashboardType => {
    // For routes that exist in both arrays, prioritize based on context
    if (currentPath === '/404' || currentPath === '/unauthenticated') {
      // For ambiguous routes, check if user is authenticated and their role
      if (isAuthenticated && userRole === USER_TYPE.admin) {
        return 'admin';
      }
      // Default to customer for ambiguous routes
      return 'customer';
    }

    // Special handling for root route "/" - depends on user role
    if (currentPath === '/') {
      if (isAuthenticated && userRole) {
        const themeByRole = userRole === USER_TYPE.admin ? 'admin' : 'customer';
        return themeByRole;
      }
      // Default to customer for unauthenticated users on root
      return 'customer';
    }

    // Check admin public routes first (these should always use admin theme)
    if (ADMIN_PUBLIC_ROUTES.includes(currentPath)) {
      return 'admin';
    }

    // Check customer public routes (these should always use customer theme)
    if (CUSTOMER_PUBLIC_ROUTES.includes(currentPath)) {
      return 'customer';
    }

    // Check admin routes (these should always use admin theme)
    const isAdminRoute = ADMIN_ROUTES.some(route => {
      if (route === '/') {
        return false; // Root route handled above
      }
      return currentPath.startsWith(route);
    });
    if (isAdminRoute) {
      return 'admin';
    }
    
    // Check customer routes (these should always use customer theme)
    const isCustomerRoute = CUSTOMER_ROUTES.some(route => {
      if (route === '/') {
        return false; // Root route handled above
      }
      return currentPath.startsWith(route);
    });
    if (isCustomerRoute) {
      return 'customer';
    }

    // If no route match, fall back to user role
    if (isAuthenticated && userRole) {
      const themeByRole = userRole === USER_TYPE.admin ? 'admin' : 'customer';
      return themeByRole;
    }

    // Default to customer theme for unknown routes
    return 'customer';
  };

  const applyTheme = (dashboardType: DashboardType) => {
    // Only apply theme if running in the browser
    if (typeof window !== 'undefined') {
      // Apply the theme to the document root
      document.documentElement.setAttribute('data-dashboard', dashboardType);
      
      // Store in localStorage for persistence across page reloads
      localStorage.setItem('currentDashboardTheme', dashboardType);
    }
  };

  // Single useEffect to handle both initialization and route changes
  useEffect(() => {
    if (!router.isReady) return; // Wait for router to be ready
    
    const dashboardType = getDashboardType();
    applyTheme(dashboardType);
    
    if (!isInitialized) {
      setIsInitialized(true);
    }
  }, [router.isReady, currentPath, userRole, isAuthenticated, isInitialized, getDashboardType]);

  return {
    currentTheme: getDashboardType(),
    applyTheme
  };
}; 