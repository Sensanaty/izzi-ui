export const Route = {
  HOME: "home",
} as const;

type ValidPathKey = { [key in keyof typeof Route]: string };

export const RoutePath = {
  HOME: "/",
} as const satisfies ValidPathKey;
