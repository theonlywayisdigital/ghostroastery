import { pricingTiers } from "./pricingTiers";
import { bagSizes } from "./bagSizes";
import { bagColours } from "./bagColours";
import { grindOptions } from "./grindOptions";
import { roastProfiles } from "./roastProfiles";
import { blogPost } from "./blogPost";
import { caseStudy } from "./caseStudy";
import { wholesaleEnquiry } from "./wholesaleEnquiry";
import { siteSettings } from "./siteSettings";
import { builderSettings } from "./builderSettings";
import { faq } from "./faq";
import { bagOptions } from "./bagOptions";
import { labelTemplate } from "./labelTemplate";
import { svgElement } from "./svgElement";
import { roasterFeature } from "./roasterFeature";
import { roastersPageSettings } from "./roastersPageSettings";

// Customer site schemas
import { customerHomePage } from "./customerHomePage";
import { customerAboutPage } from "./customerAboutPage";
import { customerHowItWorksPage } from "./customerHowItWorksPage";
import { customerOurCoffeePage } from "./customerOurCoffeePage";
import { customerRoastingProcessPage } from "./customerRoastingProcessPage";
import { customerBrandsPage } from "./customerBrandsPage";
import { customerPartnersPage } from "./customerPartnersPage";
import { customerSupportPage } from "./customerSupportPage";
import { customerWholesalePage } from "./customerWholesalePage";
import { customerContactPage } from "./customerContactPage";
import { customerBlogSettings } from "./customerBlogSettings";
import { customerLegalPage } from "./customerLegalPage";

// Roaster site schemas
import { roasterFeaturesPage } from "./roasterFeaturesPage";
import { roasterPricingPage } from "./roasterPricingPage";
import { roasterPartnerProgramPage } from "./roasterPartnerProgramPage";
import { roasterProductsCarousel } from "./roasterProductsCarousel";
import { roasterFeatureDetail } from "./roasterFeatureDetail";

export const schemaTypes = [
  // Content
  blogPost,
  caseStudy,
  faq,

  // Product configuration
  bagSizes,
  bagColours,
  grindOptions,
  roastProfiles,
  pricingTiers,

  // Label maker
  bagOptions,
  labelTemplate,
  svgElement,

  // Business
  wholesaleEnquiry,

  // Customer site
  customerHomePage,
  customerAboutPage,
  customerHowItWorksPage,
  customerOurCoffeePage,
  customerRoastingProcessPage,
  customerBrandsPage,
  customerPartnersPage,
  customerSupportPage,
  customerWholesalePage,
  customerContactPage,
  customerBlogSettings,
  customerLegalPage,

  // Roasters site
  roasterFeature,
  roastersPageSettings,
  roasterFeaturesPage,
  roasterPricingPage,
  roasterPartnerProgramPage,
  roasterProductsCarousel,
  roasterFeatureDetail,

  // Settings
  siteSettings,
  builderSettings,
];
