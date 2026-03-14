"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { HiOutlineRefresh } from "react-icons/hi";

const PUBLIC_ROUTES = new Set(["/login", "/signup"]);
const ADMIN_ROUTES = ["/admin"];

const isAdminRoute = (pathname: string) =>
  ADMIN_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { token, user, isChecking, bootstrapAuth } = useAuthStore();

  useEffect(() => {
    bootstrapAuth();
  }, [bootstrapAuth]);

  useEffect(() => {
    if (isChecking) return;

    const isPublicRoute = PUBLIC_ROUTES.has(pathname);
    if (!token && !isPublicRoute) {
      router.replace("/login");
      return;
    }

    if (token && isPublicRoute) {
      router.replace("/");
      return;
    }

    if (token && isAdminRoute(pathname) && user?.role !== "admin") {
      router.replace("/");
    }
  }, [isChecking, pathname, router, token, user?.role]);

  const isPublicRoute = PUBLIC_ROUTES.has(pathname);
  const isBlockedAdminRoute = token && isAdminRoute(pathname) && user?.role !== "admin";

  if (isChecking || (!token && !isPublicRoute) || isBlockedAdminRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f4f5] text-gray-500">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-sm">
          <HiOutlineRefresh className="h-5 w-5 animate-spin" />
          <span className="text-sm font-medium">Loading your workspace…</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
