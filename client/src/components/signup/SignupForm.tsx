"use client";
import { useRouter } from "next/navigation";
import {
  HiOutlineArrowLeft,
  HiOutlineArrowRight,
  HiOutlineRefresh,
} from "react-icons/hi";
import { useWatch } from "react-hook-form";
import { useSignupFlow } from "@/contexts/SignupFlowContext";
import { useAuthStore } from "@/stores/useAuthStore";
import SignupIdentityStep from "@/components/signup/SignupIdentityStep";
import SignupReviewStep from "@/components/signup/SignupReviewStep";
import SignupSecurityStep from "@/components/signup/SignupSecurityStep";

const STEP_TITLES = ["Account", "Security", "Review"];

export default function SignupForm() {
  const router = useRouter();
  const { error } = useAuthStore();
  const { step, totalSteps, nextStep, previousStep, submit, form } = useSignupFlow();
  const { formState: { isSubmitting } } = form;
  const agreed = useWatch({ control: form.control, name: "agreed", defaultValue: false });

  const handleSubmit = async () => {
    try {
      await submit();
      router.push("/");
    } catch {
      // Error handled by store
    }
  };

  const isLastStep = step === totalSteps - 1;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        {STEP_TITLES.map((title, index) => {
          const active = index === step;
          const complete = index < step;

          return (
            <div key={title} className="flex items-center gap-2 flex-1">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${complete || active ? "bg-primary text-white" : "bg-gray-100 text-gray-400"}`}>
                {index + 1}
              </div>
              <div className="min-w-0">
                <p className={`text-xs font-bold uppercase tracking-widest ${active ? "text-primary" : "text-gray-400"}`}>{title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {step === 0 && <SignupIdentityStep />}
      {step === 1 && <SignupSecurityStep />}
      {step === 2 && <SignupReviewStep />}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={previousStep}
          disabled={step === 0 || isSubmitting}
          className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 transition-all hover:border-gray-300 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <HiOutlineArrowLeft className="h-4 w-4" />
          Back
        </button>

        {isLastStep ? (
          <button
            type="button"
            onClick={() => {
              void handleSubmit();
            }}
            disabled={isSubmitting || !agreed}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-white transition-all shadow-md shadow-primary/25 hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? <HiOutlineRefresh className="h-4 w-4 animate-spin" /> : null}
            {isSubmitting ? "Creating account…" : "Create Account"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              void nextStep();
            }}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-white transition-all shadow-md shadow-primary/25 hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Continue
            <HiOutlineArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
