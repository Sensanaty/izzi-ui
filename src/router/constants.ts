export const Route = {
  HOME: "home",
  LOGIN: "login",
  PART_NEW: "part-new",
  PART_EDIT: "part-edit",
} as const;

type ValidPathKey = { [key in keyof typeof Route]: string };

export const RoutePath = {
  HOME: "/",
  LOGIN: "/login",
  PART_NEW: "/parts/new",
  PART_EDIT: "/parts/:id/edit",
} as const satisfies ValidPathKey;
