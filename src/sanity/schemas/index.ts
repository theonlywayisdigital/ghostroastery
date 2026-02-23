import { pricingTiers } from "./pricingTiers";
import { bagSizes } from "./bagSizes";
import { bagColours } from "./bagColours";
import { grindOptions } from "./grindOptions";
import { roastProfiles } from "./roastProfiles";
import { blogPost } from "./blogPost";
import { caseStudy } from "./caseStudy";
import { wholesaleEnquiry } from "./wholesaleEnquiry";
import { siteSettings } from "./siteSettings";
import { faq } from "./faq";

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

  // Business
  wholesaleEnquiry,

  // Settings
  siteSettings,
];
