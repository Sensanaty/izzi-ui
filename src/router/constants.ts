export const Route = {
  HOME: "home",
  LOGIN: "login",
  PART_NEW: "part-new",
  PART_EDIT: "part-edit",
  COMPANY_NEW: "company-new",
  COMPANY_EDIT: "company-edit",
  COMPANIES: "companies",
  CLIENTS: "clients",
  CLIENT_NEW: "client-new",
  CLIENT_EDIT: "client-edit",
  USERS: "users",
  USER_NEW: "user-new",
  USER_EDIT: "user-edit",
} as const;

type ValidPathKey = { [key in keyof typeof Route]: string };

export const RoutePath = {
  HOME: "/",
  LOGIN: "/login",
  PART_NEW: "/parts/new",
  PART_EDIT: "/parts/:id/edit",
  COMPANY_NEW: "/companies/new",
  COMPANY_EDIT: "/companies/:id/edit",
  COMPANIES: "/companies",
  CLIENTS: "/clients",
  CLIENT_NEW: "/clients/new",
  CLIENT_EDIT: "/clients/:id/edit",
  USERS: "/users",
  USER_NEW: "/users/new",
  USER_EDIT: "/users/:id/edit",
} as const satisfies ValidPathKey;
