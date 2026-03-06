import type { StructureResolver } from "sanity/structure";

const singletons = new Set([
  "siteSettings",
  "builderSettings",
  "roastersPageSettings",
  "customerHomePage",
  "customerAboutPage",
  "customerHowItWorksPage",
  "customerOurCoffeePage",
  "customerRoastingProcessPage",
  "customerBrandsPage",
  "customerPartnersPage",
  "customerSupportPage",
  "customerWholesalePage",
  "customerContactPage",
  "customerBlogSettings",
  "roasterFeaturesPage",
  "roasterPricingPage",
  "roasterPartnerProgramPage",
  "roasterProductsCarousel",
]);

// Types fully managed via groups below — hide from auto-generated list
const managed = new Set([
  ...singletons,
  "roasterFeature",
  "roasterFeatureDetail",
  "customerLegalPage",
  "blogPost",
  "caseStudy",
  "faq",
  "bagOptions",
  "bagColours",
  "labelTemplate",
  "svgElement",
  "wholesaleEnquiry",
  // Deprecated
  "bagSizes",
  "grindOptions",
  "roastProfiles",
  "pricingTiers",
]);

function singleton(
  S: Parameters<StructureResolver>[0],
  title: string,
  schemaType: string,
  documentId?: string
) {
  return S.listItem()
    .title(title)
    .id(documentId || schemaType)
    .child(
      S.document()
        .schemaType(schemaType)
        .documentId(documentId || schemaType)
    );
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // ── Customer Site ──────────────────────────────────────
      S.listItem()
        .title("Customer Site")
        .child(
          S.list()
            .title("Customer Site")
            .items([
              singleton(S, "Home Page", "customerHomePage"),
              singleton(S, "About", "customerAboutPage"),
              singleton(S, "How It Works", "customerHowItWorksPage"),
              singleton(S, "Our Coffee", "customerOurCoffeePage"),
              singleton(S, "Roasting Process", "customerRoastingProcessPage"),
              singleton(S, "Brands", "customerBrandsPage"),
              singleton(S, "Partners", "customerPartnersPage"),
              singleton(S, "Support", "customerSupportPage"),
              singleton(S, "Wholesale", "customerWholesalePage"),
              singleton(S, "Contact", "customerContactPage"),
              singleton(S, "Blog Settings", "customerBlogSettings"),
              S.documentTypeListItem("customerLegalPage").title("Legal Pages"),
              S.divider(),
              S.listItem()
                .title("Blog Posts")
                .child(
                  S.documentList()
                    .title("Blog Posts (Consumer)")
                    .filter(
                      '_type == "blogPost" && audience in ["consumer", "both"]'
                    )
                ),
              S.listItem()
                .title("Case Studies")
                .child(
                  S.documentList()
                    .title("Case Studies (Consumer)")
                    .filter(
                      '_type == "caseStudy" && audience in ["consumer", "both"]'
                    )
                ),
              S.listItem()
                .title("FAQs")
                .child(
                  S.documentList()
                    .title("FAQs (Consumer)")
                    .filter(
                      '_type == "faq" && category in ["bespoke", "wholesale", "general"]'
                    )
                ),
            ])
        ),

      // ── Roasters Site ─────────────────────────────────────
      S.listItem()
        .title("Roasters Site")
        .child(
          S.list()
            .title("Roasters Site")
            .items([
              singleton(S, "Home Page", "roastersPageSettings"),
              singleton(S, "Features Index", "roasterFeaturesPage"),
              S.documentTypeListItem("roasterFeatureDetail").title(
                "Feature Details"
              ),
              S.documentTypeListItem("roasterFeature").title("Features"),
              singleton(S, "Pricing", "roasterPricingPage"),
              singleton(S, "Partner Program", "roasterPartnerProgramPage"),
              singleton(S, "Products Carousel", "roasterProductsCarousel"),
              S.divider(),
              S.listItem()
                .title("Blog Posts")
                .child(
                  S.documentList()
                    .title("Blog Posts (Roasters)")
                    .filter(
                      '_type == "blogPost" && audience in ["roaster", "both"]'
                    )
                ),
              S.listItem()
                .title("Case Studies")
                .child(
                  S.documentList()
                    .title("Case Studies (Roasters)")
                    .filter(
                      '_type == "caseStudy" && audience in ["roaster", "both"]'
                    )
                ),
              S.listItem()
                .title("FAQs")
                .child(
                  S.documentList()
                    .title("FAQs (Roasters)")
                    .filter(
                      '_type == "faq" && category in ["roaster-pricing", "roaster-features"]'
                    )
                ),
            ])
        ),

      S.divider(),

      // ── Settings ───────────────────────────────────────────
      singleton(S, "Builder Settings", "builderSettings"),
      singleton(S, "Site Settings", "siteSettings"),

      S.divider(),

      // ── Product Config ─────────────────────────────────────
      S.listItem()
        .title("Product Config")
        .child(
          S.list()
            .title("Product Config")
            .items([
              S.documentTypeListItem("bagOptions").title("Bag Options"),
              S.documentTypeListItem("bagColours").title("Bag Colours"),
              S.documentTypeListItem("labelTemplate").title("Label Templates"),
              S.documentTypeListItem("svgElement").title("SVG Elements"),
            ])
        ),

      // ── Wholesale Enquiries ────────────────────────────────
      S.documentTypeListItem("wholesaleEnquiry").title("Wholesale Enquiries"),

      S.divider(),

      // ── Deprecated ─────────────────────────────────────────
      S.listItem()
        .title("Deprecated")
        .child(
          S.list()
            .title("Deprecated")
            .items([
              S.documentTypeListItem("bagSizes").title("Bag Sizes"),
              S.documentTypeListItem("grindOptions").title("Grind Options"),
              S.documentTypeListItem("roastProfiles").title("Roast Profiles"),
              S.documentTypeListItem("pricingTiers").title("Pricing Tiers"),
            ])
        ),

      // ── Any remaining types not explicitly managed ─────────
      ...S.documentTypeListItems().filter(
        (item) => !managed.has(item.getId() ?? "")
      ),
    ]);
