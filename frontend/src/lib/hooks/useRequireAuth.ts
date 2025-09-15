"use client";

import { useUserStore } from "../store/user";
import { useEffect } from "react";

export const useRequireAuth = () => {
  const { user, fetchUser } = useUserStore();

  useEffect(() => {
    fetchUser();
  }, []);

  return user;
};
