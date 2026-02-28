import { readItems } from "@directus/sdk";
import directus from "@/lib/directus";
import {
  PRICING_PLANS,
  CUSTOM_PLAN_INCLUDES,
  PAYMENT_METHODS,
} from "@/constants/pricing";
import type { PricingPlan, CustomPlanInclude, PaymentMethod } from "@/types/directus";

export async function getPricingPlans(): Promise<PricingPlan[]> {
  try {
    const data = await directus.request(
      readItems("pricing_plans", { limit: -1, sort: ["id"] })
    );
    if (data?.length) return data as PricingPlan[];
  } catch {}
  return PRICING_PLANS.map((p, i) => ({ id: i + 1, ...p }));
}

export async function getCustomPlanIncludes(): Promise<string[]> {
  try {
    const data = await directus.request(
      readItems("custom_plan_includes", { limit: -1, sort: ["id"] })
    );
    if (data?.length)
      return (data as CustomPlanInclude[]).map((d) => d.item);
  } catch {}
  return CUSTOM_PLAN_INCLUDES;
}

export async function getPaymentMethods(): Promise<string[]> {
  try {
    const data = await directus.request(
      readItems("payment_methods", { limit: -1, sort: ["id"] })
    );
    if (data?.length)
      return (data as PaymentMethod[]).map((d) => d.method);
  } catch {}
  return PAYMENT_METHODS;
}
