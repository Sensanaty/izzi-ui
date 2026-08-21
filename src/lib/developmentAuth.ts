export type DevelopmentCredentials = {
  username: string;
  password: string;
};

const isDevelopmentAutoLoginEnabled =
  import.meta.env.DEV && import.meta.env.VITE_AUTO_LOGIN === "true";

export const developmentCredentials: DevelopmentCredentials | null =
  isDevelopmentAutoLoginEnabled &&
  import.meta.env.VITE_AUTO_LOGIN_USERNAME &&
  import.meta.env.VITE_AUTO_LOGIN_PASSWORD
    ? {
        username: import.meta.env.VITE_AUTO_LOGIN_USERNAME,
        password: import.meta.env.VITE_AUTO_LOGIN_PASSWORD,
      }
    : null;
