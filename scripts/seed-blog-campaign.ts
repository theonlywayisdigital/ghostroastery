/**
 * Seed Script — Blog Campaign Articles
 *
 * Seeds 18 SEO-optimised blog articles for two campaigns:
 *   - Brand Builder (10 articles) → drives to /build
 *   - Wholesale (8 articles) → drives to /wholesale
 *
 * Safe to re-run: uses createOrReplace with deterministic _id values.
 *
 * Usage:
 *   npx tsx scripts/seed-blog-campaign.ts
 *
 * Requires SANITY_API_TOKEN in .env.local (with write access).
 */

import { createClient } from "@sanity/client";
import { config } from "dotenv";

config({ path: ".env.local" });

const client = createClient({
  projectId: "z97yvgto",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// ── Portable Text Helpers ───────────────────────────────────────

let keyCounter = 0;
function k() {
  return `k${keyCounter++}`;
}
function resetKeys() {
  keyCounter = 0;
}

interface PTBlock {
  _type: "block";
  _key: string;
  style: string;
  children: Array<{
    _type: "span";
    _key: string;
    text: string;
    marks: string[];
  }>;
  markDefs: Array<{ _key: string; _type: string; href: string }>;
}

function p(text: string): PTBlock {
  return {
    _type: "block",
    _key: k(),
    style: "normal",
    children: [{ _type: "span", _key: k(), text, marks: [] }],
    markDefs: [],
  };
}

function h2(text: string): PTBlock {
  return {
    _type: "block",
    _key: k(),
    style: "h2",
    children: [{ _type: "span", _key: k(), text, marks: [] }],
    markDefs: [],
  };
}

function h3(text: string): PTBlock {
  return {
    _type: "block",
    _key: k(),
    style: "h3",
    children: [{ _type: "span", _key: k(), text, marks: [] }],
    markDefs: [],
  };
}

type Segment = { text: string; bold?: boolean; link?: string };

function rich(parts: Segment[]): PTBlock {
  const markDefs: Array<{ _key: string; _type: string; href: string }> = [];
  const children = parts.map((seg) => {
    const marks: string[] = [];
    if (seg.bold) marks.push("strong");
    if (seg.link) {
      const lk = k();
      markDefs.push({ _key: lk, _type: "link", href: seg.link });
      marks.push(lk);
    }
    return { _type: "span" as const, _key: k(), text: seg.text, marks };
  });
  return {
    _type: "block",
    _key: k(),
    style: "normal",
    children,
    markDefs,
  };
}

// ── Publish Dates (3/week, newest first) ────────────────────────

const publishDates = [
  "2026-03-06T09:00:00Z",
  "2026-03-04T09:00:00Z",
  "2026-03-02T09:00:00Z",
  "2026-02-27T09:00:00Z",
  "2026-02-25T09:00:00Z",
  "2026-02-23T09:00:00Z",
  "2026-02-20T09:00:00Z",
  "2026-02-18T09:00:00Z",
  "2026-02-16T09:00:00Z",
  "2026-02-13T09:00:00Z",
  "2026-02-11T09:00:00Z",
  "2026-02-09T09:00:00Z",
  "2026-02-06T09:00:00Z",
  "2026-02-04T09:00:00Z",
  "2026-02-02T09:00:00Z",
  "2026-01-30T09:00:00Z",
  "2026-01-28T09:00:00Z",
  "2026-01-26T09:00:00Z",
];

// ── Article Body Generators ─────────────────────────────────────

function body1_whatIsWhiteLabel(): PTBlock[] {
  resetKeys();
  return [
    p("If you have ever dreamed of launching your own coffee brand but felt put off by the cost of roasting equipment, premises, and supply chains, white label coffee could be the shortcut you have been looking for. In this guide we break down exactly what white label coffee is, how it works, and why it has become the fastest route to market for new coffee entrepreneurs in the UK."),

    h2("What does white label coffee actually mean?"),
    rich([
      { text: "White label coffee is " },
      { text: "specialty-grade coffee roasted by a third-party roastery and sold under your own brand name", bold: true },
      { text: ". The roastery handles sourcing green beans, roasting, packing, and often fulfilment — while you focus on branding, marketing, and sales. Your customers see your logo, your design, and your story. The roastery stays invisible." },
    ]),
    p("Think of it as hiring an expert kitchen to cook your recipe. The end product is yours; the production is theirs."),

    h2("How does white label coffee work in the UK?"),
    p("The process is simpler than most people expect. Here is a typical white label coffee workflow:"),
    rich([
      { text: "1. " },
      { text: "Choose your coffee", bold: true },
      { text: " — select a roast profile (light, medium, dark) and a single origin or blend from the roastery's menu." },
    ]),
    rich([
      { text: "2. " },
      { text: "Design your packaging", bold: true },
      { text: " — upload your label or use a tool like our " },
      { text: "online brand builder", link: "/build" },
      { text: " to design bags in minutes." },
    ]),
    rich([
      { text: "3. " },
      { text: "Place your order", bold: true },
      { text: " — most white label roasters offer minimum orders as low as 10 – 24 bags." },
    ]),
    rich([
      { text: "4. " },
      { text: "Receive and sell", bold: true },
      { text: " — the roastery packs your coffee with your label and ships it to you (or directly to your customers)." },
    ]),
    rich([
      { text: "To see the full process in action, take a look at our " },
      { text: "how it works page", link: "/how-it-works" },
      { text: "." },
    ]),

    h2("White label coffee vs private label coffee"),
    rich([
      { text: "These terms are often confused. " },
      { text: "White label means you choose from existing roast profiles", bold: true },
      { text: " that the roastery already offers. " },
      { text: "Private label means a completely bespoke recipe", bold: true },
      { text: " developed just for you. Most new brands start with white label because it is faster, cheaper, and the coffee quality is already proven. Read our in-depth comparison in " },
      { text: "Private Label vs White Label Coffee", link: "/blog/private-label-vs-white-label-coffee" },
      { text: "." },
    ]),

    h2("Who is white label coffee for?"),
    h3("Coffee entrepreneurs and side-hustlers"),
    p("You do not need barista training or food-industry experience. If you can build an audience — on social media, at markets, or through an online store — you can sell white label coffee."),
    h3("Existing businesses adding a coffee line"),
    p("Gyms, hotels, restaurants, and co-working spaces increasingly offer house-branded coffee. White labelling lets them do it without any roasting infrastructure."),
    h3("Established brands diversifying"),
    p("Gift companies, subscription boxes, and lifestyle brands use white label coffee as a high-margin product extension."),

    h2("Benefits of white label coffee"),
    rich([
      { text: "No capital expenditure", bold: true },
      { text: " — skip the roaster, grinder, and packaging machinery." },
    ]),
    rich([
      { text: "Speed to market", bold: true },
      { text: " — go from idea to finished product in days, not months." },
    ]),
    rich([
      { text: "Consistent quality", bold: true },
      { text: " — professional roasters maintain flavour consistency batch after batch." },
    ]),
    rich([
      { text: "Low minimum orders", bold: true },
      { text: " — test the market without committing to thousands of units." },
    ]),
    rich([
      { text: "Scalability", bold: true },
      { text: " — as demand grows, your roastery scales production with you." },
    ]),

    h2("How to choose a white label coffee partner"),
    rich([
      { text: "Look for " },
      { text: "specialty-grade beans (scoring 80+)", bold: true },
      { text: ", transparent sourcing, flexible MOQs, and a simple ordering process. A good partner should also offer " },
      { text: "packaging design support", bold: true },
      { text: " and fast UK shipping. If you are exploring your options, our guide to " },
      { text: "choosing the right roast profile", link: "/blog/choosing-roast-profile-for-your-brand" },
      { text: " is a great next step." },
    ]),

    h2("Ready to get started?"),
    rich([
      { text: "White label coffee removes the biggest barriers to launching a coffee brand. If you are ready to see how it works in practice, " },
      { text: "try our brand builder", link: "/build" },
      { text: " — pick your bag, design your label, and place your first order in under ten minutes." },
    ]),
  ];
}

function body2_howToStartBrand(): PTBlock[] {
  resetKeys();
  return [
    p("Starting a coffee brand in the UK has never been more accessible. With the rise of white label and ghost roasting services, you no longer need a roastery, a food-safety certification, or tens of thousands in startup capital. This guide walks you through every step — from concept to first sale."),

    h2("Is now a good time to start a coffee brand?"),
    rich([
      { text: "The UK specialty coffee market is worth over £4 billion and growing at roughly 6% year on year. " },
      { text: "Direct-to-consumer coffee subscriptions have exploded", bold: true },
      { text: ", and consumers increasingly seek out independent brands over supermarket generics. If you have been thinking about it, the window is wide open." },
    ]),

    h2("Step 1: Define your niche and audience"),
    p("The biggest mistake new founders make is trying to appeal to everyone. The most successful coffee brands have a clear identity: fitness coffee, office coffee, ethically-sourced single origins, or bold espresso blends for home baristas."),
    rich([
      { text: "Need inspiration? Read " },
      { text: "10 Profitable Niches for a Coffee Brand", link: "/blog/profitable-coffee-brand-niches" },
      { text: " for ideas backed by real market demand." },
    ]),

    h2("Step 2: Choose your coffee and roast profile"),
    rich([
      { text: "You do not need to roast your own beans. " },
      { text: "Ghost roasting", bold: true },
      { text: " means a professional roastery produces coffee to your specification under your brand. Pick a roast profile that matches your target audience — light roasts for specialty enthusiasts, medium for broad appeal, dark for espresso lovers. Learn more in " },
      { text: "Ghost Roasting Explained", link: "/blog/ghost-roasting-explained" },
      { text: "." },
    ]),

    h2("Step 3: Design your packaging"),
    h3("Bag type and size"),
    p("Most UK brands start with 250g retail bags. Stand-up pouches with a resealable zip are the industry standard — they look premium and keep coffee fresh."),
    h3("Label design"),
    rich([
      { text: "Your label is your billboard. It should communicate your brand story at a glance. If you do not have a designer, tools like Ghost Roastery's " },
      { text: "brand builder", link: "/build" },
      { text: " let you design professional labels online in minutes. For deeper guidance see our " },
      { text: "coffee packaging design guide", link: "/blog/coffee-packaging-design-guide" },
      { text: "." },
    ]),

    h2("Step 4: Set up your sales channels"),
    h3("Online store"),
    p("Shopify, WooCommerce, or even Etsy are popular choices for first-time coffee sellers. List your products with strong photography and clear tasting notes."),
    h3("Markets and events"),
    p("Local markets are excellent for brand awareness and direct feedback. A simple banner, a grinder, and sample cups can drive impressive first-month sales."),
    h3("Wholesale"),
    rich([
      { text: "Offices, cafés, and gyms are always looking for quality suppliers. Once you have retail traction, " },
      { text: "wholesale enquiries", link: "/wholesale" },
      { text: " can become a reliable revenue stream." },
    ]),

    h2("Step 5: Launch and iterate"),
    rich([
      { text: "Do not wait for perfection. " },
      { text: "Launch with a small batch, gather feedback, and refine", bold: true },
      { text: ". Most successful brands started with a single SKU and expanded from there." },
    ]),

    h2("How much does it cost?"),
    rich([
      { text: "A white label coffee brand can be started for " },
      { text: "as little as a few hundred pounds", bold: true },
      { text: " — covering your first order, basic branding, and a simple website. For a full cost breakdown, read " },
      { text: "How Much Does It Cost to Start a Coffee Brand?", link: "/blog/cost-to-start-coffee-brand" },
    ]),

    rich([
      { text: "Ready to go? " },
      { text: "Start building your brand today", link: "/build" },
      { text: "." },
    ]),
  ];
}

function body3_ghostRoasting(): PTBlock[] {
  resetKeys();
  return [
    p("Ghost roasting is one of the coffee industry's best-kept secrets — and it is transforming how new brands come to market. Whether you are an entrepreneur, a café owner looking to sell house-branded bags, or a business adding coffee to your product line, understanding ghost roasting could save you years of setup time and tens of thousands in capital."),

    h2("What is ghost roasting?"),
    rich([
      { text: "Ghost roasting is a " },
      { text: "white-label production model where a professional roastery roasts, packs, and ships coffee on behalf of another brand", bold: true },
      { text: ". The roastery operates behind the scenes — like a ghost. Your customers never know another company was involved." },
    ]),
    p("It is the same concept as white-label manufacturing in fashion, cosmetics, or supplements — applied to specialty coffee."),

    h2("How does ghost roasting work?"),
    p("The process typically follows four stages:"),
    rich([
      { text: "1. " },
      { text: "Consultation", bold: true },
      { text: " — you choose your roast profile, bean origin, and bag size." },
    ]),
    rich([
      { text: "2. " },
      { text: "Branding", bold: true },
      { text: " — you provide your label artwork (or design it using tools like our " },
      { text: "brand builder", link: "/build" },
      { text: ")." },
    ]),
    rich([
      { text: "3. " },
      { text: "Production", bold: true },
      { text: " — the roastery roasts fresh, applies your labels, and quality-checks every batch." },
    ]),
    rich([
      { text: "4. " },
      { text: "Fulfilment", bold: true },
      { text: " — bags are shipped to you or drop-shipped directly to your customers." },
    ]),
    rich([
      { text: "For a visual walkthrough, see our " },
      { text: "how it works page", link: "/how-it-works" },
      { text: "." },
    ]),

    h2("Why choose ghost roasting over roasting yourself?"),
    h3("No equipment investment"),
    p("A commercial coffee roaster costs £15,000 – £80,000+. Ghost roasting eliminates that entirely."),
    h3("No premises or licensing headaches"),
    p("Running a food-production facility requires local authority registration, HACCP compliance, and regular inspections. Your ghost roaster handles all of this."),
    h3("Consistent quality from day one"),
    rich([
      { text: "Professional roasters have " },
      { text: "years of experience dialling in profiles", bold: true },
      { text: ". You get that expertise from your very first bag." },
    ]),

    h2("Is ghost-roasted coffee lower quality?"),
    rich([
      { text: "Not at all. In fact, the opposite is often true. " },
      { text: "Dedicated roasteries invest in top-tier equipment, source specialty-grade green beans, and roast in climate-controlled environments", bold: true },
      { text: ". Many award-winning brands use ghost roasters." },
    ]),

    h2("Ghost roasting vs white label vs private label"),
    rich([
      { text: "Ghost roasting is a broad term that covers both " },
      { text: "white label (choosing from existing profiles) and private label (custom recipes)", bold: true },
      { text: ". Most founders start with white label for speed and upgrade to private label once their brand matures. Dive deeper in our " },
      { text: "private label vs white label comparison", link: "/blog/private-label-vs-white-label-coffee" },
      { text: "." },
    ]),

    h2("Who uses ghost roasting?"),
    p("More brands than you might think — from Instagram micro-brands selling 50 bags a month, to national subscription services shipping thousands. Gyms, hotels, and restaurants also use ghost roasting to offer branded coffee without building a roasting operation."),
    rich([
      { text: "Curious what it would cost? Read our breakdown in " },
      { text: "How Much Does It Cost to Start a Coffee Brand?", link: "/blog/cost-to-start-coffee-brand" },
    ]),
  ];
}

function body4_profitableNiches(): PTBlock[] {
  resetKeys();
  return [
    p("With the UK coffee market growing year on year, the opportunity for niche coffee brands has never been stronger. But choosing the right niche is critical — it determines your audience, your margins, and your marketing strategy. Here are ten profitable niches backed by genuine consumer demand."),

    h2("1. Fitness and protein coffee"),
    rich([
      { text: "Health-conscious consumers are combining their caffeine fix with functional benefits. " },
      { text: "Coffee brands that target gym-goers with high-caffeine blends, protein-infused coffee, or pre-workout positioning", bold: true },
      { text: " tap into a passionate, spending-ready audience." },
    ]),

    h2("2. Office and workplace coffee"),
    rich([
      { text: "Businesses are ditching generic instant coffee for " },
      { text: "branded specialty options", bold: true },
      { text: ". If you can offer bulk pricing and a reliable subscription, workplace coffee is a high-volume niche with strong retention. Learn more about this space in " },
      { text: "branded coffee for business", link: "/blog/branded-coffee-for-business" },
      { text: "." },
    ]),

    h2("3. Subscription boxes and gifting"),
    p("Coffee subscriptions remain one of the fastest-growing e-commerce categories. Pair unique roast profiles with premium packaging and you have a gift-ready product with recurring revenue potential."),

    h2("4. Ethical and sustainable coffee"),
    rich([
      { text: "Consumers increasingly care about sourcing. Brands that lead with " },
      { text: "Rainforest Alliance, Fairtrade, or direct-trade stories", bold: true },
      { text: " attract loyal customers willing to pay a premium." },
    ]),

    h2("5. Single-origin micro-lots"),
    p("The specialty coffee crowd craves traceability. Offering rotating single-origin micro-lots with tasting notes, farm stories, and brewing guides positions your brand as an authority."),

    h2("6. Cold brew and ready-to-drink"),
    p("The RTD coffee market in the UK is growing at double digits. If you can develop a shelf-stable cold brew product — or even sell fresh cold brew concentrate — there is significant whitespace."),

    h2("7. Hospitality and restaurant own-brand"),
    rich([
      { text: "Restaurants, cafés, and hotels want " },
      { text: "house-branded coffee they can sell alongside their food", bold: true },
      { text: ". White labelling is the easiest way for them to achieve this. See our " },
      { text: "restaurant guide", link: "/blog/white-label-coffee-restaurants" },
      { text: "." },
    ]),

    h2("8. Cultural and community coffee"),
    p("Brands that serve specific communities — Caribbean blends, Middle Eastern-style coffee, or Korean dalgona kits — build fierce loyalty and word-of-mouth growth."),

    h2("9. Luxury and premium blends"),
    p("At the high end, consumers pay £15 – £25 per 250g bag for exceptional coffee with luxury branding. Margins are excellent if you can deliver the experience to match the price point."),

    h2("10. Decaf specialty"),
    rich([
      { text: "The decaf market has been underserved for years. " },
      { text: "Specialty-grade Swiss Water Process decaf", bold: true },
      { text: " is now indistinguishable from regular coffee in taste, and demand is surging among health-conscious drinkers and evening-coffee lovers." },
    ]),

    h2("How to validate your niche"),
    rich([
      { text: "Before committing, test with a small batch. " },
      { text: "White label coffee lets you trial a niche with as few as 10 bags", bold: true },
      { text: " — no long-term contracts, no warehouse of unsold stock. " },
      { text: "Start building your brand now", link: "/build" },
      { text: " and learn what resonates with real customers." },
    ]),
    rich([
      { text: "For a step-by-step launch plan, read " },
      { text: "How to Start a Coffee Brand in the UK", link: "/blog/how-to-start-coffee-brand-uk" },
      { text: "." },
    ]),
  ];
}

function body5_privateLabelVsWhiteLabel(): PTBlock[] {
  resetKeys();
  return [
    p("If you are researching how to launch a coffee brand, you have probably seen the terms \"private label\" and \"white label\" used interchangeably. They are not the same thing — and understanding the difference will save you time, money, and headaches. This guide explains both models clearly so you can choose the right path for your business."),

    h2("White label coffee: the fast-track option"),
    rich([
      { text: "With white label coffee, you " },
      { text: "choose from a roastery's existing range of roast profiles", bold: true },
      { text: " and have them packed under your brand. The coffee recipe already exists — you are simply putting your name on it." },
    ]),
    p("This is the model most new brands use because it is fast (you can have finished product within days), affordable (no recipe development costs), and low-risk (the coffee has already been tested and refined by professional roasters)."),
    rich([
      { text: "New to white label? Start with our " },
      { text: "complete guide to white label coffee", link: "/blog/what-is-white-label-coffee" },
      { text: "." },
    ]),

    h2("Private label coffee: the bespoke route"),
    rich([
      { text: "Private label coffee means " },
      { text: "developing a completely custom recipe", bold: true },
      { text: " — your own blend ratios, roast curves, and flavour profiles. The roastery works with you to create something that does not exist anywhere else." },
    ]),
    p("Private label typically involves sample rounds, cupping sessions, and a longer lead time. It is better suited to brands that have an established audience and want to differentiate at the product level."),

    h2("Key differences at a glance"),
    h3("Speed to market"),
    p("White label: days to weeks. Private label: weeks to months."),
    h3("Minimum order quantities"),
    p("White label MOQs are typically lower (10 – 50 bags). Private label roasters often require 100+ bags per run because of the bespoke setup involved."),
    h3("Cost"),
    rich([
      { text: "White label has " },
      { text: "no development fees", bold: true },
      { text: " — you pay per bag. Private label may include consultation, sampling, and recipe-development costs on top of the per-unit price." },
    ]),
    h3("Uniqueness"),
    p("White label coffee may also be available to other brands using the same roastery. Private label is exclusively yours."),

    h2("Which one should you choose?"),
    rich([
      { text: "If you are " },
      { text: "launching a new brand or testing a market", bold: true },
      { text: ", start with white label. The speed and low commitment let you validate demand before investing in a bespoke product." },
    ]),
    rich([
      { text: "If you are an " },
      { text: "established brand looking for a signature coffee", bold: true },
      { text: ", private label gives you the uniqueness to stand out in a crowded market." },
    ]),
    p("Many successful brands start white label and graduate to private label once they have proven demand and understand their customers' preferences."),

    h2("Can you switch later?"),
    rich([
      { text: "Absolutely. A good roastery partner will support you through both stages. At Ghost Roastery, brands regularly " },
      { text: "start with our white label range and move to custom blends", bold: true },
      { text: " as they grow. It is a natural progression." },
    ]),
    rich([
      { text: "Ready to explore? " },
      { text: "Build your white label brand", link: "/build" },
      { text: " or learn about " },
      { text: "choosing the right roast profile", link: "/blog/choosing-roast-profile-for-your-brand" },
      { text: "." },
    ]),
  ];
}

function body6_packagingDesign(): PTBlock[] {
  resetKeys();
  return [
    p("Your coffee might taste incredible, but if the packaging does not catch someone's eye, they will never find out. In specialty coffee, packaging is your first impression — it communicates quality, story, and value before a single bean is ground. Here is how to design coffee packaging that actually sells."),

    h2("Why coffee packaging design matters"),
    rich([
      { text: "Research shows that " },
      { text: "consumers make purchasing decisions in under seven seconds", bold: true },
      { text: " when browsing a shelf or scrolling an online store. Your bag design needs to communicate three things instantly: what it is, who it is for, and why it is worth the price." },
    ]),

    h2("Essential elements of great coffee packaging"),
    h3("Brand name and logo"),
    p("Your brand name should be the most prominent element. Use a clean, readable typeface — decorative fonts may look creative but often sacrifice legibility. If you are selling online, remember that your bag will appear as a thumbnail."),
    h3("Roast and flavour information"),
    rich([
      { text: "Include the " },
      { text: "roast level, origin, and key tasting notes", bold: true },
      { text: " on the front of the bag. Coffee buyers want this information upfront — it is what helps them choose between products." },
    ]),
    h3("Weight and best-before"),
    p("Legal requirements in the UK mandate net weight and best-before dating. Position these clearly but without cluttering your primary design."),

    h2("Choosing the right bag style"),
    p("Stand-up pouches with a resealable zip are the industry standard for retail coffee. They are practical, shelf-stable, and provide a large print area for your design. Flat-bottom bags offer a more premium look and stand upright on shelves, which is ideal for physical retail."),
    rich([
      { text: "At Ghost Roastery, we offer multiple bag styles and sizes through our " },
      { text: "brand builder", link: "/build" },
      { text: " — you can preview your design on the actual bag before ordering." },
    ]),

    h2("Colour psychology for coffee brands"),
    rich([
      { text: "Colour choices should align with your brand positioning. " },
      { text: "Earthy tones (browns, greens, creams) signal natural and artisan", bold: true },
      { text: ". " },
      { text: "Bold colours (black, gold, deep red) convey luxury", bold: true },
      { text: ". " },
      { text: "Bright, playful palettes work for younger, lifestyle-oriented audiences", bold: true },
      { text: "." },
    ]),

    h2("Common packaging mistakes to avoid"),
    rich([
      { text: "Overcrowding the design", bold: true },
      { text: " — leave white space. A clean bag looks more premium than one crammed with text." },
    ]),
    rich([
      { text: "Ignoring the back panel", bold: true },
      { text: " — use the back for your brand story, brewing instructions, and a call to action (website URL, social handles)." },
    ]),
    rich([
      { text: "Low-resolution artwork", bold: true },
      { text: " — always supply print-ready files at 300 DPI minimum. Blurry labels scream amateur." },
    ]),

    h2("Designing your label without a designer"),
    rich([
      { text: "You do not need to hire an agency. Tools like Ghost Roastery's " },
      { text: "label maker", link: "/build" },
      { text: " let you create professional labels online using templates, custom colours, and your own logo. Many of our top-selling brands designed their first labels themselves." },
    ]),

    h2("Next steps"),
    rich([
      { text: "Great packaging paired with great coffee is a winning combination. If you are still deciding on your coffee, read " },
      { text: "Choosing the Right Roast Profile for Your Brand", link: "/blog/choosing-roast-profile-for-your-brand" },
      { text: ". When you are ready, " },
      { text: "start designing", link: "/build" },
      { text: "." },
    ]),
  ];
}

function body7_roastProfile(): PTBlock[] {
  resetKeys();
  return [
    p("Your roast profile is the flavour DNA of your coffee brand. It shapes how your coffee tastes, who it appeals to, and how customers describe it to their friends. Choosing the right profile is one of the most important decisions you will make as a brand founder. Here is how to get it right."),

    h2("What is a roast profile?"),
    rich([
      { text: "A roast profile is the " },
      { text: "combination of time, temperature, and technique used to transform green coffee beans into roasted coffee", bold: true },
      { text: ". It determines acidity, body, sweetness, and bitterness — the four pillars of coffee flavour." },
    ]),

    h2("Understanding roast levels"),
    h3("Light roast"),
    p("Light roasts preserve the bean's origin characteristics — fruit, floral, and tea-like notes. They are popular with specialty coffee enthusiasts who appreciate complexity and brightness. Best for pour-over, Aeropress, and filter brewing."),
    h3("Medium roast"),
    rich([
      { text: "The most versatile option. Medium roasts balance " },
      { text: "origin flavour with caramel sweetness and a rounded body", bold: true },
      { text: ". They work across all brewing methods and appeal to the widest audience — a smart default for new brands." },
    ]),
    h3("Dark roast"),
    p("Dark roasts are bold, smoky, and full-bodied with lower acidity. They are the go-to for espresso-based drinks and appeal to traditional coffee drinkers who want punch and intensity."),

    h2("Matching your roast profile to your audience"),
    rich([
      { text: "Your target customer should drive your choice. Selling to " },
      { text: "health-conscious millennials", bold: true },
      { text: "? Light or medium. " },
      { text: "Office managers buying for a team", bold: true },
      { text: "? Medium is the safe bet. " },
      { text: "Italian espresso lovers", bold: true },
      { text: "? Go dark." },
    ]),
    rich([
      { text: "Not sure who your audience is yet? Our guide to " },
      { text: "profitable coffee brand niches", link: "/blog/profitable-coffee-brand-niches" },
      { text: " can help you narrow it down." },
    ]),

    h2("Single origin vs blends"),
    rich([
      { text: "Single origins tell a story — a specific farm, region, and processing method. They command higher prices and attract enthusiasts. " },
      { text: "Blends offer consistency", bold: true },
      { text: " — they taste the same year-round because the roaster adjusts component ratios as crops change. Many brands offer both." },
    ]),

    h2("How to taste-test before committing"),
    p("Any reputable roastery will let you sample before ordering in bulk. At Ghost Roastery, our roast profiles are available to taste before you commit — we want you to love what you sell."),
    rich([
      { text: "Already have a sense of what you want? " },
      { text: "Jump into our brand builder", link: "/build" },
      { text: " to select your roast and start designing your packaging." },
    ]),

    h2("Can you change your roast profile later?"),
    rich([
      { text: "Yes — and many brands do. Starting with a " },
      { text: "proven white label profile", bold: true },
      { text: " lets you sell immediately while you refine your preferences based on real customer feedback. Read more about the " },
      { text: "difference between white label and private label", link: "/blog/private-label-vs-white-label-coffee" },
      { text: " to understand your options." },
    ]),
  ];
}

function body8_bestPartner(): PTBlock[] {
  resetKeys();
  return [
    p("Choosing a white label coffee partner is one of the most important decisions you will make for your brand. The wrong partner means inconsistent quality, slow turnarounds, and frustrating communication. The right partner feels like an extension of your team. Here is why hundreds of UK brands trust Ghost Roastery."),

    h2("What to look for in a white label coffee partner"),
    rich([
      { text: "Before we talk about ourselves, let us outline what makes a " },
      { text: "great white label partner", bold: true },
      { text: ":" },
    ]),
    rich([
      { text: "Specialty-grade coffee", bold: true },
      { text: " — beans scoring 80+ on the SCA scale." },
    ]),
    rich([
      { text: "Flexible minimum orders", bold: true },
      { text: " — low MOQs for startups, scalable for growth." },
    ]),
    rich([
      { text: "In-house design tools", bold: true },
      { text: " — so you can create packaging without hiring a designer." },
    ]),
    rich([
      { text: "Fast turnaround", bold: true },
      { text: " — roast-to-ship in days, not weeks." },
    ]),
    rich([
      { text: "Transparent pricing", bold: true },
      { text: " — no hidden setup fees or surprise charges." },
    ]),

    h2("Why brands choose Ghost Roastery"),
    h3("All-in-one platform"),
    rich([
      { text: "Our " },
      { text: "online brand builder", link: "/build" },
      { text: " lets you choose your bag, design your label, pick your roast profile, and place your order — all in one session. No back-and-forth emails, no waiting for quotes." },
    ]),
    h3("UK-based roastery"),
    p("We roast, pack, and ship from our facility in the UK. That means fresher coffee, faster delivery, and no import complications."),
    h3("Low minimum order quantities"),
    rich([
      { text: "Start with as few as 10 bags. " },
      { text: "No long-term contracts, no commitment beyond your current order", bold: true },
      { text: ". This makes us ideal for brand testing and market validation." },
    ]),
    h3("Specialty grade as standard"),
    p("Every roast profile in our range is specialty grade. We source from trusted farms and importers, and roast in small batches for maximum freshness and flavour consistency."),

    h2("From startup to scale"),
    rich([
      { text: "We work with brands at every stage — from first-time founders ordering 10 bags, to established businesses shipping thousands monthly. Our " },
      { text: "pricing scales with volume", bold: true },
      { text: ", so your margins improve as you grow." },
    ]),

    h2("What our customers say"),
    p("Our partners consistently highlight three things: the quality of the coffee, the simplicity of the ordering process, and the speed of delivery. We are proud of the relationships we have built and the brands we have helped launch."),

    h2("Ready to partner with us?"),
    rich([
      { text: "If you are looking for a reliable, quality-focused white label coffee partner in the UK, " },
      { text: "start building your brand today", link: "/build" },
      { text: ". Have questions first? " },
      { text: "See how it works", link: "/how-it-works" },
      { text: " or read our guide to " },
      { text: "coffee packaging design", link: "/blog/coffee-packaging-design-guide" },
      { text: "." },
    ]),
  ];
}

function body9_buildIn5Steps(): PTBlock[] {
  resetKeys();
  return [
    p("Building a coffee brand can feel overwhelming — but it does not have to be. With the right approach, you can go from idea to first sale in five clear steps. This guide cuts through the noise and gives you a practical, proven framework."),

    h2("Step 1: Nail your brand identity"),
    rich([
      { text: "Before you think about coffee, think about your customer. " },
      { text: "Who are they, what do they value, and where do they spend their time?", bold: true },
      { text: " Your brand name, tone of voice, and visual identity should all flow from these answers." },
    ]),
    p("Write a one-sentence brand statement: \"We sell [product type] for [audience] who want [benefit].\" Everything else builds from here."),

    h2("Step 2: Choose your coffee"),
    rich([
      { text: "Select a " },
      { text: "roast profile that matches your audience", bold: true },
      { text: ". Do not overcomplicate this — starting with one or two SKUs is better than launching with ten. Most successful brands begin with a signature blend and a single origin." },
    ]),
    rich([
      { text: "Read our " },
      { text: "roast profile guide", link: "/blog/choosing-roast-profile-for-your-brand" },
      { text: " for help choosing." },
    ]),

    h2("Step 3: Design your packaging"),
    rich([
      { text: "Your packaging is your brand made physical. Choose a bag style, design your label, and make sure it looks as good as a thumbnail as it does in hand. Our " },
      { text: "brand builder", link: "/build" },
      { text: " walks you through the entire process." },
    ]),
    rich([
      { text: "For design tips, see " },
      { text: "How to Design Coffee Packaging That Sells", link: "/blog/coffee-packaging-design-guide" },
      { text: "." },
    ]),

    h2("Step 4: Set up your sales channel"),
    p("You do not need a fancy website to start. A simple Shopify store, an Instagram shop, or even a market stall will do. The goal is to make your first ten sales, not build a perfect storefront."),
    rich([
      { text: "Key tip: " },
      { text: "price for profit", bold: true },
      { text: ". Research competitor pricing, factor in your cost per bag plus shipping, and set a retail price that gives you at least 40 – 60% margin." },
    ]),

    h2("Step 5: Launch and learn"),
    rich([
      { text: "Ship your first batch, share it with your network, and " },
      { text: "listen to the feedback", bold: true },
      { text: ". What do people love? What questions do they ask? Use this to refine your next order." },
    ]),
    p("The brands that succeed are the ones that iterate quickly. Your first batch is a starting point, not the final product."),

    h2("What comes after the first sale?"),
    p("Once you have proven demand, you can expand: add new SKUs, explore wholesale, build a subscription, or invest in marketing. The foundation you build in these five steps scales with you."),
    rich([
      { text: "For a detailed cost breakdown, see " },
      { text: "How Much Does It Cost to Start a Coffee Brand?", link: "/blog/cost-to-start-coffee-brand" },
      { text: ". Ready to begin? " },
      { text: "Start building now", link: "/build" },
      { text: "." },
    ]),
  ];
}

function body10_costToStart(): PTBlock[] {
  resetKeys();
  return [
    p("One of the most common questions we hear from aspiring coffee entrepreneurs is: how much does it actually cost? The good news is that white label coffee has dramatically lowered the barrier to entry. Here is a realistic cost breakdown for launching a coffee brand in the UK."),

    h2("The old way: roasting yourself"),
    p("Traditionally, starting a coffee brand meant buying or leasing a commercial roaster (£15,000 – £80,000+), renting food-safe premises, obtaining local authority registration, and sourcing green beans in bulk. Total startup costs could easily exceed £50,000."),
    rich([
      { text: "That model still works for some, but " },
      { text: "white label and ghost roasting have made it optional", bold: true },
      { text: ". You can now launch with a fraction of that investment." },
    ]),

    h2("The white label way: realistic costs"),
    h3("First order of coffee: £100 – £400"),
    p("Most white label roasters allow orders as small as 10 – 24 bags. At a cost of roughly £4 – £8 per 250g bag (depending on volume tier), your first production run costs well under £500."),
    h3("Branding and design: £0 – £500"),
    rich([
      { text: "If you use a free tool like our " },
      { text: "brand builder", link: "/build" },
      { text: ", you can design professional labels at no extra cost. Hiring a freelance designer typically costs £200 – £500 for a logo and label." },
    ]),
    h3("Website: £0 – £30/month"),
    p("Shopify starts at around £25/month. WooCommerce on shared hosting can be even cheaper. Alternatively, sell through Instagram, Etsy, or local markets while you validate demand."),
    h3("Domain and email: £10 – £30/year"),
    p("A .co.uk domain and professional email address are small but important investments for credibility."),
    h3("Marketing: £0 – £200"),
    p("Organic social media is free. If you want to test paid ads, £50 – £200 is enough for an initial Facebook or Instagram campaign to gauge interest."),

    h2("Total estimated startup cost"),
    rich([
      { text: "For a basic white label launch: " },
      { text: "£150 – £800", bold: true },
      { text: ". Compare that with the £50,000+ required to roast your own, and you can see why white label has become the default for new brands." },
    ]),

    h2("Ongoing costs and margins"),
    rich([
      { text: "Once launched, your main recurring cost is coffee inventory. " },
      { text: "Typical retail margins range from 50 – 70%", bold: true },
      { text: " depending on your pricing and volume tier. As your order quantities increase, your per-bag cost decreases." },
    ]),
    rich([
      { text: "For wholesale pricing details, see " },
      { text: "how wholesale pricing works", link: "/blog/wholesale-coffee-pricing-guide" },
      { text: "." },
    ]),

    h2("Hidden costs to watch for"),
    rich([
      { text: "Shipping", bold: true },
      { text: " — factor in delivery costs to your customers. Offer free shipping above a threshold to increase average order value." },
    ]),
    rich([
      { text: "Packaging extras", bold: true },
      { text: " — stickers, mailer boxes, and tissue paper add up. Start simple and upgrade as revenue grows." },
    ]),
    rich([
      { text: "Returns and samples", bold: true },
      { text: " — budget for sending samples to potential stockists or influencers." },
    ]),

    h2("Get started for less than you think"),
    rich([
      { text: "The financial barrier to launching a coffee brand has never been lower. " },
      { text: "Start building your brand today", link: "/build" },
      { text: " and place your first order for as little as 10 bags." },
    ]),
  ];
}

function body11_brandedCoffeeForBusiness(): PTBlock[] {
  resetKeys();
  return [
    p("Walk into any high-end gym, boutique hotel, or modern co-working space and you will notice one thing: generic coffee is disappearing. In its place, businesses are serving branded specialty coffee that reflects their identity. Here is why — and how you can do the same."),

    h2("Why branded coffee matters for businesses"),
    rich([
      { text: "Your coffee is a touchpoint. Every cup a guest, member, or employee drinks is a moment of brand interaction. " },
      { text: "Serving branded coffee reinforces your identity and signals quality", bold: true },
      { text: " in a way that a jar of instant never can." },
    ]),

    h2("Gyms and fitness studios"),
    h3("The protein-coffee crossover"),
    p("Gym members are already buying post-workout coffee. Offering your own branded bags — or a premium brew bar — creates an additional revenue stream while keeping members engaged with your brand after they leave the gym floor."),
    rich([
      { text: "Explore " },
      { text: "how to build your own branded coffee range", link: "/how-it-works" },
      { text: "." },
    ]),

    h2("Hotels and hospitality"),
    rich([
      { text: "In-room coffee is one of the first things guests experience. Replacing generic sachets with " },
      { text: "beautifully branded bags of specialty coffee", bold: true },
      { text: " elevates the guest experience and drives direct sales (guests love buying bags to take home)." },
    ]),

    h2("Offices and co-working spaces"),
    rich([
      { text: "Good coffee is a retention tool. Companies investing in " },
      { text: "branded office coffee report higher employee satisfaction scores", bold: true },
      { text: ". Co-working spaces use it as a marketing differentiator — \"free specialty coffee\" is a powerful selling point for memberships." },
    ]),

    h2("How to get started with branded coffee"),
    p("You do not need to become a coffee roaster. White label partners handle everything from roasting to packing — you just provide your branding."),
    rich([
      { text: "The process is simple: choose your roast, design your packaging, and order. Most businesses start with a " },
      { text: "wholesale enquiry", link: "/wholesale" },
      { text: " to discuss volume pricing and ongoing supply." },
    ]),

    h2("The ROI of branded coffee"),
    p("Consider the numbers: a bag of branded coffee costs £4 – £8 to produce and can retail for £10 – £15. Hotels selling in-room bags, gyms selling at reception, and offices gifting bags to clients — the margins are strong and the brand value is compounding."),

    h2("Ready to explore wholesale?"),
    rich([
      { text: "If you run a gym, hotel, office, or any customer-facing business, " },
      { text: "branded coffee is one of the highest-ROI brand investments", bold: true },
      { text: " you can make. " },
      { text: "Get in touch about wholesale", link: "/wholesale" },
      { text: " to discuss your requirements." },
    ]),
  ];
}

function body12_specialtyCoffeeWorkplaces(): PTBlock[] {
  resetKeys();
  return [
    p("The UK workplace is undergoing a quiet coffee revolution. Instant granules and vending machines are giving way to freshly roasted, specialty-grade beans — and the shift is being driven by employee expectations, wellness culture, and smart businesses that understand the value of a good cup."),

    h2("Why UK workplaces are upgrading their coffee"),
    rich([
      { text: "A 2024 survey by the British Coffee Association found that " },
      { text: "74% of UK office workers consider coffee quality an important workplace perk", bold: true },
      { text: ". For Gen Z and millennial employees — who grew up with specialty coffee shops — instant coffee feels like an insult." },
    ]),
    p("Forward-thinking companies are responding by investing in quality. Bean-to-cup machines, filter stations, and branded bag gifting programmes are all on the rise."),

    h2("The business case for better coffee"),
    h3("Employee satisfaction and retention"),
    rich([
      { text: "Good coffee is a low-cost, high-impact perk. " },
      { text: "It signals that the company cares about its people's daily experience", bold: true },
      { text: " — and in a competitive talent market, small details matter." },
    ]),
    h3("Client and visitor impressions"),
    p("Serving specialty coffee to clients during meetings elevates your brand. It is a subtle signal of quality that guests notice and remember."),
    h3("Reduced café spending"),
    p("If your team is making two to three café trips a day, that is wasted time and money. Premium in-office coffee reduces that friction."),

    h2("What does specialty workplace coffee look like?"),
    p("It ranges from simple to sophisticated:"),
    rich([
      { text: "Entry level", bold: true },
      { text: " — freshly roasted whole beans or ground coffee for a communal grinder and filter machine." },
    ]),
    rich([
      { text: "Mid-tier", bold: true },
      { text: " — bean-to-cup machines loaded with specialty beans, plus a curated selection of guest coffees." },
    ]),
    rich([
      { text: "Premium", bold: true },
      { text: " — branded company coffee (your logo on the bag), offered as a perk, a client gift, or a retail product." },
    ]),

    h2("Own-branded office coffee"),
    rich([
      { text: "Some businesses go further and commission " },
      { text: "their own branded coffee bags", bold: true },
      { text: ". Think law firms gifting branded coffee to clients, tech companies including a bag in onboarding packs, or co-working spaces selling house-brand bags at reception." },
    ]),
    rich([
      { text: "Interested? See why " },
      { text: "every gym, hotel and office needs branded coffee", link: "/blog/branded-coffee-for-business" },
      { text: ", or " },
      { text: "enquire about wholesale", link: "/wholesale" },
      { text: " for volume pricing." },
    ]),

    h2("Getting started"),
    rich([
      { text: "Switching to specialty coffee is simpler and more affordable than most businesses expect. A " },
      { text: "wholesale coffee supplier", link: "/blog/choose-wholesale-coffee-supplier" },
      { text: " can set you up with recurring deliveries tailored to your team size and consumption." },
    ]),
  ];
}

function body13_whiteLabeRestaurants(): PTBlock[] {
  resetKeys();
  return [
    p("Restaurants have long understood the power of a house wine. But what about house coffee? White label coffee lets restaurants serve their own branded coffee — a powerful way to extend the dining experience, build loyalty, and add a profitable product line. This guide covers everything you need to know."),

    h2("Why restaurants should consider white label coffee"),
    rich([
      { text: "Coffee is the last taste a diner experiences. " },
      { text: "Making it memorable — and branded — turns a meal into a brand moment", bold: true },
      { text: ". Diners who love your coffee will ask where to buy it, creating a natural retail opportunity." },
    ]),

    h2("The opportunity for restaurant-branded coffee"),
    h3("Retail bags for sale"),
    p("Selling branded 250g bags at the counter or online is a high-margin addition to your menu. Production costs are low and the perceived value is high — especially when connected to a restaurant brand people already trust."),
    h3("Coffee as a gift or loyalty reward"),
    p("Branded bags make excellent gifts for regulars, VIP guests, or staff. They can also work as loyalty rewards — spend a certain amount, receive a complimentary bag."),
    h3("Takeaway and delivery add-on"),
    p("Include a branded coffee bag as an upsell in your online ordering platform. Customers ordering a Saturday night dinner may happily add a bag for their Sunday morning."),

    h2("How white label coffee works for restaurants"),
    rich([
      { text: "You " },
      { text: "choose a roast profile that matches your brand", bold: true },
      { text: " (an Italian restaurant might pick a dark espresso blend; a brunch spot might go for a fruity medium roast). Your roastery packs it with your restaurant's label and delivers it to your door." },
    ]),
    rich([
      { text: "There is no roasting equipment required and no food-safety complications beyond what you already manage. " },
      { text: "Learn how it works", link: "/how-it-works" },
      { text: "." },
    ]),

    h2("Choosing the right coffee for your restaurant"),
    p("Consider your cuisine and clientele. A fine-dining establishment might opt for single-origin specialties with tasting notes on the bag. A casual café chain might prefer a crowd-pleasing medium blend that pairs with pastries and brunch dishes."),
    rich([
      { text: "Need guidance? Read " },
      { text: "How to Choose a Wholesale Coffee Supplier", link: "/blog/choose-wholesale-coffee-supplier" },
      { text: " for what to look for in a partner." },
    ]),

    h2("Getting started"),
    rich([
      { text: "White label coffee for restaurants is one of our most popular use cases. " },
      { text: "Submit a wholesale enquiry", link: "/wholesale" },
      { text: " and we will work with you on roast selection, label design, and ongoing supply." },
    ]),
  ];
}

function body14_wholesalePricing(): PTBlock[] {
  resetKeys();
  return [
    p("Understanding wholesale coffee pricing is essential whether you are a café buying beans for service, a business stocking branded coffee for staff, or an entrepreneur exploring resale margins. This guide demystifies how pricing works so you can budget effectively and negotiate confidently."),

    h2("What determines wholesale coffee price?"),
    rich([
      { text: "Several factors influence the per-kilogram or per-bag price you will pay:" },
    ]),
    rich([
      { text: "Bean quality and origin", bold: true },
      { text: " — specialty-grade single origins cost more than commercial blends." },
    ]),
    rich([
      { text: "Roast complexity", bold: true },
      { text: " — lighter roasts require more skill and tighter quality control." },
    ]),
    rich([
      { text: "Order volume", bold: true },
      { text: " — larger orders unlock lower per-unit pricing (tiered pricing)." },
    ]),
    rich([
      { text: "Packaging", bold: true },
      { text: " — branded bags with custom labels cost more than plain packaging." },
    ]),
    rich([
      { text: "Fulfilment", bold: true },
      { text: " — drop-shipping to individual customers costs more than palletised bulk delivery." },
    ]),

    h2("Typical UK wholesale coffee price ranges"),
    h3("Commercial grade"),
    p("£8 – £14 per kg. Suitable for high-volume, price-sensitive environments like staff kitchens and budget cafés."),
    h3("Specialty grade"),
    p("£14 – £24 per kg. The standard for quality-focused cafés, restaurants, and branded retail. This is the range most white label brands operate in."),
    h3("Premium single origin"),
    p("£22 – £35+ per kg. Competition-grade beans and micro-lots. Higher cost but commands premium retail pricing."),

    h2("Understanding tiered pricing"),
    rich([
      { text: "Most wholesale suppliers use " },
      { text: "volume-based pricing tiers", bold: true },
      { text: ". For example:" },
    ]),
    p("10 – 24 bags: highest per-unit price (ideal for testing)."),
    p("25 – 49 bags: moderate discount."),
    p("50 – 99 bags: significant per-unit savings."),
    p("100+ bags: best possible pricing."),
    rich([
      { text: "This tiered structure means your " },
      { text: "margins improve as you scale", bold: true },
      { text: ". A brand paying £6 per bag at 10 units might pay £4 per bag at 100 units — a meaningful difference when you are selling at £12 retail." },
    ]),

    h2("Calculating your retail margin"),
    rich([
      { text: "The formula is straightforward: " },
      { text: "(retail price - cost per bag) / retail price = gross margin", bold: true },
      { text: ". Aim for at least 50% gross margin on retail sales and 30 – 40% on wholesale-to-retail." },
    ]),

    h2("What to ask a wholesale supplier"),
    p("Before committing, ask about minimum order quantities, lead times, shelf life, and whether pricing includes packaging and labelling. A transparent supplier will share all of this upfront."),
    rich([
      { text: "For help evaluating suppliers, read " },
      { text: "How to Choose a Wholesale Coffee Supplier", link: "/blog/choose-wholesale-coffee-supplier" },
      { text: ". Ready to get pricing? " },
      { text: "Submit a wholesale enquiry", link: "/wholesale" },
      { text: "." },
    ]),
  ];
}

function body15_brandedVsGeneric(): PTBlock[] {
  resetKeys();
  return [
    p("In a world of choice, why would a customer pick one coffee over another? The answer, more often than not, comes down to brand. Branded coffee outperforms generic alternatives in almost every measurable way — and here is the evidence to prove it."),

    h2("What we mean by branded vs generic"),
    rich([
      { text: "Generic coffee", bold: true },
      { text: " is commodity-grade coffee sold without a strong brand identity — think supermarket own-label or unbranded bulk beans. " },
      { text: "Branded coffee", bold: true },
      { text: " carries a distinct identity: a name, a story, visual packaging, and a promise of quality." },
    ]),

    h2("Why customers pay more for branded coffee"),
    h3("Perceived quality"),
    rich([
      { text: "Research consistently shows that " },
      { text: "consumers associate strong branding with higher quality", bold: true },
      { text: " — even when the underlying product is similar. A well-designed bag with clear origin information and tasting notes signals craftsmanship." },
    ]),
    h3("Trust and consistency"),
    p("A brand name is a promise. When a customer finds a coffee they love, the brand is their shortcut to buying it again. Generic coffee offers no such guarantee."),
    h3("Emotional connection"),
    p("Great coffee brands tell stories — about the farmer, the roasting process, or the founder's journey. These narratives create emotional bonds that generic products simply cannot replicate."),

    h2("The business impact of branded coffee"),
    h3("Higher price points"),
    p("Branded specialty coffee typically retails for 30 – 60% more than unbranded alternatives of similar quality. The brand is literally worth money."),
    h3("Customer loyalty and repeat purchases"),
    rich([
      { text: "Branded coffee builds habits. " },
      { text: "Subscription rates for branded coffee are significantly higher", bold: true },
      { text: " than for generic, because customers develop a relationship with the brand, not just the product." },
    ]),
    h3("Word of mouth"),
    p("People recommend brands, not commodities. A beautifully packaged bag of coffee gets shared on Instagram, gifted to friends, and talked about at dinner parties. Generic coffee does none of this."),

    h2("Branded coffee for B2B"),
    rich([
      { text: "Businesses serving branded coffee to employees and clients see measurable benefits too. " },
      { text: "Branded office coffee is perceived as a premium perk", bold: true },
      { text: ", while generic coffee is just... coffee. Read more in " },
      { text: "Why Every Gym, Hotel & Office Needs Branded Coffee", link: "/blog/branded-coffee-for-business" },
      { text: "." },
    ]),

    h2("How to brand your coffee"),
    rich([
      { text: "White labelling makes it straightforward. You do not need to roast your own beans — just partner with a roastery that handles production while you focus on building a brand customers love. " },
      { text: "Get started with a wholesale enquiry", link: "/wholesale" },
      { text: " or " },
      { text: "learn about wholesale pricing", link: "/blog/wholesale-coffee-pricing-guide" },
      { text: "." },
    ]),
  ];
}

function body16_chooseSupplier(): PTBlock[] {
  resetKeys();
  return [
    p("Finding the right wholesale coffee supplier can make or break your business. Whether you are a café owner, an office manager, or an entrepreneur building a branded coffee line, this guide covers the key factors to evaluate before signing on with a supplier."),

    h2("Define your requirements first"),
    rich([
      { text: "Before you start comparing suppliers, clarify what you need:" },
    ]),
    rich([
      { text: "Volume", bold: true },
      { text: " — how many kilograms or bags per month?" },
    ]),
    rich([
      { text: "Branding", bold: true },
      { text: " — do you need custom-branded packaging or plain bags?" },
    ]),
    rich([
      { text: "Variety", bold: true },
      { text: " — single origin, blends, decaf, or all of the above?" },
    ]),
    rich([
      { text: "Delivery", bold: true },
      { text: " — regular scheduled deliveries or on-demand ordering?" },
    ]),

    h2("Quality credentials to look for"),
    h3("Specialty grade certification"),
    rich([
      { text: "Look for suppliers offering beans that score " },
      { text: "80+ on the SCA (Specialty Coffee Association) scale", bold: true },
      { text: ". This is the baseline for specialty coffee and ensures a noticeably better cup than commercial grade." },
    ]),
    h3("Transparent sourcing"),
    p("Good suppliers can tell you where their beans come from — the country, region, farm, and processing method. If a supplier cannot answer these questions, that is a red flag."),
    h3("Freshness guarantees"),
    p("Coffee is a perishable product. Your supplier should roast to order or within a recent window, and clearly communicate roast dates on packaging."),

    h2("Pricing and terms"),
    rich([
      { text: "Understand the " },
      { text: "pricing tiers, minimum order quantities, and payment terms", bold: true },
      { text: " before committing. The cheapest option is rarely the best — factor in quality, reliability, and service. For a deeper dive, see " },
      { text: "How Wholesale Coffee Pricing Works", link: "/blog/wholesale-coffee-pricing-guide" },
      { text: "." },
    ]),

    h2("Service and support"),
    h3("Responsiveness"),
    p("Test the supplier's communication before placing a large order. How quickly do they respond to enquiries? Are they helpful and knowledgeable?"),
    h3("Flexibility"),
    p("Can they accommodate custom orders, seasonal specials, or last-minute volume changes? A good supplier grows with you."),
    h3("Design and branding support"),
    rich([
      { text: "If you want branded packaging, check whether the supplier offers " },
      { text: "design tools or label printing services", bold: true },
      { text: ". Some (like Ghost Roastery) provide a full online brand builder." },
    ]),

    h2("Trial before you commit"),
    p("Any reputable supplier will let you sample their coffee before committing to a large order. Order a small trial batch, taste it across your intended brewing methods, and evaluate the full experience — from ordering to delivery to the cup."),

    h2("Ready to find your supplier?"),
    rich([
      { text: "If you are looking for a UK-based wholesale coffee supplier with specialty-grade beans, flexible MOQs, and full branding support, " },
      { text: "submit a wholesale enquiry", link: "/wholesale" },
      { text: " and we will be in touch within 24 hours." },
    ]),
  ];
}

function body17_wholesaleExplained(): PTBlock[] {
  resetKeys();
  return [
    p("Thinking about ordering wholesale coffee from Ghost Roastery? This article covers everything you need to know — our pricing structure, minimum order quantities, delivery, and the step-by-step process for getting set up."),

    h2("Who is Ghost Roastery wholesale for?"),
    rich([
      { text: "Our wholesale programme serves:" },
    ]),
    rich([
      { text: "Cafés and coffee shops", bold: true },
      { text: " looking for specialty-grade beans." },
    ]),
    rich([
      { text: "Restaurants and hotels", bold: true },
      { text: " wanting branded or unbranded house coffee." },
    ]),
    rich([
      { text: "Offices and co-working spaces", bold: true },
      { text: " upgrading their coffee offering." },
    ]),
    rich([
      { text: "Entrepreneurs and brands", bold: true },
      { text: " reselling coffee under their own label." },
    ]),

    h2("Pricing structure"),
    rich([
      { text: "We operate on a " },
      { text: "simple tiered pricing model", bold: true },
      { text: ". The more you order, the less you pay per unit. Our pricing is transparent — no hidden setup fees, no surprise surcharges." },
    ]),
    p("Pricing varies by bag size, roast profile, and whether you want branded or unbranded packaging. We are happy to provide a detailed quote tailored to your specific requirements."),
    rich([
      { text: "Want to understand wholesale pricing in more detail? Read " },
      { text: "How Wholesale Coffee Pricing Works", link: "/blog/wholesale-coffee-pricing-guide" },
      { text: "." },
    ]),

    h2("Minimum order quantities"),
    rich([
      { text: "Our MOQs are designed to be " },
      { text: "accessible for small businesses and startups", bold: true },
      { text: ". You do not need to commit to pallet-sized orders to get started. We believe in growing with our partners — start small and scale as demand increases." },
    ]),

    h2("What coffee do we offer?"),
    p("Our wholesale range includes single-origin coffees and blends across light, medium, and dark roast profiles. All coffee is specialty grade (scoring 80+ on the SCA scale) and roasted fresh in small batches at our UK roastery."),
    rich([
      { text: "If you are not sure which roast suits your needs, our team can guide you — or read " },
      { text: "Choosing the Right Roast Profile", link: "/blog/choosing-roast-profile-for-your-brand" },
      { text: "." },
    ]),

    h2("Branded vs unbranded"),
    rich([
      { text: "You can order coffee with " },
      { text: "your own branded labels (white label) or with our Ghost Roastery branding", bold: true },
      { text: ". Many cafés sell Ghost Roastery-branded bags at their counter, while businesses prefer their own branding for a more personal touch." },
    ]),

    h2("Delivery and lead times"),
    p("We ship across the UK with typical lead times of 5 – 7 working days from order to delivery. Recurring orders can be scheduled for regular automated deliveries so you never run out."),

    h2("How to get started"),
    rich([
      { text: "Getting set up is simple: " },
      { text: "submit a wholesale enquiry", link: "/wholesale" },
      { text: " with your requirements, and our team will respond within 24 hours with pricing, samples, and next steps." },
    ]),
    rich([
      { text: "For a walkthrough of the ordering process, read " },
      { text: "How to Place Your First Wholesale Coffee Order", link: "/blog/first-wholesale-coffee-order" },
      { text: "." },
    ]),
  ];
}

function body18_firstWholesaleOrder(): PTBlock[] {
  resetKeys();
  return [
    p("Placing your first wholesale coffee order can feel like a big step — but it is actually straightforward once you know what to expect. This guide walks you through the entire process, from initial enquiry to receiving your first delivery."),

    h2("Step 1: Submit a wholesale enquiry"),
    rich([
      { text: "Start by " },
      { text: "submitting an enquiry through our wholesale page", link: "/wholesale" },
      { text: ". Tell us about your business, estimated volumes, and whether you want branded or unbranded coffee. The more detail you provide, the faster we can prepare a tailored quote." },
    ]),

    h2("Step 2: Receive your quote"),
    rich([
      { text: "Within 24 hours, our team will respond with " },
      { text: "pricing based on your volume, bag sizes, and branding requirements", bold: true },
      { text: ". We will also suggest roast profiles based on your use case — whether you are serving espresso in a café, filter in an office, or selling retail bags online." },
    ]),

    h2("Step 3: Sample and taste"),
    p("Before you commit to a full order, we will send you samples of the roast profiles we have recommended. Taste them across your intended brewing methods. Share them with your team. Make sure you love what you are selling."),
    rich([
      { text: "Not sure what to look for? Our " },
      { text: "guide to choosing a wholesale supplier", link: "/blog/choose-wholesale-coffee-supplier" },
      { text: " covers the key quality indicators." },
    ]),

    h2("Step 4: Confirm your order"),
    rich([
      { text: "Once you have selected your coffee, confirm your order details:" },
    ]),
    rich([
      { text: "Roast profile(s)", bold: true },
      { text: " and quantities." },
    ]),
    rich([
      { text: "Bag size", bold: true },
      { text: " (250g, 500g, 1kg)." },
    ]),
    rich([
      { text: "Branding", bold: true },
      { text: " — if custom-labelled, provide your artwork or use our design tools." },
    ]),
    rich([
      { text: "Delivery address", bold: true },
      { text: " and preferred delivery schedule." },
    ]),

    h2("Step 5: Production and delivery"),
    rich([
      { text: "We roast your coffee fresh, apply your labels (if applicable), and ship within our standard lead time. " },
      { text: "Typical delivery is 5 – 7 working days", bold: true },
      { text: " from order confirmation." },
    ]),

    h2("Step 6: Reorder and scale"),
    rich([
      { text: "After your first order, reordering is simple. Many customers set up " },
      { text: "recurring orders on a weekly or monthly cadence", bold: true },
      { text: " so they never run out. As your volumes increase, your per-unit pricing decreases — better margins as you scale." },
    ]),

    h2("Tips for a smooth first order"),
    rich([
      { text: "Order slightly more than you think you need", bold: true },
      { text: " — running out is worse than having a small surplus." },
    ]),
    rich([
      { text: "Start with one or two products", bold: true },
      { text: " and expand once you understand what sells." },
    ]),
    rich([
      { text: "Communicate any branding deadlines early", bold: true },
      { text: " so we can prioritise your label production." },
    ]),

    h2("Ready to order?"),
    rich([
      { text: "Your first wholesale order is just a conversation away. " },
      { text: "Submit your enquiry", link: "/wholesale" },
      { text: " and we will guide you through every step." },
    ]),
  ];
}

// ── Article Definitions ─────────────────────────────────────────

interface ArticleDef {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  excerpt: string;
  category: string;
  funnelStage: string;
  campaign: string;
  targetKeyword: string;
  ctaType: string;
  ctaUrl: string;
  bodyFn: () => PTBlock[];
}

const articles: ArticleDef[] = [
  // ── Campaign 1: Brand Builder (TOFU) ──
  {
    slug: "what-is-white-label-coffee",
    title: "What Is White Label Coffee? A Complete Guide",
    seoTitle: "What Is White Label Coffee? A Complete Guide",
    seoDescription: "Learn what white label coffee is, how it works, and why it's the fastest way to launch your own coffee brand in the UK. No roasting equipment needed.",
    excerpt: "White label coffee lets you sell specialty-grade coffee under your own brand without roasting a single bean. Learn how it works and how to get started.",
    category: "guides",
    funnelStage: "tofu",
    campaign: "brand-builder",
    targetKeyword: "white label coffee",
    ctaType: "build",
    ctaUrl: "/build",
    bodyFn: body1_whatIsWhiteLabel,
  },
  {
    slug: "how-to-start-coffee-brand-uk",
    title: "How to Start a Coffee Brand in the UK (2025)",
    seoTitle: "How to Start a Coffee Brand in the UK (2025)",
    seoDescription: "Step-by-step guide to starting a coffee brand in the UK. From choosing your niche to placing your first order — no roastery required.",
    excerpt: "Starting a coffee brand in the UK has never been more accessible. This step-by-step guide takes you from concept to first sale using white label coffee.",
    category: "guides",
    funnelStage: "tofu",
    campaign: "brand-builder",
    targetKeyword: "start a coffee brand UK",
    ctaType: "build",
    ctaUrl: "/build",
    bodyFn: body2_howToStartBrand,
  },
  {
    slug: "ghost-roasting-explained",
    title: "Ghost Roasting Explained: How It Works",
    seoTitle: "Ghost Roasting Explained: How It Works",
    seoDescription: "Discover how ghost roasting works and why it's the coffee industry's best-kept secret for launching a brand without a roastery.",
    excerpt: "Ghost roasting lets you sell coffee under your own brand while a professional roastery handles everything behind the scenes. Here's how it works.",
    category: "coffee",
    funnelStage: "tofu",
    campaign: "brand-builder",
    targetKeyword: "ghost roasting",
    ctaType: "build",
    ctaUrl: "/build",
    bodyFn: body3_ghostRoasting,
  },
  {
    slug: "profitable-coffee-brand-niches",
    title: "10 Profitable Niches for a Coffee Brand",
    seoTitle: "10 Profitable Niches for a Coffee Brand",
    seoDescription: "Discover 10 profitable coffee brand niches backed by real consumer demand. Find the perfect market for your new coffee business.",
    excerpt: "From fitness coffee to luxury blends, here are 10 profitable niches for a new coffee brand — each backed by genuine UK consumer demand.",
    category: "business",
    funnelStage: "tofu",
    campaign: "brand-builder",
    targetKeyword: "coffee brand niches",
    ctaType: "build",
    ctaUrl: "/build",
    bodyFn: body4_profitableNiches,
  },

  // ── Campaign 1: Brand Builder (MOFU) ──
  {
    slug: "private-label-vs-white-label-coffee",
    title: "Private Label vs White Label Coffee: What's the Difference?",
    seoTitle: "Private Label vs White Label Coffee: Key Differences",
    seoDescription: "Private label or white label coffee? Learn the key differences in cost, speed, and control to choose the right model for your brand.",
    excerpt: "Private label and white label coffee are not the same thing. This guide breaks down the differences so you can choose the right model for your brand.",
    category: "guides",
    funnelStage: "mofu",
    campaign: "brand-builder",
    targetKeyword: "private label vs white label coffee",
    ctaType: "build",
    ctaUrl: "/build",
    bodyFn: body5_privateLabelVsWhiteLabel,
  },
  {
    slug: "coffee-packaging-design-guide",
    title: "How to Design Coffee Packaging That Sells",
    seoTitle: "How to Design Coffee Packaging That Sells",
    seoDescription: "Design coffee packaging that converts browsers into buyers. Tips on colour, layout, bag styles, and common mistakes to avoid.",
    excerpt: "Your coffee packaging is your brand's first impression. Learn how to design bags that look premium, communicate quality, and drive sales.",
    category: "guides",
    funnelStage: "mofu",
    campaign: "brand-builder",
    targetKeyword: "coffee packaging design",
    ctaType: "build",
    ctaUrl: "/build",
    bodyFn: body6_packagingDesign,
  },
  {
    slug: "choosing-roast-profile-for-your-brand",
    title: "Choosing the Right Roast Profile for Your Brand",
    seoTitle: "Choosing the Right Roast Profile for Your Brand",
    seoDescription: "Light, medium, or dark? Learn how to choose the right roast profile for your coffee brand based on your target audience and market.",
    excerpt: "Your roast profile defines your brand's flavour identity. This guide helps you choose between light, medium, and dark based on your target audience.",
    category: "coffee",
    funnelStage: "mofu",
    campaign: "brand-builder",
    targetKeyword: "roast profile selection",
    ctaType: "build",
    ctaUrl: "/build",
    bodyFn: body7_roastProfile,
  },

  // ── Campaign 1: Brand Builder (BOFU) ──
  {
    slug: "best-white-label-coffee-partner-uk",
    title: "Why Ghost Roastery Is the UK's Best White Label Partner",
    seoTitle: "Best White Label Coffee Partner UK | Ghost Roastery",
    seoDescription: "Looking for a white label coffee partner in the UK? See why hundreds of brands trust Ghost Roastery for quality, simplicity, and speed.",
    excerpt: "Choosing the right white label partner matters. Here's why hundreds of UK brands trust Ghost Roastery for quality, simplicity, and speed to market.",
    category: "business",
    funnelStage: "bofu",
    campaign: "brand-builder",
    targetKeyword: "white label coffee partner UK",
    ctaType: "build",
    ctaUrl: "/build",
    bodyFn: body8_bestPartner,
  },
  {
    slug: "build-coffee-brand-5-steps",
    title: "From Idea to First Sale: Build Your Coffee Brand in 5 Steps",
    seoTitle: "Build Your Coffee Brand in 5 Steps",
    seoDescription: "Go from coffee brand idea to first sale in 5 clear steps. A practical, no-fluff guide to launching with white label coffee.",
    excerpt: "A practical, no-fluff guide to building your coffee brand in five clear steps — from brand identity to first sale.",
    category: "guides",
    funnelStage: "bofu",
    campaign: "brand-builder",
    targetKeyword: "build coffee brand",
    ctaType: "build",
    ctaUrl: "/build",
    bodyFn: body9_buildIn5Steps,
  },
  {
    slug: "cost-to-start-coffee-brand",
    title: "How Much Does It Cost to Start a Coffee Brand?",
    seoTitle: "How Much Does It Cost to Start a Coffee Brand?",
    seoDescription: "Realistic cost breakdown for starting a coffee brand in the UK using white label. Launch for as little as £150 with no roasting equipment.",
    excerpt: "A realistic cost breakdown for launching a white label coffee brand in the UK. Spoiler: it's far less than you think.",
    category: "business",
    funnelStage: "bofu",
    campaign: "brand-builder",
    targetKeyword: "cost to start coffee brand",
    ctaType: "build",
    ctaUrl: "/build",
    bodyFn: body10_costToStart,
  },

  // ── Campaign 2: Wholesale (TOFU) ──
  {
    slug: "branded-coffee-for-business",
    title: "Why Every Gym, Hotel & Office Needs Branded Coffee",
    seoTitle: "Branded Coffee for Business: Gyms, Hotels & Offices",
    seoDescription: "Discover why gyms, hotels, and offices are switching to branded specialty coffee — and how to set up your own supply.",
    excerpt: "Generic coffee is disappearing from smart businesses. Learn why branded specialty coffee is the new standard for gyms, hotels, and offices.",
    category: "industry",
    funnelStage: "tofu",
    campaign: "wholesale",
    targetKeyword: "branded coffee for business",
    ctaType: "wholesale",
    ctaUrl: "/wholesale",
    bodyFn: body11_brandedCoffeeForBusiness,
  },
  {
    slug: "specialty-coffee-uk-workplaces",
    title: "The Rise of Specialty Coffee in UK Workplaces",
    seoTitle: "Specialty Coffee in UK Workplaces: The New Standard",
    seoDescription: "UK workplaces are ditching instant coffee for specialty beans. Learn why — and how to upgrade your office coffee.",
    excerpt: "Instant coffee is out. Specialty beans are in. Discover how UK workplaces are upgrading their coffee and why it matters for employee satisfaction.",
    category: "industry",
    funnelStage: "tofu",
    campaign: "wholesale",
    targetKeyword: "specialty coffee workplaces UK",
    ctaType: "wholesale",
    ctaUrl: "/wholesale",
    bodyFn: body12_specialtyCoffeeWorkplaces,
  },
  {
    slug: "white-label-coffee-restaurants",
    title: "White Label Coffee for Restaurants: A Complete Guide",
    seoTitle: "White Label Coffee for Restaurants: Complete Guide",
    seoDescription: "Sell your own branded coffee in your restaurant. A complete guide to white label coffee for the hospitality industry.",
    excerpt: "Restaurants are discovering the power of house-branded coffee. Learn how white label coffee works for the hospitality industry.",
    category: "guides",
    funnelStage: "tofu",
    campaign: "wholesale",
    targetKeyword: "white label coffee restaurants",
    ctaType: "wholesale",
    ctaUrl: "/wholesale",
    bodyFn: body13_whiteLabeRestaurants,
  },

  // ── Campaign 2: Wholesale (MOFU) ──
  {
    slug: "wholesale-coffee-pricing-guide",
    title: "How Wholesale Coffee Pricing Works (And What to Expect)",
    seoTitle: "Wholesale Coffee Pricing UK: What to Expect",
    seoDescription: "Understand how wholesale coffee pricing works in the UK. Price ranges, tiered pricing, and how to calculate your retail margins.",
    excerpt: "A clear guide to wholesale coffee pricing in the UK — price ranges, tiered discounts, and how to calculate your retail margins.",
    category: "business",
    funnelStage: "mofu",
    campaign: "wholesale",
    targetKeyword: "wholesale coffee pricing",
    ctaType: "wholesale",
    ctaUrl: "/wholesale",
    bodyFn: body14_wholesalePricing,
  },
  {
    slug: "branded-vs-generic-coffee",
    title: "Branded Coffee vs Generic: Why Your Customers Care",
    seoTitle: "Branded vs Generic Coffee: Why Customers Care",
    seoDescription: "Why branded coffee outperforms generic in loyalty, perceived quality, and price. The business case for branding your coffee.",
    excerpt: "Branded coffee commands higher prices, stronger loyalty, and more word of mouth. Here's the evidence — and how to make the switch.",
    category: "business",
    funnelStage: "mofu",
    campaign: "wholesale",
    targetKeyword: "branded coffee benefits",
    ctaType: "wholesale",
    ctaUrl: "/wholesale",
    bodyFn: body15_brandedVsGeneric,
  },
  {
    slug: "choose-wholesale-coffee-supplier",
    title: "How to Choose a Wholesale Coffee Supplier",
    seoTitle: "How to Choose a Wholesale Coffee Supplier UK",
    seoDescription: "A practical guide to choosing a wholesale coffee supplier in the UK. What to look for in quality, pricing, service, and reliability.",
    excerpt: "Finding the right wholesale coffee supplier can make or break your business. Here's what to look for in quality, pricing, and service.",
    category: "guides",
    funnelStage: "mofu",
    campaign: "wholesale",
    targetKeyword: "wholesale coffee supplier UK",
    ctaType: "wholesale",
    ctaUrl: "/wholesale",
    bodyFn: body16_chooseSupplier,
  },

  // ── Campaign 2: Wholesale (BOFU) ──
  {
    slug: "ghost-roastery-wholesale-explained",
    title: "Ghost Roastery Wholesale: Pricing, MOQs & How It Works",
    seoTitle: "Ghost Roastery Wholesale: Pricing & How It Works",
    seoDescription: "Everything you need to know about Ghost Roastery's wholesale programme — pricing, MOQs, delivery, and how to get started.",
    excerpt: "Everything you need to know about Ghost Roastery wholesale — our pricing, minimum orders, delivery times, and how to get set up.",
    category: "business",
    funnelStage: "bofu",
    campaign: "wholesale",
    targetKeyword: "Ghost Roastery wholesale",
    ctaType: "wholesale",
    ctaUrl: "/wholesale",
    bodyFn: body17_wholesaleExplained,
  },
  {
    slug: "first-wholesale-coffee-order",
    title: "How to Place Your First Wholesale Coffee Order",
    seoTitle: "How to Place Your First Wholesale Coffee Order",
    seoDescription: "A step-by-step guide to placing your first wholesale coffee order. From enquiry to delivery — everything you need to know.",
    excerpt: "Placing your first wholesale coffee order is simpler than you think. This step-by-step guide walks you through the entire process.",
    category: "guides",
    funnelStage: "bofu",
    campaign: "wholesale",
    targetKeyword: "wholesale coffee order",
    ctaType: "wholesale",
    ctaUrl: "/wholesale",
    bodyFn: body18_firstWholesaleOrder,
  },
];

// ── Main Seed Function ──────────────────────────────────────────

async function seed() {
  console.log("\n🌱 Seeding 18 blog campaign articles...\n");
  console.log("Token loaded:", process.env.SANITY_API_TOKEN ? "Yes" : "No");

  for (let i = 0; i < articles.length; i++) {
    const art = articles[i];
    const publishedAt = publishDates[i];
    const id = `blog-campaign-${art.slug}`;

    console.log(`[${i + 1}/18] ${art.title}`);

    await client.createOrReplace({
      _id: id,
      _type: "blogPost",
      title: art.title,
      slug: { _type: "slug", current: art.slug },
      excerpt: art.excerpt,
      body: art.bodyFn(),
      category: art.category,
      author: "Ghost Roastery",
      publishedAt,
      audience: "consumer",
      seoTitle: art.seoTitle,
      seoDescription: art.seoDescription,
      funnelStage: art.funnelStage,
      campaign: art.campaign,
      targetKeyword: art.targetKeyword,
      ctaType: art.ctaType,
      ctaUrl: art.ctaUrl,
    });

    console.log(`  ✓ ${id}`);
  }

  console.log("\n✅ All 18 articles seeded successfully!\n");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
