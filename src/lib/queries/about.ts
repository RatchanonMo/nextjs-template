import { readItems } from "@directus/sdk";
import directus from "@/lib/directus";
import { assetUrl } from "@/lib/asset-url";
import { TEAM_MEMBERS } from "@/constants/team";
import { PARTNERS } from "@/constants/partners";
import { ABOUT_STATS, SOCIAL_LINKS } from "@/constants/about";
import type { TeamMember, Partner, AboutStat, SocialLink } from "@/types/directus";

export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const data = await directus.request(
      readItems("team_members", { limit: -1, sort: ["id"] })
    );
    if (data?.length)
      return (data as TeamMember[]).map((m) => ({ ...m, photo: assetUrl(m.photo) }));
  } catch {}
  return TEAM_MEMBERS.map((m) => ({ ...m, photo: null }));
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
    if (data?.length)
      return (data as AboutStat[]).map((s) => ({ ...s, icon: assetUrl(s.icon) }));
  } catch {}
  return ABOUT_STATS.map((s) => ({ ...s, icon: null }));
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
