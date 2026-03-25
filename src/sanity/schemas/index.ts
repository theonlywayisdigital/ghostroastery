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
import { wholesaleSubPage } from "./wholesaleSubPage";
import { customerContactPage } from "./customerContactPage";
import { customerBlogSettings } from "./customerBlogSettings";
import { customerLegalPage } from "./customerLegalPage";

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
  wholesaleSubPage,
  customerContactPage,
  customerBlogSettings,
  customerLegalPage,

  // Settings
  siteSettings,
  builderSettings,
];
