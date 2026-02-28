import { readItems } from "@directus/sdk";
import directus from "@/lib/directus";
import { PROBLEMS } from "@/constants/problems";
import { FEATURES } from "@/constants/features";
import { STEPS } from "@/constants/steps";
import { AUDIENCES } from "@/constants/audiences";
import { TESTIMONIALS } from "@/constants/testimonials";
import { FAQS } from "@/constants/faqs";
import type {
  Problem,
  Feature,
  Step,
  Audience,
  Testimonial,
  Faq,
} from "@/types/directus";

export async function getProblems(): Promise<Problem[]> {
  try {
    const data = await directus.request(
      readItems("problems", { limit: -1, sort: ["id"] })
    );
    if (data?.length) return data as Problem[];
  } catch {}
  return PROBLEMS.map((p, i) => ({ id: i + 1, ...p }));
}

export async function getFeatures(): Promise<Feature[]> {
  try {
    const data = await directus.request(
      readItems("features", { limit: -1, sort: ["id"] })
    );
    if (data?.length) return data as Feature[];
  } catch {}
  return FEATURES.map((f, i) => ({ id: i + 1, ...f }));
}

export async function getSteps(): Promise<Step[]> {
  try {
    const data = await directus.request(
      readItems("steps", { limit: -1, sort: ["id"] })
    );
    if (data?.length) return data as Step[];
  } catch {}
  return STEPS.map((s, i) => ({ id: i + 1, ...s }));
}

export async function getAudiences(): Promise<Audience[]> {
  try {
    const data = await directus.request(
      readItems("audiences", { limit: -1, sort: ["id"] })
    );
    if (data?.length) return data as Audience[];
  } catch {}
  return AUDIENCES.map((a, i) => ({ id: i + 1, ...a }));
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const data = await directus.request(
      readItems("testimonials", { limit: -1, sort: ["id"] })
    );
    if (data?.length) return data as Testimonial[];
  } catch {}
  return TESTIMONIALS.map((t, i) => ({ id: i + 1, ...t }));
}

export async function getFaqs(): Promise<Faq[]> {
  try {
    const data = await directus.request(
      readItems("faqs", { limit: -1, sort: ["id"] })
    );
    if (data?.length) return data as Faq[];
  } catch {}
  return FAQS.map((f, i) => ({ id: i + 1, ...f }));
}
