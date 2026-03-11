// ---------------------------------------------------------------------------
// Shared primitive types
// ---------------------------------------------------------------------------

export type Problem = {
  id: number;
  label: string;
};

export type Feature = {
  id: number;
  title: string;
  description: string;
  bg: string;
  text: string;
  subText: string;
};

export type Step = {
  id: number;
  step: string;
  title: string;
  description: string;
};

export type AudiencePoint = {
  id: number;
  point: string;
};

export type Audience = {
  id: number;
  title: string;
  points: string[]; // stored as JSON array in Directus
  icon: string | null;
};

export type Testimonial = {
  id: number;
  quote: string;
  author: string;
};

export type Faq = {
  question: string;
  answer: string;
};

export type ProductFeature = {
  id: number;
  name: string;
  description: string;
  capacities: string[];
  buttonLabel: string;
  buttonHref: string;
  image: string | null;
};

export type UseCase = {
  id: number;
  title: string;
  description: string;
  icon: string | null;
};

export type PricingBenefit = {
  label: string;
  included: boolean;
};

export type PricingPlan = {
  id: number;
  name: string;
  price: string;
  currency: string;
  period: string;
  buttonLabel: string;
  buttonHref: string;
  buttonVariant: "solid" | "bordered";
  benefits: PricingBenefit[]; // stored as JSON array in Directus
};

export type CustomPlanInclude = {
  id: number;
  item: string;
};

export type PaymentMethod = {
  id: number;
  method: string;
  icon: string | null;
};

export type TeamMember = {
  id: number;
  name: string;
  role: string;
  photo: string | null;
};

export type Partner = {
  id: number;
  name: string;
};

export type AboutStat = {
  id: number;
  value: string;
  description: string;
  icon: string | null;
};

export type SocialLink = {
  id: number;
  label: string;
  href: string;
  type: string;
};

export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string | null; // UUID of directus_files; null until uploaded
  author: string;
  published_at: string;
  tags: string[];
};

export type BlogBanner = {
  id: number;
  title: string;
  subtitle: string;
  image: string | null; // UUID of directus_files
  link_label: string;
  link_href: string;
  sort: number;
  status: string;
};

export type SiteAsset = {
  id: number;
  key: string;
  image: string | null; // UUID of directus_files
  alt: string;
};

// ---------------------------------------------------------------------------
// Directus schema — maps collection names to their types
// ---------------------------------------------------------------------------

export type DirectusSchema = {
  problems: Problem[];
  features: Feature[];
  steps: Step[];
  audiences: Audience[];
  testimonials: Testimonial[];
  faqs: Faq[];
  product_features: ProductFeature[];
  use_cases: UseCase[];
  pricing_plans: PricingPlan[];
  custom_plan_includes: CustomPlanInclude[];
  payment_methods: PaymentMethod[];
  team_members: TeamMember[];
  partners: Partner[];
  about_stats: AboutStat[];
  social_links: SocialLink[];
  blog_posts: BlogPost[];
  blog_banners: BlogBanner[];
  site_assets: SiteAsset[];
};
