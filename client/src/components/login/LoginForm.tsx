"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineLockClosed,
  HiOutlineMail,
  HiOutlineRefresh,
} from "react-icons/hi";
import { useAuthStore } from "@/stores/useAuthStore";
import { LoginFormData } from "@/types/auth";

export default function LoginForm() {
  const router = useRouter();
  const { login, error, clearError } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit: SubmitHandler<LoginFormData> = async (values) => {
    clearError();
    try {
      await login(values);
      router.push("/");
    } catch {
      // Error handled by store
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <HiOutlineMail className="w-4 h-4" />
          </div>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email",
              },
              onChange: () => clearError(),
            })}
            placeholder="you@example.com"
            className={`w-full bg-gray-50 border rounded-2xl pl-11 pr-4 py-3.5 text-sm font-medium text-gray-800 outline-none focus:bg-white focus:ring-2 transition-all placeholder:font-normal placeholder:text-gray-400 ${
              errors.email
                ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                : "border-gray-200 focus:border-primary focus:ring-primary/10"
            }`}
          />
        </div>
        {errors.email && <p className="text-xs text-red-500 font-medium mt-1.5">{errors.email.message}</p>}
      </div>

      <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">
          Password
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <HiOutlineLockClosed className="w-4 h-4" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters" },
              onChange: () => clearError(),
            })}
            placeholder="••••••••"
            className={`w-full bg-gray-50 border rounded-2xl pl-11 pr-12 py-3.5 text-sm font-medium text-gray-800 outline-none focus:bg-white focus:ring-2 transition-all placeholder:font-normal placeholder:text-gray-400 ${
              errors.password
                ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                : "border-gray-200 focus:border-primary focus:ring-primary/10"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <HiOutlineEyeOff className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-500 font-medium mt-1.5">{errors.password.message}</p>}
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary hover:bg-primary-600 active:scale-[0.98] text-white font-bold py-3.5 rounded-2xl transition-all shadow-md shadow-primary/25 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <HiOutlineRefresh className="w-4 h-4 animate-spin" />
            Signing in…
          </span>
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
}
