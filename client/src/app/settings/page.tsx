"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import Sidebar from "@/components/Sidebar";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/stores/useAuthStore";
import { useTaskStore } from "@/stores/useTaskStore";
import { ChangePasswordFormData } from "@/types/auth";
import { HiOutlineKey, HiOutlineLockClosed, HiOutlineRefresh, HiOutlineShieldCheck } from "react-icons/hi";

type ChangePasswordFields = ChangePasswordFormData & {
  confirmPassword: string;
};

export default function SettingsPage() {
  const router = useRouter();
  const { error, clearError, changePassword } = useAuthStore();
  const { tasks } = useTaskStore();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    watch,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFields>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  const currentPassword = watch("currentPassword");
  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");

  const passwordChecks = useMemo(() => {
    return {
      minLength: newPassword.length >= 6,
      hasLetter: /[A-Za-z]/.test(newPassword),
      hasNumber: /\d/.test(newPassword),
      isDifferent: newPassword.length > 0 && newPassword !== currentPassword,
      confirmMatch: confirmPassword.length > 0 && confirmPassword === newPassword,
    };
  }, [confirmPassword, currentPassword, newPassword]);

  const canSubmit =
    currentPassword.length > 0 &&
    passwordChecks.minLength &&
    passwordChecks.hasLetter &&
    passwordChecks.hasNumber &&
    passwordChecks.isDifferent &&
    passwordChecks.confirmMatch;

  const onSubmit: SubmitHandler<ChangePasswordFields> = async ({ currentPassword, newPassword }) => {
    clearError();
    setSuccessMessage(null);

    try {
      const message = await changePassword({ currentPassword, newPassword });
      setSuccessMessage(message);
      reset();
      router.replace(ROUTES.LOGIN);
    } catch {
      // Error state is managed by useAuthStore
    }
  };

  const inboxCount = tasks.filter((task) => task.status !== "done").length;

  return (
    <div className="flex h-screen bg-[#f4f4f5] overflow-hidden">
      <Sidebar inboxCount={inboxCount} />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex items-start justify-between px-8 pt-7 pb-4 border-b border-gray-100 bg-white/70 backdrop-blur-sm">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Account Settings</h1>
            <p className="text-gray-400 text-sm mt-0.5">Update your password and secure your account.</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <section className="max-w-2xl rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-5">
              <HiOutlineShieldCheck className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Current password</span>
                <div className="mt-1.5 relative">
                  <HiOutlineLockClosed className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    {...register("currentPassword", {
                      required: "Current password is required",
                      onChange: () => {
                        clearError();
                        setSuccessMessage(null);
                      },
                    })}
                    className={`w-full rounded-xl border bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none ${
                      errors.currentPassword
                        ? "border-red-300 focus:border-red-400"
                        : "border-gray-200 focus:border-primary/50"
                    }`}
                    placeholder="Enter current password"
                    autoComplete="current-password"
                  />
                </div>
                {errors.currentPassword && (
                  <p className="text-xs text-red-500 font-medium mt-1.5">{errors.currentPassword.message}</p>
                )}
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">New password</span>
                <div className="mt-1.5 relative">
                  <HiOutlineKey className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    {...register("newPassword", {
                      required: "New password is required",
                      minLength: { value: 6, message: "Password must be at least 6 characters" },
                      validate: {
                        hasLetter: (value) => /[A-Za-z]/.test(value) || "Password must include at least one letter",
                        hasNumber: (value) => /\d/.test(value) || "Password must include at least one number",
                        differentFromCurrent: (value) =>
                          value !== watch("currentPassword") || "New password must be different from current password",
                      },
                      onChange: () => {
                        clearError();
                        setSuccessMessage(null);
                      },
                    })}
                    className={`w-full rounded-xl border bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none ${
                      errors.newPassword
                        ? "border-red-300 focus:border-red-400"
                        : "border-gray-200 focus:border-primary/50"
                    }`}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                  />
                </div>
                {errors.newPassword && (
                  <p className="text-xs text-red-500 font-medium mt-1.5">{errors.newPassword.message}</p>
                )}
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">Confirm new password</span>
                <div className="mt-1.5 relative">
                  <HiOutlineRefresh className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    {...register("confirmPassword", {
                      required: "Please confirm your new password",
                      validate: (value) => value === watch("newPassword") || "Confirmation does not match",
                      onChange: () => {
                        clearError();
                        setSuccessMessage(null);
                      },
                    })}
                    className={`w-full rounded-xl border bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none ${
                      errors.confirmPassword
                        ? "border-red-300 focus:border-red-400"
                        : "border-gray-200 focus:border-primary/50"
                    }`}
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 font-medium mt-1.5">{errors.confirmPassword.message}</p>
                )}
              </label>

              <div className="rounded-xl bg-gray-50 p-3 text-xs text-gray-600 space-y-1.5">
                <p className={passwordChecks.minLength ? "text-emerald-600" : "text-gray-500"}>At least 6 characters</p>
                <p className={passwordChecks.hasLetter ? "text-emerald-600" : "text-gray-500"}>Contains at least one letter</p>
                <p className={passwordChecks.hasNumber ? "text-emerald-600" : "text-gray-500"}>Contains at least one number</p>
                <p className={passwordChecks.isDifferent ? "text-emerald-600" : "text-gray-500"}>Different from current password</p>
                <p className={passwordChecks.confirmMatch ? "text-emerald-600" : "text-gray-500"}>Confirmation matches</p>
              </div>

              {error && (
                <p className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">{error}</p>
              )}

              {successMessage && (
                <p className="rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-sm text-emerald-700">{successMessage}</p>
              )}

              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Updating..." : "Change Password"}
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
