// 99	Super Admin	システム管理者
// 1	System Manager	システム管理者
// 2	Business Manager	業務管理者
// 3	Staff	スタッフ

// export const FINANCE_EMPLOYEE = "finance_employee"

// Customer public routes (accessible without authentication) - uses customer theme
export const CUSTOMER_PUBLIC_ROUTES = ["/cn-login", "/cn-contact-form" ,"/cn-forgot-password","/cn-reset-password", "/sign-up", "/404", "/unauthenticated"];

// Admin public routes (accessible without authentication) - uses admin theme  
export const ADMIN_PUBLIC_ROUTES = ["/ad-login", "/admin-forgot-password", "/admin-reset-password", "/admin-contact-form", "/404", "/unauthenticated"];

// All public routes combined (for backward compatibility if needed)
export const ALL_PUBLIC_ROUTES = [...CUSTOMER_PUBLIC_ROUTES, ...ADMIN_PUBLIC_ROUTES];

export const CUSTOMER_ROUTES = [
  "/",
  "/cn-schedule",
  "/cn-about",
  "/cn-invoice",
  "/cn-quotation",
  "/cn-announcement",
  "/cn-request",
  "/cn-request/update-payment-method",
  "/cn-request/plan-change-request",
  "/cn-request/plan-add-request",
  "/cn-request/reactivate-request",
  "/cn-request/update-address",
  "/cn-change-password",
];

// Backward compatibility
export const CLIENT_ROUTES = CUSTOMER_ROUTES;

export const ADMIN_ROUTES = [
  "/",
  "/settings",
  "/projectLegal",
  "/projectConfirmed",
  "/legalDashboard",
  "/insurance",
  "/employees",
  "/inquiry",
  "/interview",
  "/customer",
];

export const LANG = ["EN", "JP"];

export const USER_TYPE = {
  customer: "end-user",
  admin: "client-cont",
};
