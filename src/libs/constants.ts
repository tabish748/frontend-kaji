// 99	Super Admin	システム管理者
// 1	System Manager	システム管理者
// 2	Business Manager	業務管理者
// 3	Staff	スタッフ

// export const FINANCE_EMPLOYEE = "finance_employee"

export const PUBLIC_ROUTES = ["/cn-login", "/cn-contact-form" ,"/cn-forgot-password","/cn-reset-password", "/sign-up", "/404", "/unauthenticated"];

export const CLIENT_ROUTES = [
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

export const ADMIN_ROUTES = [
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
  client: "customer",
  admin: "admin",
};
