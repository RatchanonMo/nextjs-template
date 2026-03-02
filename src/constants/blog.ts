import type { BlogBanner, BlogPost } from "@/types/directus";

export const BLOG_BANNERS: BlogBanner[] = [
  {
    id: 1,
    title: "Insights on Sales & AI",
    subtitle:
      "Tips, guides, and strategies for modern B2B sales teams in Southeast Asia.",
    image: null,
    link_label: "Browse articles",
    link_href: "#posts",
    sort: 1,
    status: "published",
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    slug: "5-signs-your-sales-team-is-wasting-time-on-bad-leads",
    title: "5 Signs Your Sales Team Is Wasting Time on Bad Leads",
    excerpt:
      "Most people start prospecting within 10 minutes of opening their CRM — and it's sabotaging their entire pipeline.",
    content: `<p>Your sales team is working hard. They're making calls, sending emails, and logging activity every day. But at the end of the quarter, the pipeline still looks thin. Sound familiar?</p>
<p>The problem isn't effort — it's targeting. Here are five signs your team is wasting valuable time on leads that were never going to convert.</p>
<h3>1. You're calling the same cold lists everyone else is using</h3>
<p>If your lead data comes from a shared database that every competitor also subscribes to, your prospects are already fatigued before you even reach out. Generic outreach to stale contacts produces generic (or zero) results.</p>
<h3>2. Your reps spend more than 30% of their day on research</h3>
<p>Research is necessary, but it shouldn't dominate selling time. If your team is piecing together contact info from LinkedIn, Google, and company websites before every outreach, that's a clear signal that your prospecting process needs automation.</p>
<h3>3. Response rates are below 2%</h3>
<p>Industry average cold email response rates hover around 1–5%. If you're consistently at the bottom of that range, the issue is likely list quality — not your messaging. The wrong people are receiving your outreach.</p>
<h3>4. You can't define your Ideal Customer Profile in one sentence</h3>
<p>If your ICP is "anyone who could use our product," you're targeting everyone and reaching no one. A sharp ICP is the foundation of every effective sales motion.</p>
<h3>5. Most deals come from referrals — not outbound</h3>
<p>Referrals are wonderful, but if they're your only source of new pipeline, your outbound engine is broken. Over-reliance on inbound signals tells you your prospecting process isn't generating enough quality first conversations.</p>
<h3>What to do about it</h3>
<p>Start by auditing your last 100 leads against your ICP criteria. How many actually match? Then look at where your last 10 closed deals came from — what did those prospects have in common?</p>
<p>Tools like SalePoint AI are built to solve exactly this problem: surfacing the right people, in the right companies, so your team can spend more time selling and less time searching.</p>`,
    cover_image: null,
    author: "SalePoint AI Team",
    published_at: "2026-01-15T00:00:00.000Z",
    tags: ["sales", "prospecting", "lead-generation"],
  },
  {
    id: 2,
    slug: "how-ai-is-changing-b2b-prospecting-in-southeast-asia",
    title: "How AI Is Changing B2B Prospecting in Southeast Asia",
    excerpt:
      "Traditional lead tools were built for Western markets. Here's why that matters — and what AI-native platforms are doing differently.",
    content: `<p>B2B sales intelligence has historically been dominated by platforms built for the US and European markets. Salesforce, HubSpot, ZoomInfo — powerful tools, but their data coverage thins out significantly once you move into Southeast Asia.</p>
<p>For sales teams operating in Thailand, Vietnam, Indonesia, and surrounding markets, this gap has always meant one thing: manual research.</p>
<h3>The SEA data gap</h3>
<p>The fundamental challenge is that most local businesses in SEA don't maintain active LinkedIn profiles, don't appear in Western business directories, and rarely publish detailed company information in English-language sources.</p>
<p>This isn't a niche problem. It means that the majority of prospectible businesses in these markets are effectively invisible to conventional sales intelligence tools — unless you're doing the research yourself.</p>
<h3>What AI changes</h3>
<p>AI-native platforms can process signals from local sources that traditional tools ignore: Google Business profiles, local web presence, industry registrations, and contextual signals about company size and activity.</p>
<p>The result is a layer of intelligence that surfaces real, locally-operating businesses that your competitors aren't targeting — because they can't find them.</p>
<h3>The SalePoint AI approach</h3>
<p>SalePoint AI is built ground-up for markets like Thailand. Instead of indexing the same global databases everyone else uses, we analyze local business data to surface actionable prospects with the context your team needs to start a relevant conversation.</p>
<p>If you're selling in SEA, this is the difference between a full pipeline and an empty one.</p>`,
    cover_image: null,
    author: "SalePoint AI Team",
    published_at: "2025-10-20T00:00:00.000Z",
    tags: ["ai", "b2b", "southeast-asia", "prospecting"],
  },
  {
    id: 3,
    slug: "build-your-outbound-engine-from-scratch",
    title: "Build Your Outbound Engine From Scratch",
    excerpt:
      "You don't need a 20-person sales team to run effective outbound. Here's the minimal setup that actually works.",
    content: `<p>Most early-stage companies treat outbound like an afterthought — something you bolt on after product-market fit. That's a mistake.</p>
<p>Building your outbound engine early, even imperfectly, teaches you who actually buys your product and why. Here's a minimal stack that works.</p>
<h3>Step 1: Lock down your ICP</h3>
<p>Before you generate a single lead, you need a crisp Ideal Customer Profile. Not "SMBs in Southeast Asia" — something like "5–50 person technology distributors in Thailand who sell to enterprise clients and have been operating for at least 3 years."</p>
<p>The specificity feels limiting. It isn't. It's what allows everything else to work.</p>
<h3>Step 2: Build a targeted list — don't rent a generic one</h3>
<p>Rented lists are for broadcast. Targeted lists are for conversations. Use tools like SalePoint AI to build a list of companies that actually match your ICP — with enough context to personalize your first message.</p>
<p>A list of 200 well-matched prospects will outperform a list of 2,000 generic ones every time.</p>
<h3>Step 3: Write one email worth reading</h3>
<p>Your first outreach email needs to do one thing: earn the right to a conversation. Not sell. Not demo. Just create enough curiosity that the right person replies.</p>
<p>Start with their context ("I noticed you're expanding into enterprise retail…"), add a specific problem you solve, and ask a low-friction question. That's it.</p>
<h3>Step 4: Follow up with purpose</h3>
<p>Most deals don't close on the first email. Build a 3–5 touch sequence where each message adds new information or perspective. Not "just checking in" — those get deleted.</p>
<h3>Step 5: Measure and iterate</h3>
<p>Track open rates, reply rates, and conversion to meeting. If reply rates are below 3%, the list is wrong. If below 1%, the message is wrong. Fix one variable at a time.</p>
<p>Outbound isn't magic — it's a system. Build the system, then optimize it.</p>`,
    cover_image: null,
    author: "SalePoint AI Team",
    published_at: "2025-11-26T00:00:00.000Z",
    tags: ["outbound", "sales", "startup", "growth"],
  },
];
