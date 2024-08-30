export const ROUTES = {
  login: "login",
  app: "app",
  dashboard: "dashboard",
  forgotPassword: "forgot-password",
  resetPassword: "reset-password",
  resetToken: "token",
  role: "role",
};

export const KEYS = {
  authToken: "authToken",
};

export const PAGE_LENGTH = 2;
export const SHOW_PAGE_COUNT_ARR = [10, 20, 40, 50];

export const STATUS_DRP = [
  { name: "Active", key: 1 },
  { name: "Inactive", key: 0 },
];
export const STATUS_notifications = [
  { name: "false", key: 0 },
  { name: "true", key: 1 },
];

export const ANNOUNCEMENT_TYPE = [
  { name: "email", key: 0 },
  { name: "push", key: 1 },
  { name: "SMS", key: 2 },
];
export const AnnouncementType = [
  { name: "Pending", key: "0" },
  { name: "In-Progress", key: "1" },
  { name: "Announced", key: "2" },
];
export const AnnouncementAddType = [
  { name: "email", key: "email" },
  { name: "push", key: "push" },
  { name: "sms", key: "sms" },
];
export const AnnouncementPlatform = [
  { name: "all", key: "all" },
  { name: "android", key: "android" },
  { name: "ios", key: "ios" },
  { name: "web", key: "web" },
];

export const AnnouncementRole = [
  { name: "Customer", key: "0" },
  { name: "Admin", key: "1" },
  { name: "SuperAdmin", key: "2" },
];
export const ModuleNames = [
  "CMS Management",
  "FAQ Management",
  "Role",
  "Sub Admin",
  "Email Template",
  "User",
  "Settings",
  "Category",
  "Suggestion",
  "Event Management",
  "Entity Lock",
];
