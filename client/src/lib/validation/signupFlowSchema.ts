import { z } from "zod";

export const signupFlowSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: z.email("Please enter a valid email").transform((value) => value.trim().toLowerCase()),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .refine((value) => /[A-Za-z]/.test(value), "Password must include at least one letter")
      .refine((value) => /\d/.test(value), "Password must include at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    agreed: z
      .boolean()
      .refine((value) => value, "You must accept Terms of Service and Privacy Policy"),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })
  .refine((value) => value.password !== value.name, {
    path: ["password"],
    message: "Password should not match your name",
  });

export const signupIdentityFields = ["name", "email"] as const;
export const signupSecurityFields = ["password", "confirmPassword"] as const;
export const signupReviewFields = ["agreed"] as const;

export type SignupStepField =
  | (typeof signupIdentityFields)[number]
  | (typeof signupSecurityFields)[number]
  | (typeof signupReviewFields)[number];