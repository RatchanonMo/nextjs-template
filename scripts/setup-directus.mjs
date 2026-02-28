// Run with: node scripts/setup-directus.mjs
// Make sure Directus is running: docker compose up -d

import {
  createDirectus,
  rest,
  staticToken,
  createCollection,
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

async function setupCollection(existing, { name, fields, seed }) {
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
          meta: { interface: f.type === "json" ? "input-code" : "input" },
          schema: {},
        })),
      })
    );
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

