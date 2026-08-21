export const Route = {
  HOME: "home",
  LOGIN: "login",
} as const;

type ValidPathKey = { [key in keyof typeof Route]: string };

export const RoutePath = {
  HOME: "/",
  LOGIN: "/login",
} as const satisfies ValidPathKey;
