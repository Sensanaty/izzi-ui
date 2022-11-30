import { LoginData } from "~/types/endpoints";

export interface User {
  id: number;
  username: LoginData["username"];
  email: LoginData["password"];
}
