"use client";

import { HiCheck } from "react-icons/hi";
import { useFormContext } from "react-hook-form";
import { SignupFlowValues } from "@/types/auth";

export default function SignupReviewStep() {
  const { register, watch, getValues, setValue, formState: { errors } } = useFormContext<SignupFlowValues>();
  const values = watch();

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 space-y-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Full Name</p>
          <p className="mt-1 text-sm font-medium text-gray-800">{values.name || "-"}</p>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Email</p>
          <p className="mt-1 text-sm font-medium text-gray-800">{values.email || "-"}</p>
        </div>
      </div>

      <label className="flex items-start gap-3 cursor-pointer select-none">
        <div
          onClick={() => setValue("agreed", !getValues("agreed"), { shouldValidate: true, shouldDirty: true, shouldTouch: true })}
          className={`w-5 h-5 shrink-0 mt-0.5 rounded-md border-2 flex items-center justify-center transition-all ${
            values.agreed ? "bg-primary border-primary" : "border-gray-300 bg-white hover:border-primary/50"
          }`}
        >
          {values.agreed && <HiCheck className="w-3 h-3 text-white" />}
        </div>
        <span className="text-sm text-gray-600 leading-snug">
          I agree to the <span className="font-semibold text-primary">Terms of Service</span> and <span className="font-semibold text-primary">Privacy Policy</span>
        </span>
      </label>
      <input type="hidden" {...register("agreed")} />
      {errors.agreed && <p className="text-xs text-red-500 font-medium -mt-3">{errors.agreed.message}</p>}
    </div>
  );
}