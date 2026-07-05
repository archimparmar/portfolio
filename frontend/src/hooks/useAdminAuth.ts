"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { portfolioApi } from "@/services/api";

export function useAdminAuth(requireAuth = true) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const logout = useCallback(() => {
    localStorage.removeItem("admin-token");
    setIsAuthenticated(false);
    setIsLoading(false);
    if (requireAuth) {
      router.push("/admin/login");
    }
  }, [router, requireAuth]);

  const verifySession = useCallback(async () => {
    const token = localStorage.getItem("admin-token");
    if (!token) {
      logout();
      return;
    }

    try {
      await portfolioApi.getMe();
      setIsAuthenticated(true);
      setIsLoading(false);
    } catch (err) {
      console.error("Token verification failed, logging out:", err);
      logout();
    }
  }, [logout]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    verifySession();
  }, [verifySession]);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("username", username);
      params.append("password", password);
      
      const data = await portfolioApi.adminLogin(params);
      localStorage.setItem("admin-token", data.access_token);
      setIsAuthenticated(true);
      setIsLoading(false);
      router.push("/admin/dashboard");
      return true;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  return { isAuthenticated, isLoading, login, logout, verifySession };
}
