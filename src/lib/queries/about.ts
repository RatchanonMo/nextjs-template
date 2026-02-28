import { readItems } from "@directus/sdk";
import directus from "@/lib/directus";
import { TEAM_MEMBERS } from "@/constants/team";
import { PARTNERS } from "@/constants/partners";
import { ABOUT_STATS, SOCIAL_LINKS } from "@/constants/about";
import type { TeamMember, Partner, AboutStat, SocialLink } from "@/types/directus";

export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const data = await directus.request(
      readItems("team_members", { limit: -1, sort: ["id"] })
    );
    if (data?.length) return data as TeamMember[];
  } catch {}
  return TEAM_MEMBERS;
}

export async function getPartners(): Promise<Partner[]> {
  try {
    const data = await directus.request(
      readItems("partners", { limit: -1, sort: ["id"] })
    );
    if (data?.length) return data as Partner[];
  } catch {}
  return PARTNERS;
}

export async function getAboutStats(): Promise<AboutStat[]> {
  try {
    const data = await directus.request(
      readItems("about_stats", { limit: -1, sort: ["id"] })
    );
    if (data?.length) return data as AboutStat[];
  } catch {}
  return ABOUT_STATS;
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  try {
    const data = await directus.request(
      readItems("social_links", { limit: -1, sort: ["id"] })
    );
    if (data?.length) return data as SocialLink[];
  } catch {}
  return SOCIAL_LINKS;
}
