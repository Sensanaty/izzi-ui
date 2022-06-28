import { UserModule } from "~/types";
import useAuthStore from "#store/auth";

export const install: UserModule = ({ router }) => {
  const auth = useAuthStore();

  router.beforeEach((to) => {
    if (to.meta.admin && !auth.checkToken()) {
      return "/login";
    }
  });
};
