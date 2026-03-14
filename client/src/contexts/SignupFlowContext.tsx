"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, UseFormReturn } from "react-hook-form";
import { authAPI } from "@/lib/api/authAPI";
import { signupFlowSchema, signupIdentityFields, signupReviewFields, signupSecurityFields } from "@/lib/validation/signupFlowSchema";
import { useAuthStore } from "@/stores/useAuthStore";
import { SignupFlowValues } from "@/types/auth";

const SIGNUP_FLOW_STORAGE_KEY = "flowtask_signup_flow_draft";

const defaultValues: SignupFlowValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  agreed: false,
};

const stepFieldMap = [signupIdentityFields, signupSecurityFields, signupReviewFields] as const;

type SignupFlowContextValue = {
  form: UseFormReturn<SignupFlowValues>;
  step: number;
  totalSteps: number;
  isCheckingEmail: boolean;
  emailAvailability: "idle" | "available" | "taken";
  nextStep: () => Promise<void>;
  previousStep: () => void;
  submit: () => Promise<void>;
};

const SignupFlowContext = createContext<SignupFlowContextValue | null>(null);

const readPersistedDraft = (): SignupFlowValues => {
  if (typeof window === "undefined") return defaultValues;

  const raw = window.localStorage.getItem(SIGNUP_FLOW_STORAGE_KEY);
  if (!raw) return defaultValues;

  try {
    return { ...defaultValues, ...(JSON.parse(raw) as Partial<SignupFlowValues>) };
  } catch {
    return defaultValues;
  }
};

export function SignupFlowProvider({ children }: { children: React.ReactNode }) {
  const { register: registerAccount, clearError } = useAuthStore();
  const [step, setStep] = useState(0);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailAvailability, setEmailAvailability] = useState<"idle" | "available" | "taken">("idle");
  const lastCheckedEmailRef = useRef<string>("");

  const form = useForm<SignupFlowValues>({
    resolver: zodResolver(signupFlowSchema),
    defaultValues: readPersistedDraft(),
    mode: "onBlur",
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (typeof window === "undefined") return;
      window.localStorage.setItem(SIGNUP_FLOW_STORAGE_KEY, JSON.stringify(value));
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const validateEmailAvailability = useCallback(async () => {
    const emailValue = form.getValues("email").trim().toLowerCase();
    if (!emailValue) return false;

    if (lastCheckedEmailRef.current === emailValue && emailAvailability === "available") {
      return true;
    }

    setIsCheckingEmail(true);
    try {
      const result = await authAPI.checkEmailAvailability(emailValue);
      lastCheckedEmailRef.current = result.email;

      if (!result.available) {
        setEmailAvailability("taken");
        form.setError("email", { type: "server", message: "Email is already registered" });
        return false;
      }

      setEmailAvailability("available");
      form.clearErrors("email");
      return true;
    } catch {
      setEmailAvailability("idle");
      form.setError("email", { type: "server", message: "Unable to validate email right now" });
      return false;
    } finally {
      setIsCheckingEmail(false);
    }
  }, [emailAvailability, form]);

  const nextStep = useCallback(async () => {
    clearError();
    const fields = stepFieldMap[step];
    const valid = await form.trigger([...fields]);
    if (!valid) return;

    if (step === 0) {
      const available = await validateEmailAvailability();
      if (!available) return;
    }

    setStep((current) => Math.min(current + 1, stepFieldMap.length - 1));
  }, [clearError, form, step, validateEmailAvailability]);

  const previousStep = useCallback(() => {
    setStep((current) => Math.max(current - 1, 0));
  }, []);

  const submit = useCallback(async () => {
    clearError();
    await form.handleSubmit(async (values) => {
      await registerAccount({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      if (typeof window !== "undefined") {
        window.localStorage.removeItem(SIGNUP_FLOW_STORAGE_KEY);
      }
    })();
  }, [clearError, form, registerAccount]);

  const value = useMemo<SignupFlowContextValue>(() => ({
    form,
    step,
    totalSteps: stepFieldMap.length,
    isCheckingEmail,
    emailAvailability,
    nextStep,
    previousStep,
    submit,
  }), [emailAvailability, form, isCheckingEmail, nextStep, previousStep, step, submit]);

  return (
    <SignupFlowContext.Provider value={value}>
      <FormProvider {...form}>{children}</FormProvider>
    </SignupFlowContext.Provider>
  );
}

export const useSignupFlow = () => {
  const context = useContext(SignupFlowContext);
  if (!context) {
    throw new Error("useSignupFlow must be used within SignupFlowProvider");
  }
  return context;
};