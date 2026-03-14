"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { HiOutlineEye, HiOutlineEyeOff, HiOutlineLockClosed, HiOutlineShieldCheck } from "react-icons/hi";
import { SignupFlowValues } from "@/types/auth";
import { useAuthStore } from "@/stores/useAuthStore";

export default function SignupSecurityStep() {
  const { register, watch, formState: { errors } } = useFormContext<SignupFlowValues>();
  const { clearError } = useAuthStore();
  const password = watch("password");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const strength = !password ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : /[^a-zA-Z0-9]/.test(password) ? 4 : 3;
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["", "bg-red-400", "bg-yellow-400", "bg-primary/60", "bg-primary"];

  return (
    <div className="flex flex-col gap-5">
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
            {...register("password", { onChange: () => clearError() })}
            placeholder="••••••••"
            className={`w-full bg-gray-50 border rounded-2xl pl-11 pr-12 py-3.5 text-sm font-medium text-gray-800 outline-none focus:bg-white focus:ring-2 transition-all placeholder:font-normal placeholder:text-gray-400 ${
              errors.password
                ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                : "border-gray-200 focus:border-primary focus:ring-primary/10"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <HiOutlineEyeOff className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
          </button>
        </div>
        {password && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex gap-1 flex-1">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className={`h-1 flex-1 rounded-full transition-all ${n <= strength ? strengthColors[strength] : "bg-gray-200"}`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-gray-500">{strengthLabels[strength]}</span>
          </div>
        )}
        {errors.password && <p className="text-xs text-red-500 font-medium mt-1.5">{errors.password.message}</p>}
      </div>

      <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">
          Confirm Password
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <HiOutlineShieldCheck className="w-4 h-4" />
          </div>
          <input
            type={showConfirm ? "text" : "password"}
            {...register("confirmPassword", { onChange: () => clearError() })}
            placeholder="••••••••"
            className={`w-full bg-gray-50 border rounded-2xl pl-11 pr-12 py-3.5 text-sm font-medium text-gray-800 outline-none focus:bg-white focus:ring-2 transition-all placeholder:font-normal placeholder:text-gray-400 ${
              errors.confirmPassword
                ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                : "border-gray-200 focus:border-primary focus:ring-primary/10"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((value) => !value)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showConfirm ? <HiOutlineEyeOff className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-red-500 font-medium mt-1.5">{errors.confirmPassword.message}</p>
        )}
      </div>
    </div>
  );
}