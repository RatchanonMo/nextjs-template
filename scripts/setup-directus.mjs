// Run with: node scripts/setup-directus.mjs
// Make sure Directus is running: docker compose up -d

import {
  createDirectus,
  rest,
  staticToken,
  createCollection,
  createRelation,
  createItems,
  readItems,
  readCollections,
} from "@directus/sdk";

const DIRECTUS_URL = process.env.DIRECTUS_URL ?? "http://localhost:8055";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@example.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "change-me-password";

async function getAdminToken() {
  const res = await fetch(`${DIRECTUS_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.errors?.[0]?.message ?? JSON.stringify(json));
  return json.data.access_token;
}

let client; // initialized after login in main()

// ---------------------------------------------------------------------------
// Collection definitions
// ---------------------------------------------------------------------------

const COLLECTIONS = [
  {
    name: "problems",
    fields: [{ field: "label", type: "string" }],
    seed: [
      { label: "Hard to find real decision-makers" },
      { label: "Too much time spent researching contacts" },
      { label: "Scattered information across tools" },
      { label: "Low response rate from cold outreach" },
    ],
  },
  {
    name: "features",
    fields: [
      { field: "title", type: "string" },
      { field: "description", type: "text" },
      { field: "bg", type: "string" },
      { field: "text", type: "string" },
      { field: "subText", type: "string" },
    ],
    seed: [
      {
        title: "AI Contact Discovery",
        description: "Find relevant decision-makers based on your target industry and company profile automatically.",
        bg: "bg-[#1a1b2e]",
        text: "text-white",
        subText: "text-gray-300",
      },
      {
        title: "AI Sales Assistant",
        description: "An AI assistant that helps sales teams decide who to contact and how to approach with less guesswork.",
        bg: "bg-primary",
        text: "text-white",
        subText: "text-primary-100",
      },
      {
        title: "Sales & Business Insights",
        description: "Get context before outreach including company background, role relevance and sales signals.",
        bg: "bg-primary-200",
        text: "text-gray-900",
        subText: "text-gray-700",
      },
    ],
  },
  {
    name: "steps",
    fields: [
      { field: "step", type: "string" },
      { field: "title", type: "string" },
      { field: "description", type: "text" },
    ],
    seed: [
      {
        step: "Step 1",
        title: "Define Your Ideal Customer Profile",
        description: "Tell SalePoint AI who you want to sell to. Industry, company size, role, and target market. We focus only on people who matter to your sales goal.",
      },
      {
        step: "Step 2",
        title: "AI Contact Discovery",
        description: "SalePoint AI transforms Google business data into actionable insights by evaluating relevance, context, and market signals to help you focus on the right opportunities faster.",
      },
      {
        step: "Step 3",
        title: "Ready-to-Use Contact List",
        description: "Export or use structured business lists that support sales and business development workflows. Clear, organized, and ready to use.",
      },
    ],
  },
  {
    name: "audiences",
    fields: [
      { field: "title", type: "string" },
      { field: "points", type: "json" },
    ],
    seed: [
      {
        title: "Sales Representatives",
        points: ["Find real decision-makers without endless research", "Get contact insights before outreach", "Spend more time selling, less time searching"],
      },
      {
        title: "Sales Managers",
        points: ["Understand who your team should focus on", "Improve outreach quality and response rates", "Make better pipeline decisions with data and AI insights"],
      },
      {
        title: "Business Development",
        points: ["Discover new target accounts and opportunities", "Identify key stakeholders in complex organizations", "Validate leads before investing time and effort"],
      },
      {
        title: "Growth & Marketing Teams",
        points: ["Support sales with higher-quality leads", "Align targeting between marketing and sales", "Turn campaigns into real conversations"],
      },
      {
        title: "Founders & Operators",
        points: ["Get visibility into who really matters in your target market", "Reduce dependency on manual research and guesswork", "Build a scalable outbound motion early"],
      },
    ],
  },
  {
    name: "testimonials",
    fields: [
      { field: "quote", type: "text" },
      { field: "author", type: "string" },
    ],
    seed: [
      {
        quote: "\u201CSalepoint AI really helps our team especially when prospecting in Thailand \uD83C\uDDF9\uD83C\uDDED. Other platforms rarely include local business data, focusing mostly on big corporates and enterprises.\u201D",
        author: "KhaveeAI BD",
      },
      {
        quote: "\u201COur target businesses rarely share contact info or maintain LinkedIn profiles, which makes outreach tough. With Salepoint AI, I can find and reach them in seconds \u2014 it\u2019s become an essential tool for our prospecting workflow.\u201D",
        author: "Academix Sales",
      },
    ],
  },
  {
    name: "faqs",
    fields: [
      { field: "question", type: "string" },
      { field: "answer", type: "text" },
    ],
    seed: [
      { question: "What is SalePoint AI?", answer: "SalePoint AI is an AI-powered sales intelligence platform that helps teams discover real decision-makers, gain contact insights, and sell more effectively using data-driven prospecting." },
      { question: "Where does SalePoint AI get its data from?", answer: "SalePoint AI aggregates data from multiple public and proprietary sources including Google Business data, public directories, and other business intelligence sources to provide accurate and up-to-date information." },
      { question: "Does SalePoint AI provide contact details or decision maker information?", answer: "Yes. SalePoint AI surfaces relevant decision-maker profiles, roles, and contact insights to help your team reach the right people faster without manual research." },
      { question: "Who is SalePoint AI for?", answer: "SalePoint AI is built for sales representatives, sales managers, business development teams, growth and marketing teams, and founders who need to identify and reach the right prospects efficiently." },
      { question: "How can sales teams use SalePoint AI?", answer: "Sales teams can use SalePoint AI to define their ideal customer profile, discover matching decision-makers, enrich contact lists with insights, and prioritize outreach based on relevance signals." },
      { question: "Can I export data from SalePoint AI?", answer: "Yes. SalePoint AI allows you to export structured contact and business lists that are ready to plug into your CRM or sales workflows." },
      { question: "Is SalePoint AI suitable for enterprise or SMB teams?", answer: "SalePoint AI is designed to scale for both SMB and enterprise teams. Whether you're a solo founder or managing a large sales org, the platform adapts to your prospecting needs." },
      { question: "How is SalePoint AI different from traditional lead generation tools?", answer: "SalePoint AI is an AI powered platform that analyzes Google business data to help teams identify, prioritize, and understand local business opportunities. It provides structured insights that support sales, business development, and market research workflows." },
    ],
  },
  {
    name: "product_features",
    fields: [
      { field: "name", type: "string" },
      { field: "description", type: "text" },
      { field: "capacities", type: "json" },
      { field: "buttonLabel", type: "string" },
      { field: "buttonHref", type: "string" },
    ],
    seed: [
      {
        name: "Feature's Name",
        description: "feature description",
        capacities: ["feature capacities", "feature capacities", "feature capacities", "feature capacities"],
        buttonLabel: "Button",
        buttonHref: "#",
      },
      {
        name: "Feature's Name",
        description: "feature description",
        capacities: ["feature capacities", "feature capacities", "feature capacities", "feature capacities"],
        buttonLabel: "Button",
        buttonHref: "#",
      },
    ],
  },
  {
    name: "use_cases",
    fields: [
      { field: "title", type: "string" },
      { field: "description", type: "text" },
    ],
    seed: [
      { title: "Define Your Ideal Customer Profile", description: "Tell SalePoint AI who you want to sell to. Industry, company size, role, and target market. We focus only on people who matter to your sales goal." },
      { title: "Define Your Ideal Customer Profile", description: "Tell SalePoint AI who you want to sell to. Industry, company size, role, and target market. We focus only on people who matter to your sales goal." },
      { title: "Define Your Ideal Customer Profile", description: "Tell SalePoint AI who you want to sell to. Industry, company size, role, and target market. We focus only on people who matter to your sales goal." },
    ],
  },
  {
    name: "pricing_plans",
    fields: [
      { field: "name", type: "string" },
      { field: "price", type: "string" },
      { field: "currency", type: "string" },
      { field: "period", type: "string" },
      { field: "buttonLabel", type: "string" },
      { field: "buttonHref", type: "string" },
      { field: "buttonVariant", type: "string" },
      { field: "benefits", type: "json" },
    ],
    seed: [
      {
        name: "Free", price: "0", currency: "฿", period: "/month",
        buttonLabel: "Sign Up Now", buttonHref: "#", buttonVariant: "bordered",
        benefits: [
          { label: "Benefit", included: true }, { label: "Benefit", included: true },
          { label: "Benefit", included: true }, { label: "Benefit", included: false },
          { label: "Benefit", included: false }, { label: "Benefit", included: false },
          { label: "Benefit", included: false }, { label: "Benefit", included: false },
          { label: "Benefit", included: false }, { label: "Benefit", included: false },
        ],
      },
      {
        name: "Starter", price: "799", currency: "฿", period: "/month",
        buttonLabel: "Subscribe Now", buttonHref: "#", buttonVariant: "solid",
        benefits: [
          { label: "Benefit", included: true }, { label: "Benefit", included: true },
          { label: "Benefit", included: true }, { label: "Benefit", included: true },
          { label: "Benefit", included: true }, { label: "Benefit", included: true },
          { label: "Benefit", included: false }, { label: "Benefit", included: false },
          { label: "Benefit", included: false }, { label: "Benefit", included: false },
        ],
      },
      {
        name: "Professional", price: "3,999", currency: "฿", period: "/month",
        buttonLabel: "Subscribe Now", buttonHref: "#", buttonVariant: "solid",
        benefits: [
          { label: "Benefit", included: true }, { label: "Benefit", included: true },
          { label: "Benefit", included: true }, { label: "Benefit", included: true },
          { label: "Benefit", included: true }, { label: "Benefit", included: true },
          { label: "Benefit", included: true }, { label: "Benefit", included: true },
          { label: "Benefit", included: true }, { label: "Benefit", included: true },
        ],
      },
    ],
  },
  {
    name: "custom_plan_includes",
    fields: [{ field: "item", type: "string" }],
    seed: [
      { item: "Higher or unlimited usage" },
      { item: "Multi-market data coverage" },
      { item: "Custom integrations" },
      { item: "Dedicated onboarding and support" },
    ],
  },
  {
    name: "payment_methods",
    fields: [{ field: "method", type: "string" }],
    seed: [
      { method: "Credit and debit cards" },
      { method: "Bank or wire transfer (for eligible plans)" },
      { method: "Invoicing available for business accounts" },
      { method: "Support for multiple currencies" },
    ],
  },
  {
    name: "team_members",
    fields: [
      { field: "name", type: "string" },
      { field: "role", type: "string" },
    ],
    seed: [
      { name: "Lorem Ipsum", role: "Chief Executive Officer" },
      { name: "Lorem Ipsum", role: "Chief Technology Officer" },
      { name: "Lorem Ipsum", role: "Chief Operating Officer" },
      { name: "Lorem Ipsum", role: "Chief Marketing Officer" },
    ],
  },
  {
    name: "partners",
    fields: [{ field: "name", type: "string" }],
    seed: Array.from({ length: 8 }, (_, i) => ({ name: `Partner ${i + 1}` })),
  },
  {
    name: "about_stats",
    fields: [
      { field: "value", type: "string" },
      { field: "description", type: "string" },
    ],
    seed: [
      { value: "Placeholder", description: "Lorem ipsum dolor sit amet" },
      { value: "Placeholder", description: "Lorem ipsum dolor sit amet" },
    ],
  },
  {
    name: "social_links",
    fields: [
      { field: "label", type: "string" },
      { field: "href", type: "string" },
      { field: "type", type: "string" },
    ],
    seed: [
      { label: "Facebook", href: "#", type: "facebook" },
      { label: "LinkedIn", href: "#", type: "linkedin" },
      { label: "Instagram", href: "#", type: "instagram" },
      { label: "TikTok", href: "#", type: "tiktok" },
    ],
  },
  {
    name: "blog_posts",
    fields: [
      { field: "slug", type: "string" },
      { field: "title", type: "string" },
      { field: "excerpt", type: "text" },
      { field: "content", type: "text" },
      {
        field: "cover_image",
        type: "uuid",
        meta: { display: "image", special: ["file"] },
        schema: { is_nullable: true },
      },
      { field: "author", type: "string" },
      { field: "published_at", type: "string" },
      { field: "tags", type: "json" },
    ],
    relations: [
      {
        field: "cover_image",
        related_collection: "directus_files",
      },
    ],
    seed: [
      {
        slug: "5-signs-your-sales-team-is-wasting-time-on-bad-leads",
        title: "5 Signs Your Sales Team Is Wasting Time on Bad Leads",
        excerpt: "Most people start prospecting within 10 minutes of opening their CRM — and it's sabotaging their entire pipeline.",
        content: "Your sales team is working hard. They're making calls, sending emails, and logging activity every day. But at the end of the quarter, the pipeline still looks thin. Sound familiar?\n\nThe problem isn't effort — it's targeting. Here are five signs your team is wasting valuable time on leads that were never going to convert.\n\n**1. You're calling the same cold lists everyone else is using**\n\nIf your lead data comes from a shared database that every competitor also subscribes to, your prospects are already fatigued before you even reach out.\n\n**2. Your reps spend more than 30% of their day on research**\n\nIf your team is piecing together contact info from LinkedIn, Google, and company websites before every outreach, that's a clear signal that your prospecting process needs automation.\n\n**3. Response rates are below 2%**\n\nIndustry average cold email response rates hover around 1–5%. If you're consistently at the bottom of that range, the issue is likely list quality — not your messaging.\n\n**4. You can't define your ICP in one sentence**\n\nIf your ICP is anyone who could use your product, you're targeting everyone and reaching no one.\n\n**5. Most deals come from referrals — not outbound**\n\nOver-reliance on inbound signals tells you your prospecting process isn't generating enough quality first conversations.\n\n**What to do about it**\n\nStart by auditing your last 100 leads against your ICP criteria. How many actually match? Tools like SalePoint AI are built to solve exactly this problem.",
        author: "SalePoint AI Team",
        published_at: "2026-01-15T00:00:00.000Z",
        tags: ["sales", "prospecting", "lead-generation"],
      },
      {
        slug: "how-ai-is-changing-b2b-prospecting-in-southeast-asia",
        title: "How AI Is Changing B2B Prospecting in Southeast Asia",
        excerpt: "Traditional lead tools were built for Western markets. Here's why that matters — and what AI-native platforms are doing differently.",
        content: "B2B sales intelligence has historically been dominated by platforms built for the US and European markets. Salesforce, HubSpot, ZoomInfo — powerful tools, but their data coverage thins out significantly once you move into Southeast Asia.\n\nFor sales teams operating in Thailand, Vietnam, Indonesia, and surrounding markets, this gap has always meant one thing: manual research.\n\n**The SEA data gap**\n\nThe fundamental challenge is that most local businesses in SEA don't maintain active LinkedIn profiles and rarely appear in Western business directories.\n\n**What AI changes**\n\nAI-native platforms can process signals from local sources that traditional tools ignore: Google Business profiles, local web presence, industry registrations, and contextual signals about company size and activity.\n\n**The SalePoint AI approach**\n\nSalePoint AI is built ground-up for markets like Thailand. Instead of indexing the same global databases everyone else uses, we analyze local business data to surface actionable prospects.\n\nIf you're selling in SEA, this is the difference between a full pipeline and an empty one.",
        author: "SalePoint AI Team",
        published_at: "2025-10-20T00:00:00.000Z",
        tags: ["ai", "b2b", "southeast-asia"],
      },
      {
        slug: "build-your-outbound-engine-from-scratch",
        title: "Build Your Outbound Engine From Scratch",
        excerpt: "You don't need a 20-person sales team to run effective outbound. Here's the minimal setup that actually works.",
        content: "Most early-stage companies treat outbound like an afterthought — something you bolt on after product-market fit. That's a mistake.\n\nBuilding your outbound engine early, even imperfectly, teaches you who actually buys your product and why.\n\n**Step 1: Lock down your ICP**\n\nBefore you generate a single lead, you need a crisp Ideal Customer Profile. The specificity feels limiting. It isn't. It's what allows everything else to work.\n\n**Step 2: Build a targeted list — don't rent a generic one**\n\nA list of 200 well-matched prospects will outperform a list of 2,000 generic ones every time.\n\n**Step 3: Write one email worth reading**\n\nYour first outreach email needs to do one thing: earn the right to a conversation. Not sell. Not demo. Just create enough curiosity that the right person replies.\n\n**Step 4: Follow up with purpose**\n\nBuild a 3–5 touch sequence where each message adds new information or perspective. Not just checking in — those get deleted.\n\n**Step 5: Measure and iterate**\n\nTrack open rates, reply rates, and conversion to meeting. Fix one variable at a time. Outbound isn't magic — it's a system.",
        author: "SalePoint AI Team",
        published_at: "2025-11-26T00:00:00.000Z",
        tags: ["outbound", "sales", "startup"],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function getExistingCollections() {
  const result = await client.request(readCollections());
  return new Set(result.map((c) => c.collection));
}

async function collectionHasItems(name) {
  try {
    const result = await client.request(readItems(name, { limit: 1 }));
    return result.length > 0;
  } catch {
    return false;
  }
}

async function setupCollection(existing, { name, fields, seed, relations }) {
  // 1. Create collection if it doesn't exist
  if (existing.has(name)) {
    process.stdout.write(`  ⏭  ${name} — already exists`);
  } else {
    await client.request(
      createCollection({
        collection: name,
        meta: { icon: "box" },
        schema: {},
        fields: fields.map((f) => ({
          field: f.field,
          type: f.type,
          meta: f.meta ?? { interface: f.type === "json" ? "input-code" : "input" },
          schema: f.schema ?? {},
        })),
      })
    );
    // Create any M2O relations (e.g. file fields)
    if (relations?.length) {
      for (const rel of relations) {
        await client.request(
          createRelation({
            collection: name,
            field: rel.field,
            related_collection: rel.related_collection,
          })
        );
      }
    }
    process.stdout.write(`  ✅  ${name} created`);
  }

  // 2. Seed items if collection is empty
  if (seed?.length) {
    const hasItems = await collectionHasItems(name);
    if (hasItems) {
      console.log(` — items already exist, skipping seed`);
    } else {
      await client.request(createItems(name, seed));
      console.log(` — seeded ${seed.length} item(s)`);
    }
  } else {
    console.log("");
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

(async () => {
  console.log(`\nConnecting to Directus at ${DIRECTUS_URL}…`);

  let token;
  try {
    token = await getAdminToken();
  } catch (e) {
    console.error("❌ Login failed:", e.message);
    console.error("   Make sure Directus is running: docker compose up -d");
    process.exit(1);
  }

  client = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(token));
  console.log("✅ Authenticated\n");
  console.log("Setting up collections and seeding data…\n");

  const existing = await getExistingCollections();

  for (const col of COLLECTIONS) {
    await setupCollection(existing, col);
  }

  console.log("\n✅ All done!");
  console.log(
    "\nNext → Settings → Access Policies → Public → enable Read for every collection.\n"
  );
})();

