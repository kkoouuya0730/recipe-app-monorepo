"use client";

import { useUserStore } from "../store/user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useRedirectIfAuth = (redirectTo: string = "/profile") => {
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace(redirectTo);
    }
  }, [user, router, redirectTo]);
};
