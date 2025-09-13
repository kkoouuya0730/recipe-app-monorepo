"use client";

import { useUserStore } from "../store/user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useRequireAuth = () => {
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (user === null && userStr === null && token === null) {
      router.replace("/login");
    }
  }, [user, router]);

  return user;
};
