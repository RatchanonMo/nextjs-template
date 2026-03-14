"use client";

import { useFormContext } from "react-hook-form";
import { HiOutlineMail, HiOutlineRefresh, HiOutlineUser } from "react-icons/hi";
import { SignupFlowValues } from "@/types/auth";
import { useSignupFlow } from "@/contexts/SignupFlowContext";
import { useAuthStore } from "@/stores/useAuthStore";

export default function SignupIdentityStep() {
  const { register, formState: { errors } } = useFormContext<SignupFlowValues>();
  const { isCheckingEmail, emailAvailability } = useSignupFlow();
  const { clearError } = useAuthStore();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">
          Full Name
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <HiOutlineUser className="w-4 h-4" />
          </div>
          <input
            type="text"
            {...register("name", { onChange: () => clearError() })}
            placeholder="John Doe"
            className={`w-full bg-gray-50 border rounded-2xl pl-11 pr-4 py-3.5 text-sm font-medium text-gray-800 outline-none focus:bg-white focus:ring-2 transition-all placeholder:font-normal placeholder:text-gray-400 ${
              errors.name
                ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                : "border-gray-200 focus:border-primary focus:ring-primary/10"
            }`}
          />
        </div>
        {errors.name && <p className="text-xs text-red-500 font-medium mt-1.5">{errors.name.message}</p>}
      </div>

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
              onChange: () => clearError(),
            })}
            placeholder="you@example.com"
            className={`w-full bg-gray-50 border rounded-2xl pl-11 pr-10 py-3.5 text-sm font-medium text-gray-800 outline-none focus:bg-white focus:ring-2 transition-all placeholder:font-normal placeholder:text-gray-400 ${
              errors.email
                ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                : "border-gray-200 focus:border-primary focus:ring-primary/10"
            }`}
          />
          {isCheckingEmail && <HiOutlineRefresh className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />}
        </div>
        {errors.email && <p className="text-xs text-red-500 font-medium mt-1.5">{errors.email.message}</p>}
        {!errors.email && emailAvailability === "available" && (
          <p className="text-xs text-emerald-600 font-medium mt-1.5">Email is available</p>
        )}
      </div>
    </div>
  );
}