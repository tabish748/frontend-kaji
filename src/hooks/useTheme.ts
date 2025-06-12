import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { CUSTOMER_PUBLIC_ROUTES, ADMIN_PUBLIC_ROUTES, CUSTOMER_ROUTES, ADMIN_ROUTES, USER_TYPE } from '@/libs/constants';

type DashboardType = 'customer' | 'admin';

export const useTheme = () => {
  const router = useRouter();
  const userRole = localStorage.getItem("loggedInUser") ? JSON.parse(localStorage.getItem("loggedInUser")!).userRole : null;
  const isAuthenticated = useSelector((state: RootState) => state.auth?.isAuthenticated) || localStorage.getItem('token') !== null;
  const currentPath = router.pathname;

  const getDashboardType = (): DashboardType => {
    // Check if it's a customer public route - apply customer theme
    if (CUSTOMER_PUBLIC_ROUTES.includes(currentPath)) {
      return 'customer';
    }

    // Check if it's an admin public route - apply admin theme
    if (ADMIN_PUBLIC_ROUTES.includes(currentPath)) {
      return 'admin';
    }

    // Check if user is authenticated and get their role
    if (isAuthenticated) {
      // Admin routes
      if (ADMIN_ROUTES.some(route => currentPath.startsWith(route)) || userRole === USER_TYPE.admin) {
        return 'admin';
      }
      
      // Customer routes (including default authenticated users)
      if (CUSTOMER_ROUTES.some(route => currentPath.startsWith(route)) || userRole === USER_TYPE.customer) {
        return 'customer';
      }
    }

    // Default to customer theme for unknown routes
    return 'customer';
  };

  const applyTheme = (dashboardType: DashboardType) => {
    // Apply the theme to the document root
    document.documentElement.setAttribute('data-dashboard', dashboardType);
    
    // Store in localStorage for persistence across page reloads
    localStorage.setItem('currentDashboardTheme', dashboardType);
  };

  useEffect(() => {
    const dashboardType = getDashboardType();
    applyTheme(dashboardType);
  }, [currentPath, userRole, isAuthenticated]);

  // Initialize theme on mount
  useEffect(() => {
    // Check if there's a logged-in user to determine initial theme
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      try {
        const userData = JSON.parse(loggedInUser);
        const dashboardType = userData.userRole === USER_TYPE.admin ? 'admin' : 'customer';
        applyTheme(dashboardType);
      } catch (error) {
        console.error('Error parsing logged in user data:', error);
        // If on admin public route, use admin theme, otherwise customer theme
        const dashboardType = ADMIN_PUBLIC_ROUTES.includes(window.location.pathname) ? 'admin' : 'customer';
        applyTheme(dashboardType);
      }
    } else {
      // No logged in user - determine theme based on current route
      const dashboardType = getDashboardType();
      applyTheme(dashboardType);
    }
  }, []);

  return {
    currentTheme: getDashboardType(),
    applyTheme
  };
}; 