// 99	Super Admin	システム管理者
// 1	System Manager	システム管理者
// 2	Business Manager	業務管理者
// 3	Staff	スタッフ

// export const FINANCE_EMPLOYEE = "finance_employee"

export const PUBLIC_ROUTES = ["/login", "/sign-up", "/404", "/unauthenticated"];

export const CLIENT_ROUTES = [
  "/",
  "/cn-schedule",
  "/cn-about",
  "/cn-invoice",
  "/cn-quotation",
  "/cn-announcement",
  "/cn-request",
  "/cn-request/update-paymentMethod",
  "/cn-request/reactivate-request",
  "/cn-request/update-address",
  "/cn-changepassword",
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
  client: "client",
  admin: "admin",
};
